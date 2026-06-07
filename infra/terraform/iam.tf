data "aws_iam_policy_document" "lambda_ses_access" {
  statement {
    effect = "Allow"
    actions = [
      "ses:SendEmail",
      "ses:SendRawEmail",
    ]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "lambda_ses" {
  name        = "${local.name_prefix}-lambda-ses"
  description = "Allow Lambda to send emails via Amazon SES"
  policy      = data.aws_iam_policy_document.lambda_ses_access.json
  tags        = var.common_tags
}

resource "aws_iam_role_policy_attachment" "lambda_ses" {
  role       = module.api_lambda.role_name
  policy_arn = aws_iam_policy.lambda_ses.arn
}

data "aws_iam_policy_document" "lambda_dynamodb_access" {
  statement {
    effect = "Allow"
    actions = [
      "dynamodb:BatchGetItem",
      "dynamodb:BatchWriteItem",
      "dynamodb:DeleteItem",
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:UpdateItem"
    ]
    resources = concat(
      [for cfg in local.dynamodb_table_configs :
        "arn:aws:dynamodb:${var.aws_region}:${data.aws_caller_identity.current.account_id}:table/${local.name_prefix}-${cfg.name}"
      ],
      [for cfg in local.dynamodb_table_configs :
        "arn:aws:dynamodb:${var.aws_region}:${data.aws_caller_identity.current.account_id}:table/${local.name_prefix}-${cfg.name}/index/*"
      ]
    )
  }
}

resource "aws_iam_policy" "lambda_dynamodb" {
  name        = "${local.name_prefix}-lambda-dynamodb"
  description = "Allow Lambda to read/write Mini ERP DynamoDB tables and GSIs"
  policy      = data.aws_iam_policy_document.lambda_dynamodb_access.json
  tags        = var.common_tags
}

resource "aws_iam_role_policy_attachment" "lambda_dynamodb" {
  role       = module.api_lambda.role_name
  policy_arn = aws_iam_policy.lambda_dynamodb.arn
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = module.api_lambda.role_name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
