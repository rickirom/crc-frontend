output "website_url" {
  description = "HTTP URL of the website"
  value       = "http://${aws_s3_bucket.crc_bucket.bucket_regional_domain_name}"
}

output "website_bucket_name" {
  description = "Name of the S3 bucket hosting the website"
  value       = aws_s3_bucket.crc_bucket.bucket
}

output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution"
  value       = aws_cloudfront_distribution.site.id
}