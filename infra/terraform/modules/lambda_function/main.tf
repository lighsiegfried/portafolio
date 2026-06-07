variable "function_name" {
  description = "Lambda function name"
  type        = string
}

variable "zip_path" {
  description = "Path to the Lambda deployment zip file"
  type        = string
}

variable "handler" {
  description = "Lambda handler (file.function)"
  type        = string
  default     = "index.handler"
}

variable "runtime" {
  description = "Lambda runtime identifier"
  type        = string
  default     = "nodejs20.x"
}

variable "timeout" {
  description = "Function timeout in seconds"
  type        = number
  default     = 30
}

variable "memory_size" {
  description = "Function memory in MB"
  type        = number
  default     = 256
}

variable "environment_variables" {
  description = "Environment variables for the Lambda function"
  type        = map(string)
  default     = {}
}

variable "log_group_name" {
  description = "CloudWatch log group name"
  type        = string
}

variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 14
}

variable "tags" {
  description = "Common tags"
  type        = map(string)
  default     = {}
}

variable "source_account_id" {
  description = "AWS account ID for resource policies"
  type        = string
}

resource "aws_iam_role" "lambda" {
  name = "${var.function_name}-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = var.tags
}

resource "aws_lambda_function" "this" {
  function_name    = var.function_name
  filename         = var.zip_path
  handler          = var.handler
  runtime          = var.runtime
  role             = aws_iam_role.lambda.arn
  timeout          = var.timeout
  memory_size      = var.memory_size
  source_code_hash = filebase64sha256(var.zip_path)

  environment {
    variables = var.environment_variables
  }

  tags = var.tags
}

resource "aws_cloudwatch_log_group" "lambda" {
  name              = var.log_group_name
  retention_in_days = var.log_retention_days
  tags              = var.tags
}

output "function_name" {
  value = aws_lambda_function.this.function_name
}

output "function_arn" {
  value = aws_lambda_function.this.arn
}

output "invoke_arn" {
  value = aws_lambda_function.this.invoke_arn
}

output "role_name" {
  value = aws_iam_role.lambda.name
}

output "role_arn" {
  value = aws_iam_role.lambda.arn
}
