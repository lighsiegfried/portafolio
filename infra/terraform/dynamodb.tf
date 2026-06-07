module "dynamodb_tables" {
  source   = "./modules/dynamodb_table"
  for_each = { for cfg in local.dynamodb_table_configs : cfg.name => cfg }

  table_name  = "${local.name_prefix}-${each.value.name}"
  hash_key    = each.value.hash_key
  gsis        = each.value.gsis
  enable_pitr = var.enable_point_in_time_recovery
  common_tags = var.common_tags
}
