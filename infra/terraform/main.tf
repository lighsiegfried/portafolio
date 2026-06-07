# Main orchestration file
# All resources are created through specialized files and modules:
#   - s3_frontend.tf   + modules/s3_frontend/
#   - cloudfront.tf
#   - dynamodb.tf      + modules/dynamodb_table/
#   - lambda.tf        + modules/lambda_function/
#   - api_gateway.tf   + modules/api_gateway_http/
#   - iam.tf
#   - cloudwatch.tf
