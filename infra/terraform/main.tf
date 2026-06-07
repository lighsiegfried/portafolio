# Main orchestration file
#
# Terraform manages backend cloud infrastructure only.
# Frontend (S3 bucket + CloudFront) is pre-existing and NOT managed by Terraform.
#
# Active resources:
#   - dynamodb.tf      + modules/dynamodb_table/  — 8 tables PAY_PER_REQUEST
#   - lambda.tf        + modules/lambda_function/ — 1 API Lambda (Node 20.x)
#   - api_gateway.tf   + modules/api_gateway_http/ — HTTP API with CORS
#   - iam.tf           — Minimum IAM policy (Lambda → DynamoDB + Logs)
#
# Disabled (count=0 by default):
#   - s3_frontend.tf   + modules/s3_frontend/    — create_frontend_bucket = false
#   - cloudfront.tf                               — manage_cloudfront = false
