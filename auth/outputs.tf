output "github_actions_role_arn" {
  description = "ARN of the IAM role assumed by GitHub Actions via OIDC"
  value       = aws_iam_role.github_actions.arn
}

output "hcpt_role_arn" {
  description = "ARN of the IAM role assumed by HCP Terraform via OIDC. Set TFC_AWS_RUN_ROLE_ARN to this value in your HCP Terraform workspace."
  value       = aws_iam_role.hcpt.arn
}
