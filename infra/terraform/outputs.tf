output "frontend_bucket_name" {
  description = "Name of the S3 bucket serving frontend assets"
  value       = var.create_frontend_bucket ? module.frontend_bucket["frontend"].id : local.frontend_bucket_name
}

output "frontend_bucket_arn" {
  description = "ARN of the frontend S3 bucket"
  value       = var.create_frontend_bucket ? module.frontend_bucket["frontend"].arn : "arn:aws:s3:::${local.frontend_bucket_name}"
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = var.manage_cloudfront ? aws_cloudfront_distribution.main[0].id : var.existing_cloudfront_distribution_id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = var.manage_cloudfront ? aws_cloudfront_distribution.main[0].domain_name : var.existing_cloudfront_domain
}

output "api_gateway_url" {
  description = "API Gateway HTTP API endpoint URL"
  value       = module.http_api.api_endpoint
}

output "lambda_function_name" {
  description = "Lambda function name for the backend API"
  value       = module.api_lambda.function_name
}

output "lambda_role_name" {
  description = "IAM role name attached to the Lambda function"
  value       = module.api_lambda.role_name
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
  value       = aws_cloudwatch_log_group.lambda.name
}
