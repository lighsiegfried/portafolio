module "http_api" {
  source = "./modules/api_gateway_http"

  name                 = local.api_gateway_name
  lambda_invoke_arn    = module.api_lambda.invoke_arn
  lambda_function_name = module.api_lambda.function_name
  allowed_origins      = local.allowed_origins_list
  tags                 = var.common_tags
}
