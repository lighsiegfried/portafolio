variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "portafolio"
}

variable "environment" {
  description = "Deployment environment (dev, staging, production)"
  type        = string
  default     = "production"
}

variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "us-east-1"
}

variable "create_frontend_bucket" {
  description = "Whether to create a new S3 bucket for frontend assets. Set false to use an existing bucket."
  type        = bool
  default     = false
}

variable "manage_cloudfront" {
  description = "Whether to manage CloudFront distribution via Terraform. Set false to use an existing distribution."
  type        = bool
  default     = false
}

variable "frontend_bucket_name" {
  description = "Override for the S3 bucket name (defaults to computed name when create_frontend_bucket=true)"
  type        = string
  default     = null
}

variable "existing_frontend_bucket_name" {
  description = "Name of existing S3 bucket when create_frontend_bucket=false"
  type        = string
  default     = null
}

variable "existing_cloudfront_distribution_id" {
  description = "ID of existing CloudFront distribution when manage_cloudfront=false"
  type        = string
  default     = null
}

variable "existing_cloudfront_domain" {
  description = "Domain name of existing CloudFront distribution when manage_cloudfront=false"
  type        = string
  default     = null
}

variable "allowed_origins" {
  description = "Comma-separated list of allowed CORS origins"
  type        = string
  default     = "https://dxxrwydm6m8sc.cloudfront.net,http://localhost:5173"
}

variable "jwt_secret" {
  description = "Secret key for JWT token signing"
  type        = string
  sensitive   = true
}

variable "jwt_expires_in" {
  description = "JWT token expiration duration"
  type        = string
  default     = "24h"
}

variable "log_level" {
  description = "Lambda logging level (debug, info, warn, error)"
  type        = string
  default     = "INFO"
}

variable "default_low_stock_threshold" {
  description = "Default threshold for low stock alerts"
  type        = number
  default     = 5
}

variable "lambda_zip_path" {
  description = "Path to the Lambda deployment zip file"
  type        = string
  default     = "../../apps/backend/dist/lambda.zip"
}

variable "lambda_timeout" {
  description = "Lambda function timeout in seconds"
  type        = number
  default     = 10
}

variable "lambda_memory_size" {
  description = "Lambda function memory size in MB (Free Tier: 128 MB)"
  type        = number
  default     = 128
}

variable "enable_point_in_time_recovery" {
  description = "Enable DynamoDB point-in-time recovery for all tables"
  type        = bool
  default     = false
}

variable "cloudwatch_log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 7
}

variable "domain_name" {
  description = "Custom domain name for CloudFront (not used in current phase — kept for future use)"
  type        = string
  default     = null
}

variable "contact_to_email" {
  description = "Email address that receives contact form submissions"
  type        = string
  default     = ""
}

variable "contact_from_email" {
  description = "Verified SES email address used as sender for contact form emails"
  type        = string
  default     = ""
}

variable "contact_reply_to_enabled" {
  description = "Whether to set the visitor's email as Reply-To header"
  type        = string
  default     = "true"
}

variable "send_contact_confirmation" {
  description = "Whether to send a confirmation email to the visitor (set false while SES is in sandbox)"
  type        = string
  default     = "false"
}

variable "ses_region" {
  description = "AWS region for Amazon SES"
  type        = string
  default     = "us-east-1"
}

# -----------------------------------------------------------------------------
# Phase 12 — Observability & cost protection (all optional, safe defaults)
# -----------------------------------------------------------------------------

variable "lambda_reserved_concurrency" {
  description = "Reserved concurrency cap for the API Lambda (cost protection). -1 disables the cap (account default pool)."
  type        = number
  default     = 10
}

variable "api_throttling_burst_limit" {
  description = "API Gateway default-stage throttling burst limit."
  type        = number
  default     = 100
}

variable "api_throttling_rate_limit" {
  description = "API Gateway default-stage throttling steady-state rate (req/s)."
  type        = number
  default     = 50
}

variable "alarm_email" {
  description = "Optional email for CloudWatch alarm notifications. When empty, alarms are created without an SNS action (no email, no confirmation needed)."
  type        = string
  default     = ""
}

variable "lambda_error_alarm_threshold" {
  description = "Lambda Errors (Sum, 5 min) at or above which the alarm fires."
  type        = number
  default     = 5
}

variable "lambda_throttle_alarm_threshold" {
  description = "Lambda Throttles (Sum, 5 min) at or above which the alarm fires."
  type        = number
  default     = 1
}

variable "api_5xx_alarm_threshold" {
  description = "API Gateway 5xx responses (Sum, 5 min) at or above which the alarm fires."
  type        = number
  default     = 5
}

variable "enable_budget" {
  description = "Whether to create an AWS Budget. Disabled by default to avoid any account-level surprise; enable explicitly when desired."
  type        = bool
  default     = false
}

variable "budget_limit_usd" {
  description = "Monthly cost budget limit in USD (only used when enable_budget = true)."
  type        = string
  default     = "5"
}

variable "budget_notification_email" {
  description = "Email for AWS Budget alerts (required when enable_budget = true)."
  type        = string
  default     = ""
}

variable "common_tags" {
  description = "Common tags applied to all resources"
  type        = map(string)
  default = {
    Project     = "Portafolio Mini ERP"
    Environment = "production"
    Owner       = "Wilson Vasquez"
    ManagedBy   = "Terraform"
  }
}
