output "website_url" {
  description = "HTTP URL of the website"
  value       = "http://${aws_s3_bucket_website_configuration.crc_website.website_endpoint}"
}

output "website_bucket_name" {
  description = "Name of the S3 bucket hosting the website"
  value       = aws_s3_bucket.crc_bucket.bucket
}