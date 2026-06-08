variable "table_name" {
  description = "DynamoDB table name"
  type        = string
}

variable "hash_key" {
  description = "Partition key attribute name"
  type        = string
}

variable "gsis" {
  description = "List of GSI configurations"
  type = list(object({
    name     = string
    hash_key = string
  }))
  default = []
}

variable "enable_pitr" {
  description = "Enable point-in-time recovery"
  type        = bool
  default     = false
}

variable "common_tags" {
  description = "Common tags for the table"
  type        = map(string)
  default     = {}
}

resource "aws_dynamodb_table" "this" {
  name         = var.table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = var.hash_key

  attribute {
    name = var.hash_key
    type = "S"
  }

  dynamic "attribute" {
    for_each = var.gsis
    content {
      name = attribute.value.hash_key
      type = "S"
    }
  }

  dynamic "global_secondary_index" {
    for_each = var.gsis
    content {
      name            = global_secondary_index.value.name
      hash_key        = global_secondary_index.value.hash_key
      projection_type = "ALL"
    }
  }

  point_in_time_recovery {
    enabled = var.enable_pitr
  }

  tags = var.common_tags

  lifecycle {
    prevent_destroy = true
  }
}

output "table_name" {
  value = aws_dynamodb_table.this.name
}

output "table_arn" {
  value = aws_dynamodb_table.this.arn
}
