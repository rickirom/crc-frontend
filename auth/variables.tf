variable "aws_region" {
  description = "AWS region where resources will be created"
  type        = string
}

# ── GitHub Actions ─────────────────────────────────────────────────────────────

variable "github_org" {
  description = "GitHub organization or username that owns the repository"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name (without the org prefix)"
  type        = string
}

variable "github_role_name" {
  description = "Name for the IAM role assumed by GitHub Actions"
  type        = string
  default     = "github-actions-deploy"
}

# ── HCP Terraform ──────────────────────────────────────────────────────────────

variable "hcpt_org_name" {
  description = "HCP Terraform organization name"
  type        = string
}

variable "hcpt_project_name" {
  description = "HCP Terraform project name that is allowed to assume the AWS role"
  type        = string
}

variable "hcpt_workspace_name" {
  description = "HCP Terraform workspace name that is allowed to assume the AWS role. Use '*' to allow all workspaces in the project"
  type        = string
  default     = "*"
}

variable "hcpt_role_name" {
  description = "Name for the IAM role assumed by HCP Terraform"
  type        = string
  default     = "hcpt-deploy"
}

# ── Deployment targets ─────────────────────────────────────────────────────────

variable "s3_bucket_name" {
  description = "Name of the S3 bucket used to host the frontend assets"
  type        = string
}

variable "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution fronting the S3 bucket"
  type        = string
}
