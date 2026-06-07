# Lambda runtime: nodejs20.x (AWS Lambda latest stable LTS)
# Local dev uses Node 24.16.0, but Lambda runtime must match AWS availability.
# See: https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html
module "api_lambda" {
  source = "./modules/lambda_function"

  function_name         = local.lambda_function_name
  zip_path              = var.lambda_zip_path
  handler               = "index.handler"
  runtime               = "nodejs20.x"
  timeout               = var.lambda_timeout
  memory_size           = var.lambda_memory_size
  environment_variables = local.lambda_environment_variables
  log_group_name        = local.log_group_name
  log_retention_days    = var.cloudwatch_log_retention_days
  tags                  = var.common_tags
}

data "aws_caller_identity" "current" {}

resource "aws_lambda_permission" "api_gateway_invoke" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = module.api_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${module.http_api.execution_arn}/*/*"
}
