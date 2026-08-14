#######################################
#               BUCKET                #
#######################################

resource "aws_s3_bucket" "crc_bucket" {
  bucket        = "${var.environment}.${var.domain_name}"
  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "public_access" {
  bucket                  = aws_s3_bucket.crc_bucket.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

data "aws_iam_policy_document" "origin_bucket_policy" {
  statement {
    sid    = "AllowCloudFrontServicePrincipalReadWrite"
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions = [
      "s3:GetObject",
      "s3:PutObject",
    ]

    resources = [
      "${aws_s3_bucket.crc_bucket.arn}/*",
    ]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.site.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "origin_bucket_policy" {
  bucket = aws_s3_bucket.crc_bucket.id
  policy = data.aws_iam_policy_document.origin_bucket_policy.json
}

#######################################
#                 TLS                 #
#######################################

provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

resource "aws_acm_certificate" "crc_cert" {
  provider          = aws.us_east_1
  domain_name       = "${var.environment}.${var.domain_name}"
  validation_method = "DNS"
  lifecycle { create_before_destroy = true }
}

resource "aws_acm_certificate_validation" "crc_cert_validation" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.crc_cert.arn
  validation_record_fqdns = [for r in cloudflare_dns_record.cert_validation : r.name]
}


#######################################
#              CLOUDFRONT             #
#######################################

resource "aws_cloudfront_origin_access_control" "site" {
  name                              = "${aws_s3_bucket.crc_bucket.id}-oac"
  description                       = "OAC for ${var.domain_name}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# AWS-managed cache policy — the modern replacement for forwarded_values.
data "aws_cloudfront_cache_policy" "caching_optimized" {
  name = "Managed-CachingOptimized"
}

resource "aws_cloudfront_distribution" "site" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = var.domain_name
  default_root_object = "index.html"
  aliases             = ["${var.environment}.${var.domain_name}"]

  origin {
    origin_id                = "s3-${aws_s3_bucket.crc_bucket.id}"
    domain_name              = aws_s3_bucket.crc_bucket.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.site.id
    # No s3_origin_config / custom_origin_config: OAC handles signing.
  }

  default_cache_behavior {
    target_origin_id       = "s3-${aws_s3_bucket.crc_bucket.id}"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true
    cache_policy_id        = data.aws_cloudfront_cache_policy.caching_optimized.id
  }

  # SPA fallback: a private bucket returns 403 for missing keys, so map both
  # 403 and 404 back to index.html. DELETE these two blocks if this is a plain
  # multi-page static site (you'd want real 404s instead).
  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/404.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.crc_cert_validation.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}
