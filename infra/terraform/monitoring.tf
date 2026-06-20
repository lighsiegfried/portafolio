# =============================================================================
# Observability & cost protection (Phase 12)
#
# Low-cost CloudWatch alarms for the API Lambda + HTTP API, an optional SNS
# email notification, and an optional AWS Budget. All additions are Free-Tier
# friendly: CloudWatch alarms (first 10 free), SNS (first 1k email notifications
# free), one AWS Budget (first two budgets free). WAF is intentionally untouched.
# =============================================================================

locals {
  alarm_email_enabled = trimspace(var.alarm_email) != ""
  budget_enabled      = var.enable_budget && trimspace(var.budget_notification_email) != ""
  # Alarm actions only exist when an email/SNS topic is configured; otherwise
  # alarms still evaluate and are visible in the console (no action attached).
  alarm_actions = local.alarm_email_enabled ? [aws_sns_topic.alarms[0].arn] : []
}

# --- Optional SNS topic + email subscription for alarm notifications ---------
resource "aws_sns_topic" "alarms" {
  count = local.alarm_email_enabled ? 1 : 0

  name = "${local.name_prefix}-alarms"
  tags = var.common_tags
}

resource "aws_sns_topic_subscription" "alarms_email" {
  count = local.alarm_email_enabled ? 1 : 0

  topic_arn = aws_sns_topic.alarms[0].arn
  protocol  = "email"
  endpoint  = var.alarm_email
}

# --- Lambda: function errors --------------------------------------------------
resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  alarm_name          = "${local.name_prefix}-lambda-errors"
  alarm_description   = "API Lambda returned ${var.lambda_error_alarm_threshold}+ errors in 5 minutes."
  namespace           = "AWS/Lambda"
  metric_name         = "Errors"
  statistic           = "Sum"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  threshold           = var.lambda_error_alarm_threshold
  period              = 300
  evaluation_periods  = 1
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = module.api_lambda.function_name
  }

  alarm_actions = local.alarm_actions
  ok_actions    = local.alarm_actions
  tags          = var.common_tags
}

# --- Lambda: throttles (cost / concurrency pressure) --------------------------
resource "aws_cloudwatch_metric_alarm" "lambda_throttles" {
  alarm_name          = "${local.name_prefix}-lambda-throttles"
  alarm_description   = "API Lambda was throttled ${var.lambda_throttle_alarm_threshold}+ times in 5 minutes (review reserved concurrency)."
  namespace           = "AWS/Lambda"
  metric_name         = "Throttles"
  statistic           = "Sum"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  threshold           = var.lambda_throttle_alarm_threshold
  period              = 300
  evaluation_periods  = 1
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = module.api_lambda.function_name
  }

  alarm_actions = local.alarm_actions
  ok_actions    = local.alarm_actions
  tags          = var.common_tags
}

# --- API Gateway HTTP API: 5xx responses --------------------------------------
# HTTP API (v2) emits the "5xx" metric under AWS/ApiGateway keyed by ApiId.
resource "aws_cloudwatch_metric_alarm" "api_5xx" {
  alarm_name          = "${local.name_prefix}-api-5xx"
  alarm_description   = "HTTP API returned ${var.api_5xx_alarm_threshold}+ 5xx responses in 5 minutes."
  namespace           = "AWS/ApiGateway"
  metric_name         = "5xx"
  statistic           = "Sum"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  threshold           = var.api_5xx_alarm_threshold
  period              = 300
  evaluation_periods  = 1
  treat_missing_data  = "notBreaching"

  dimensions = {
    ApiId = module.http_api.api_id
  }

  alarm_actions = local.alarm_actions
  ok_actions    = local.alarm_actions
  tags          = var.common_tags
}

# --- Optional AWS Budget (disabled by default) --------------------------------
resource "aws_budgets_budget" "monthly_cost" {
  count = local.budget_enabled ? 1 : 0

  name         = "${local.name_prefix}-monthly-cost"
  budget_type  = "COST"
  limit_amount = var.budget_limit_usd
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 80
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [var.budget_notification_email]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 100
    threshold_type             = "PERCENTAGE"
    notification_type          = "FORECASTED"
    subscriber_email_addresses = [var.budget_notification_email]
  }
}
