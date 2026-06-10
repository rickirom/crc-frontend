# ── GitHub Actions OIDC ────────────────────────────────────────────────────────
#
# Allows GitHub Actions workflows in the configured repo to assume an AWS IAM
# role via OIDC — no long-lived credentials required.
#
# Thumbprint list: GitHub rotates these occasionally. The value below is the
# current thumbprint for token.actions.githubusercontent.com. AWS now also
# validates the OIDC token against the GitHub JWKS endpoint directly, so the
# thumbprint is largely a formality, but it is still a required field.

resource "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"

  client_id_list = ["sts.amazonaws.com"]

  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
}

data "aws_iam_policy_document" "github_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    # Restrict to the specific repo. Adjust the ref filter if you want to
    # lock down to a branch (e.g. "repo:org/repo:ref:refs/heads/main").
    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${var.github_org}/${var.github_repo}:*"]
    }
  }
}

resource "aws_iam_role" "github_actions" {
  name               = var.github_role_name
  assume_role_policy = data.aws_iam_policy_document.github_assume_role.json

  tags = {
    ManagedBy = "terraform"
    Purpose   = "github-actions-oidc"
  }
}

# Deploy policy: sync assets to S3 and invalidate the CloudFront cache.
data "aws_iam_policy_document" "github_deploy" {
  statement {
    sid    = "S3ReadWrite"
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
      "s3:ListBucket",
    ]
    resources = [
      "arn:aws:s3:::${var.s3_bucket_name}",
      "arn:aws:s3:::${var.s3_bucket_name}/*",
    ]
  }

  statement {
    sid    = "CloudFrontInvalidate"
    effect = "Allow"
    actions = [
      "cloudfront:CreateInvalidation",
    ]
    resources = [
      "arn:aws:cloudfront::*:distribution/${var.cloudfront_distribution_id}",
    ]
  }
}

resource "aws_iam_role_policy" "github_deploy" {
  name   = "deploy"
  role   = aws_iam_role.github_actions.id
  policy = data.aws_iam_policy_document.github_deploy.json
}
