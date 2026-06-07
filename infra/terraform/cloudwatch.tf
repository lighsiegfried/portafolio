resource "aws_cloudwatch_log_group" "lambda" {
  name              = local.log_group_name
  retention_in_days = var.cloudwatch_log_retention_days
  tags              = var.common_tags
}
