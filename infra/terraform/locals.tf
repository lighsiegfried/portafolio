locals {
  name_prefix = "${var.project_name}-${var.environment}"

  frontend_bucket_name = var.create_frontend_bucket ? (
    var.frontend_bucket_name != null ? var.frontend_bucket_name : "${local.name_prefix}-frontend"
    ) : (
    var.existing_frontend_bucket_name != null ? var.existing_frontend_bucket_name : "${local.name_prefix}-frontend"
  )

  lambda_function_name = "${local.name_prefix}-api"

  api_gateway_name = "${local.name_prefix}-api"

  log_group_name = "/aws/lambda/${local.name_prefix}-api"

  allowed_origins_list = split(",", var.allowed_origins)

  dynamodb_table_configs = [
    {
      name     = "users"
      hash_key = "id"
      gsis = [
        { name = "username-index", hash_key = "username" }
      ]
    },
    {
      name     = "products"
      hash_key = "id"
      gsis = [
        { name = "sku-index", hash_key = "sku" },
        { name = "category-index", hash_key = "category" }
      ]
    },
    {
      name     = "requisitions"
      hash_key = "id"
      gsis = [
        { name = "status-index", hash_key = "status" },
        { name = "createdBy-index", hash_key = "createdBy" }
      ]
    },
    {
      name     = "requisition-items"
      hash_key = "id"
      gsis = [
        { name = "requisitionId-index", hash_key = "requisitionId" }
      ]
    },
    {
      name     = "inventory-movements"
      hash_key = "id"
      gsis = [
        { name = "productId-index", hash_key = "productId" }
      ]
    },
    {
      name     = "leads"
      hash_key = "id"
      gsis = [
        { name = "assignedTo-index", hash_key = "assignedTo" }
      ]
    },
    {
      name     = "lead-notes"
      hash_key = "id"
      gsis = [
        { name = "leadId-index", hash_key = "leadId" }
      ]
    },
    {
      name     = "audit-events"
      hash_key = "id"
      gsis = [
        { name = "entityType-index", hash_key = "entityType" }
      ]
    }
  ]

  lambda_environment_variables = {
    NODE_ENV                    = var.environment == "prod" ? "production" : var.environment
    DATA_SOURCE                 = "dynamodb"
    JWT_SECRET                  = var.jwt_secret
    JWT_EXPIRES_IN              = var.jwt_expires_in
    DYNAMODB_TABLE_PREFIX       = "${local.name_prefix}-"
    DYNAMODB_REGION             = var.aws_region
    LOG_LEVEL                   = var.log_level
    DEFAULT_LOW_STOCK_THRESHOLD = tostring(var.default_low_stock_threshold)
    CORS_ORIGIN                 = var.allowed_origins
  }
}
