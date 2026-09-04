# CRC Frontend Infra
Deploys resources for the frontend:
- Bucket
- Cloudfront distribution
- Cloudflare DNS
- Certificates with ACM

Use local `.tfvars` files for development. Use secure variables in HCP Terraform for production

Target dev account when running locally. Target prod account when running from HCP Terraform

## New: Export vars using 1P CLI:
```bash 
export TF_VAR_cloudflare_api_token=$(op item get "Cloudflare API" --fields password --reveal)
```