variable "aws_region" {
  description = "AWS Region for the CRC infrastructure."
  type        = string
  default     = "eu-central-1"
}

variable "bucket_prefix" {
  description = "Prefix to put in front of the bucket name."
  type        = string
  default     = "rickirom"
}

variable "domain_name" {
  description = "Domain name for the website."
  type        = string
  default     = "riki.sh"
}

variable "environment" {
  description = "Environment name for the deployment."
  type        = string
  default     = "dev"
}

variable "cloudflare_email" {
  description = "Cloudflare email for the website."
  type        = string
  default     = "your_cloudflare_email"
}

variable "cloudflare_api_token" {
  description = "Cloudflare API token for the website."
  type        = string
  default     = "your_cloudflare_api_token"
}