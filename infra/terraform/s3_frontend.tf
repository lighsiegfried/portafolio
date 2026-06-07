# WARNING: Frontend S3 bucket management is DISABLED by default.
# Both `create_frontend_bucket` and `manage_cloudfront` default to `false`.
# The existing bucket (wilsonvasquezcvaws) is managed outside Terraform.

module "frontend_bucket" {
  source   = "./modules/s3_frontend"
  for_each = var.create_frontend_bucket ? { frontend = local.frontend_bucket_name } : {}

  bucket_name = each.value
  tags        = var.common_tags
}

data "aws_iam_policy_document" "cloudfront_oac_access" {
  count = var.create_frontend_bucket && var.manage_cloudfront ? 1 : 0

  statement {
    actions   = ["s3:GetObject"]
    resources = ["${module.frontend_bucket["frontend"].arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.main[0].arn]
    }
  }
}

resource "aws_s3_bucket_policy" "frontend_oac" {
  count  = var.create_frontend_bucket && var.manage_cloudfront ? 1 : 0
  bucket = module.frontend_bucket["frontend"].id
  policy = data.aws_iam_policy_document.cloudfront_oac_access[0].json
}
