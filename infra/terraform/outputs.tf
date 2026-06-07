# =============================================================================
# Backend outputs — created by Terraform
# =============================================================================

output "api_gateway_url" {
  description = "API Gateway HTTP API endpoint URL"
  value       = module.http_api.api_endpoint
}

output "lambda_function_name" {
  description = "Lambda function name for the backend API"
  value       = module.api_lambda.function_name
}

output "dynamodb_table_names" {
  description = "Map of logical entity names to DynamoDB table names"
  value = {
    for cfg in local.dynamodb_table_configs :
    cfg.name => "${local.name_prefix}-${cfg.name}"
  }
}

output "log_group_name" {
  description = "CloudWatch log group name for Lambda"
  value       = local.log_group_name
}

# =============================================================================
# Frontend references — existing resources, NOT managed by Terraform
# =============================================================================

output "existing_frontend_bucket_name" {
  description = "Name of the existing S3 bucket serving frontend assets"
  value       = var.existing_frontend_bucket_name
}

output "existing_cloudfront_distribution_id" {
  description = "ID of the existing CloudFront distribution"
  value       = var.existing_cloudfront_distribution_id
}

output "existing_cloudfront_domain" {
  description = "Domain name of the existing CloudFront distribution"
  value       = var.existing_cloudfront_domain
}
