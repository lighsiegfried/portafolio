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
# Operations — observability & cost protection (Phase 12)
# =============================================================================

output "lambda_reserved_concurrency" {
  description = "Reserved concurrency cap on the API Lambda (-1 = unreserved)."
  value       = module.api_lambda.reserved_concurrent_executions
}

output "api_throttling" {
  description = "API Gateway default-stage throttling limits."
  value = {
    burst_limit = var.api_throttling_burst_limit
    rate_limit  = var.api_throttling_rate_limit
  }
}

output "cloudwatch_alarm_names" {
  description = "Names of the CloudWatch alarms guarding the API."
  value = {
    lambda_errors    = aws_cloudwatch_metric_alarm.lambda_errors.alarm_name
    lambda_throttles = aws_cloudwatch_metric_alarm.lambda_throttles.alarm_name
    api_5xx          = aws_cloudwatch_metric_alarm.api_5xx.alarm_name
  }
}

output "alarm_sns_topic_arn" {
  description = "ARN of the alarm SNS topic (null when alarm_email is not set)."
  value       = local.alarm_email_enabled ? aws_sns_topic.alarms[0].arn : null
}

output "budget_name" {
  description = "Name of the monthly AWS Budget (null when enable_budget is false)."
  value       = local.budget_enabled ? aws_budgets_budget.monthly_cost[0].name : null
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
