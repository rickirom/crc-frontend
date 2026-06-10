# ── HCP Terraform OIDC ─────────────────────────────────────────────────────────
#
# Allows HCP Terraform (app.terraform.io) workloads to assume an AWS IAM role
# via OIDC using dynamic provider credentials — no static AWS keys stored in
# HCP Terraform variables.
#
# After applying, configure the workspace to use dynamic credentials by setting
# these environment variables in HCP Terraform:
#
#   TFC_AWS_PROVIDER_AUTH = "true"
#   TFC_AWS_RUN_ROLE_ARN  = "<hcpt_role ARN from outputs>"

resource "aws_iam_openid_connect_provider" "hcpt" {
  url = "https://app.terraform.io"

  # HCP Terraform uses this audience value for AWS dynamic credentials.
  client_id_list = ["aws.workload.identity"]

  # Thumbprint for app.terraform.io. AWS validates against the JWKS endpoint
  # but the field is still required.
  thumbprint_list = ["9e99a48a9960b14926bb7f3b02e22da2b0ab7280"]
}

data "aws_iam_policy_document" "hcpt_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.hcpt.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "app.terraform.io:aud"
      values   = ["aws.workload.identity"]
    }

    # Lock down to the specific org / project / workspace.
    # run_phase:* covers both plan and apply phases.
    condition {
      test     = "StringLike"
      variable = "app.terraform.io:sub"
      values = [
        "organization:${var.hcpt_org_name}:project:${var.hcpt_project_name}:workspace:${var.hcpt_workspace_name}:run_phase:*"
      ]
    }
  }
}

resource "aws_iam_role" "hcpt" {
  name               = var.hcpt_role_name
  assume_role_policy = data.aws_iam_policy_document.hcpt_assume_role.json

  tags = {
    ManagedBy = "terraform"
    Purpose   = "hcpt-oidc"
  }
}

# HCP Terraform needs the same deploy permissions as GH Actions to provision
# and update the frontend infrastructure (S3 + CloudFront).
data "aws_iam_policy_document" "hcpt_deploy" {
  statement {
    sid    = "S3ReadWrite"
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
      "s3:ListBucket",
      "s3:GetBucketPolicy",
      "s3:PutBucketPolicy",
      "s3:GetBucketWebsite",
      "s3:PutBucketWebsite",
      "s3:GetBucketPublicAccessBlock",
      "s3:PutBucketPublicAccessBlock",
    ]
    resources = [
      "arn:aws:s3:::${var.s3_bucket_name}",
      "arn:aws:s3:::${var.s3_bucket_name}/*",
    ]
  }

  statement {
    sid    = "CloudFrontManage"
    effect = "Allow"
    actions = [
      "cloudfront:CreateInvalidation",
      "cloudfront:GetDistribution",
      "cloudfront:UpdateDistribution",
    ]
    resources = [
      "arn:aws:cloudfront::*:distribution/${var.cloudfront_distribution_id}",
    ]
  }
}

resource "aws_iam_role_policy" "hcpt_deploy" {
  name   = "deploy"
  role   = aws_iam_role.hcpt.id
  policy = data.aws_iam_policy_document.hcpt_deploy.json
}
