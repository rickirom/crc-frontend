# CRC Frontend - Auth

This directory contains the auth configuration required to deploy the frontend-related stuff:

- GH Actions to HCP Terraform: a single user API token. This is configured manually
- GH Actions to AWS: OIDC this is configured via Terraform
- HCP Terraform to AWS: OIDC also configured with TF
