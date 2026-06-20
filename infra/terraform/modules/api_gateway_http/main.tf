variable "name" {
  description = "API Gateway HTTP API name"
  type        = string
}

variable "lambda_invoke_arn" {
  description = "Lambda function invoke ARN"
  type        = string
}

variable "lambda_function_name" {
  description = "Lambda function name (for permission)"
  type        = string
}

variable "allowed_origins" {
  description = "List of allowed CORS origins"
  type        = list(string)
}

variable "throttling_burst_limit" {
  description = "Default stage throttling burst limit (cost/abuse protection)"
  type        = number
  default     = 100
}

variable "throttling_rate_limit" {
  description = "Default stage throttling steady-state rate limit (req/s)"
  type        = number
  default     = 50
}

variable "tags" {
  description = "Common tags"
  type        = map(string)
  default     = {}
}

resource "aws_apigatewayv2_api" "this" {
  name          = var.name
  protocol_type = "HTTP"
  tags          = var.tags

  cors_configuration {
    allow_origins  = var.allowed_origins
    allow_methods  = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    allow_headers  = ["Content-Type", "Authorization", "X-Amz-Date", "X-Api-Key", "X-Amz-Security-Token"]
    expose_headers = ["Content-Type", "X-Amzn-ErrorMessage"]
    max_age        = 86400
  }
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id                 = aws_apigatewayv2_api.this.id
  integration_type       = "AWS_PROXY"
  integration_method     = "POST"
  integration_uri        = var.lambda_invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "any_proxy" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_route" "root" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "ANY /"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_deployment" "this" {
  api_id = aws_apigatewayv2_api.this.id

  lifecycle {
    create_before_destroy = true
  }

  triggers = {
    redeployment = sha1(jsonencode([
      aws_apigatewayv2_integration.lambda.id,
      aws_apigatewayv2_route.any_proxy.id,
      aws_apigatewayv2_route.root.id,
    ]))
  }

  depends_on = [
    aws_apigatewayv2_route.any_proxy,
    aws_apigatewayv2_route.root,
  ]
}

resource "aws_apigatewayv2_stage" "default" {
  api_id        = aws_apigatewayv2_api.this.id
  name          = "$default"
  auto_deploy   = true
  deployment_id = aws_apigatewayv2_deployment.this.id

  default_route_settings {
    throttling_burst_limit = var.throttling_burst_limit
    throttling_rate_limit  = var.throttling_rate_limit
  }

  tags = var.tags
}

output "api_endpoint" {
  value = aws_apigatewayv2_api.this.api_endpoint
}

output "api_id" {
  value = aws_apigatewayv2_api.this.id
}

output "execution_arn" {
  value = aws_apigatewayv2_api.this.execution_arn
}

output "stage_name" {
  value = aws_apigatewayv2_stage.default.name
}
