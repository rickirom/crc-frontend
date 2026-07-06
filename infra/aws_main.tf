#######################################
#               BUCKET                #
#######################################

resource "aws_s3_bucket" "crc_bucket" {
  bucket        = "${var.environment}.${var.domain_name}"
  force_destroy = true
}

resource "aws_s3_bucket_website_configuration" "crc_website" {
  bucket = aws_s3_bucket.crc_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_public_access_block" "public_access" {
  bucket                  = aws_s3_bucket.crc_bucket.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

#i need to access the bucket from the internet so:
resource "aws_s3_bucket_policy" "hosting_bucket_policy" {
  bucket = aws_s3_bucket.crc_bucket.id

  depends_on = [aws_s3_bucket_public_access_block.public_access] #otherwise we get a permission denied error

  policy = jsonencode({
    "Version" : "2012-10-17"
    "Statement" : [
      {
        "Effect" : "Allow"
        "Principal" : "*"
        "Action" : "s3:GetObject"
        "Resource" : "${aws_s3_bucket.crc_bucket.arn}/*"
      }
    ]
  })
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
    response_page_path = "/index.html"
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
