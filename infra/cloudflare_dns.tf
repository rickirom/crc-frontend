data "cloudflare_zone" "r2" {
  filter = {
    name = var.cloudflare_domain
  }
}

# Cloudflare provider v5: resource is cloudflare_dns_record, field is `content`.
# On v4 it's cloudflare_record with `value`.
resource "cloudflare_dns_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.crc_cert.domain_validation_options :
    dvo.domain_name => {
      name    = dvo.resource_record_name
      content = dvo.resource_record_value
      type    = dvo.resource_record_type
    }
  }
  zone_id = data.cloudflare_zone.r2.id
  name    = each.value.name
  content = each.value.content
  type    = each.value.type
  ttl     = 60
  proxied = false
}

resource "cloudflare_dns_record" "website" {
  zone_id = data.cloudflare_zone.r2.id
  name    = "${var.environment}.${var.cloudflare_domain}"
  content = aws_s3_bucket_website_configuration.crc_website.website_endpoint
  type    = "CNAME"
  ttl     = 60
  proxied = false
}