# Terraform — Infraestructura como Código

## Estado actual

Esta carpeta está reservada para la infraestructura como código usando **Terraform HCL**.
Todavía **no hay implementación**.

## Stack futuro

| Servicio | Propósito |
|----------|-----------|
| S3 (privado) | Hosting del frontend |
| CloudFront + OAC | CDN con origen privado |
| API Gateway HTTP API | Endpoints serverless |
| Lambda (Node.js) | Lógica de negocio |
| DynamoDB (on-demand) | Persistencia demo |
| IAM | Roles y políticas de mínimo privilegio |
| CloudWatch Logs | Monitoreo y logs |

## Reglas importantes

- **Terraform NO es YAML.** Usa HCL (HashiCorp Configuration Language).
- **YAML** se usa exclusivamente para los pipelines de GitHub Actions.
- **No ejecutar `terraform apply` sin aprobación humana.** Solo `plan`, `validate` y `fmt`.
- No hardcodear secretos. Usar variables de entorno y GitHub Secrets.
