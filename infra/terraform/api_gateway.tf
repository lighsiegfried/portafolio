module "http_api" {
  source = "./modules/api_gateway_http"

  name                   = local.api_gateway_name
  lambda_invoke_arn      = module.api_lambda.invoke_arn
  lambda_function_name   = module.api_lambda.function_name
  allowed_origins        = local.allowed_origins_list
  throttling_burst_limit = var.api_throttling_burst_limit
  throttling_rate_limit  = var.api_throttling_rate_limit
  tags                   = var.common_tags
}
