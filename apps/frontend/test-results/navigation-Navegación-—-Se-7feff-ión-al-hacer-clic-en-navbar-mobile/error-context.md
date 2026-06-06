# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.js >> Navegación — Secciones visibles >> scroll a sección al hacer clic en navbar
- Location: e2e\tests\navigation.spec.js:32:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('nav a[href="#contact"]').first()
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('nav a[href="#contact"]').first()
    12 × locator resolved to <a href="#contact">Contacto</a>
       - unexpected value "hidden"

```

```yaml
- navigation:
  - link "logo Wilson":
    - /url: /
    - img "logo"
    - paragraph: Wilson
  - img "menu"
- heading "Hola, soy Wilson Vásquez" [level=1]
- paragraph: Software Engineer enfocado ensistemas empresariales, cloud e IA
- paragraph: Construyo soluciones full-stack, automatizaciones yarquitecturas cloud pensadas para operación real.
- link:
  - /url: "#about"
- paragraph: Información
- heading "Sobre mí" [level=2]
- paragraph: Soy estudiante de último año de Ingeniería en Sistemas y Ciencias de la Computación, con experiencia desarrollando y modernizando sistemas empresariales, módulos ERP/CRM y soluciones internas para operación. He trabajado en entornos donde el software debe ser estable, documentado y útil para áreas como compras, inventario, reportería, infraestructura y soporte operativo.
- paragraph: Mi enfoque combina desarrollo full-stack, optimización SQL, administración de servidores Linux, contenedores Docker, automatización con IA y despliegues en AWS. Me interesa construir soluciones claras, mantenibles y bien documentadas, especialmente cuando conectan software, infraestructura y procesos de negocio.
- img "web-development"
- heading "Full-Stack Developer" [level=3]
- img "web-development"
- heading "Cloud & DevOps" [level=3]
- img "web-development"
- heading "ERP / CRM Systems" [level=3]
- img "web-development"
- heading "AI & Automation" [level=3]
- paragraph: Áreas de experiencia
- heading "Experiencia técnica validada" [level=2]
- paragraph: "Estas áreas resumen el tipo de problemas técnicos en los que he trabajado: modernización de sistemas, infraestructura cloud, automatización, continuidad operativa y desarrollo de soluciones empresariales."
- heading "Cloud & DevOps" [level=3]
- paragraph: Despliegue y administración de soluciones en AWS, contenedores Docker, CI/CD con GitHub Actions, gestión IAM, CloudFront, ECS/ECR, EC2 y prácticas de mínimo privilegio.
- text: AWS Docker GitHub Actions IAM CloudFront ECS ECR EC2
- heading "Sistemas empresariales" [level=3]
- paragraph: Diseño y desarrollo de módulos ERP/CRM orientados a compras, requisiciones, inventario, reportería, aprobaciones y operación administrativa.
- text: ERP CRM SQL APIs REST Requisiciones Inventario Reportes
- heading "Infraestructura & continuidad" [level=3]
- paragraph: Administración de servidores Linux, respaldo de información, documentación técnica, bases de conocimiento, estrategias BCP/DRP y soporte a operación crítica.
- text: Linux BCP/DRP Backups 3-2-1 NAS Documentación Power BI
- paragraph: Logros y responsabilidades
- heading "Experiencia" [level=2]
- paragraph: Stack tecnológico
- heading "Tecnologías" [level=2]
- paragraph: Tecnologías con las que he trabajado en producción, proyectos personales y laboratorio técnico.
- heading "Frontend" [level=3]
- text: React Vite JavaScript TypeScript Tailwind Three.js
- heading "Backend & APIs" [level=3]
- text: Node.js Laravel PHP Java REST APIs SQL
- heading "Cloud & DevOps" [level=3]
- text: AWS Docker GitHub Actions Linux IAM CloudFront
- heading "Data & BI" [level=3]
- text: SQL Power BI ETL Stored Procedures Reporting
- heading "AI & Automation" [level=3]
- text: LLMs agentes internos automatización documental flujos asistidos
- paragraph: Evidencia técnica
- heading "Casos de estudio y proyectos" [level=2]
- paragraph: "Estos proyectos muestran diferentes etapas de mi experiencia: desde sistemas empresariales y arquitectura cloud hasta proyectos iniciales que forman parte de mi base técnica."
- heading "Proyectos profesionales / arquitectura" [level=3]
- img "project_image"
- heading "Portafolio AWS Serverless" [level=3]
- paragraph: Portafolio profesional desplegado en AWS con frontend estático en S3 privado, distribución por CloudFront, Origin Access Control y protección a nivel de aplicación mediante WAF. El proyecto evoluciona hacia una arquitectura cloud-native con backend serverless e infraestructura como código.
- paragraph: "#React"
- paragraph: "#Vite"
- paragraph: "#AWS S3"
- paragraph: "#CloudFront"
- paragraph: "#OAC"
- paragraph: "#WAF"
- paragraph: "#CI/CD"
- img "project_image"
- heading "Mini ERP Cloud-Native para PyME" [level=3]
- paragraph: Caso de estudio en desarrollo para demostrar un sistema empresarial pequeño, limpio y documentado con login por roles, requisiciones, aprobaciones, inventario, dashboard, API REST, reportes, CI/CD e infraestructura en AWS.
- paragraph: "#React"
- paragraph: "#Node.js"
- paragraph: "#AWS Lambda"
- paragraph: "#API Gateway"
- paragraph: "#DynamoDB"
- paragraph: "#Terraform"
- paragraph: "#GitHub Actions"
- img "project_image"
- heading "ERP / Requisiciones / Compras" [level=3]
- paragraph: Experiencia aplicada en modernización y mejora de módulos ERP orientados a compras, requisiciones, flujos de aprobación, reportería y optimización de consultas SQL.
- paragraph: "#PHP"
- paragraph: "#JavaScript"
- paragraph: "#SQL"
- paragraph: "#MVC"
- paragraph: "#Power BI"
- paragraph: "#Linux"
- heading "Proyectos iniciales / académicos" [level=3]
- img "project_image"
- img "source code"
- heading "Inventario (Java EE)" [level=3]
- paragraph: Sistema web para gestión de inventarios de proveedores desarrollado con Java EE, PrimeFaces y MySQL sobre servidor GlassFish.
- paragraph: "#PrimeFaces"
- paragraph: "#MySQL"
- paragraph: "#Java EE"
- img "project_image"
- img "source code"
- heading "HTML + CSS + JavaScript" [level=3]
- paragraph: Página web con HTML, CSS y JavaScript nativo. Incluye maquetación y animaciones básicas.
- paragraph: "#HTML"
- paragraph: "#CSS"
- paragraph: "#JavaScript"
- img "project_image"
- img "source code"
- heading "Java Base App" [level=3]
- paragraph: Aplicación Java de escritorio para visualización y modificación de datos desde archivos Excel con estructura de árbol.
- paragraph: "#Java"
- img "project_image"
- img "source code"
- heading "CRUD en Node.js" [level=3]
- paragraph: API REST construida con Node.js, PHP y jQuery para operaciones CRUD con integración frontend-backend.
- paragraph: "#PHP"
- paragraph: "#jQuery"
- paragraph: "#Bootstrap"
- paragraph: "#Node.js"
- img "project_image"
- img "source code"
- heading "Modelado 3D Web" [level=3]
- paragraph: Aplicación web para modelado y previsualización de productos 3D utilizando Next.js, Three.js, React Three Fiber y Drei.
- paragraph: "#Next.js"
- paragraph: "#Three.js"
- paragraph: "#React Three Fiber"
- paragraph: "#Drei"
- paragraph: "#Tailwind CSS"
- paragraph: Criterio técnico
- heading "Decisiones técnicas" [level=2]
- paragraph: Más que mostrar solo tecnologías, este portafolio documenta decisiones de arquitectura, despliegue y mantenimiento tomadas para construir soluciones más estables, seguras y fáciles de evolucionar.
- paragraph: </>
- paragraph: Frontend desacoplado y distribuido por CDN
- paragraph: El portafolio utiliza una SPA en React/Vite con assets estáticos distribuidos mediante CloudFront, separando la capa visual de futuras APIs o servicios backend.
- paragraph: </>
- paragraph: Arquitectura preparada para serverless
- paragraph: La evolución del proyecto contempla API Gateway, Lambda y DynamoDB para agregar funciones de Mini ERP/CRM Lite sin administrar servidores directamente.
- paragraph: </>
- paragraph: IaC y CI/CD como evidencia técnica
- paragraph: La infraestructura será documentada y versionada con Terraform, mientras que los despliegues se automatizarán con GitHub Actions y OIDC para evitar credenciales estáticas.
- paragraph: </>
- paragraph: Documentación como parte del producto
- paragraph: El proyecto incluirá README técnico, diagramas, decisiones de arquitectura y guías de despliegue para que el código pueda ser entendido y auditado fácilmente.
- paragraph: Cloud architecture
- heading "Arquitectura AWS" [level=2]
- paragraph: Este portafolio no solo funciona como presentación profesional; también evoluciona como laboratorio cloud para demostrar despliegue, seguridad, automatización e infraestructura como código.
- heading "Arquitectura actual" [level=3]
- paragraph: Frontend React/Vite desplegado como sitio estático, distribuido mediante Amazon CloudFront desde un origen S3 privado con Origin Access Control. La capa de seguridad puede complementarse con AWS WAF para protección a nivel de aplicación.
- text: Usuario -> CloudFront -> S3 privado | React/Vite SPA S3 CloudFront OAC WAF React Vite
- heading "Evolución serverless" [level=3]
- paragraph: La siguiente fase agregará una API serverless para un Mini ERP/CRM Lite, usando API Gateway, Lambda, DynamoDB, CloudWatch, IAM y despliegue automatizado con GitHub Actions OIDC.
- text: Usuario -> CloudFront -> S3 Frontend -> API Gateway -> Lambda -> DynamoDB Lambda -> CloudWatch Logs GitHub Actions -> OIDC -> Terraform API Gateway Lambda DynamoDB IAM CloudWatch Terraform GitHub Actions
- heading "Objetivo técnico" [level=3]
- paragraph: Demostrar una solución pequeña, documentada y mantenible que valide conocimientos de frontend, backend, cloud, seguridad, CI/CD, infraestructura como código y arquitectura empresarial.
- paragraph: Ponte en contacto
- heading "Contacto" [level=3]
- text: Tu nombre
- textbox "Tu nombre":
  - /placeholder: ¿Cuál es tu nombre?
- text: Tu e-mail
- textbox "Tu e-mail":
  - /placeholder: ¿Cuál es tu correo electrónico?
- text: Tu mensaje
- textbox "Tu mensaje":
  - /placeholder: ¿En qué puedo ayudarte?
- button "Enviar"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const SECTIONS = [
  4  |   { name: 'About', id: 'about' },
  5  |   { name: 'Experiencia técnica validada', id: 'validated' },
  6  |   { name: 'Experiencia laboral', id: 'work' },
  7  |   { name: 'Tech', id: 'tech' },
  8  |   { name: 'Proyectos', id: 'works' },
  9  |   { name: 'Decisiones técnicas', id: 'decisions' },
  10 |   { name: 'Arquitectura AWS', id: 'architecture' },
  11 |   { name: 'Contacto', id: 'contact' },
  12 | ];
  13 | 
  14 | test.describe('Navegación — Secciones visibles', () => {
  15 |   SECTIONS.forEach(({ name, id }) => {
  16 |     test(`sección "${name}" (#${id}) visible`, async ({ page }) => {
  17 |       await page.goto('/', { waitUntil: 'load' });
  18 |       const section = page.locator(`#${id}`);
  19 |       await expect(section).toBeAttached({ timeout: 10000 });
  20 |     });
  21 |   });
  22 | 
  23 |   test('navbar con enlaces de navegación', async ({ page }) => {
  24 |     await page.goto('/', { waitUntil: 'load' });
  25 |     const nav = page.locator('nav, header');
  26 |     await expect(nav).toBeVisible();
  27 |     const links = nav.locator('a');
  28 |     const count = await links.count();
  29 |     expect(count).toBeGreaterThanOrEqual(4);
  30 |   });
  31 | 
  32 |   test('scroll a sección al hacer clic en navbar', async ({ page }) => {
  33 |     await page.goto('/', { waitUntil: 'load' });
  34 |     await expect(page.locator('body')).not.toBeEmpty({ timeout: 15000 });
  35 | 
  36 |     const contactLink = page.locator('nav a[href="#contact"]').first();
> 37 |     await expect(contactLink).toBeVisible();
     |                               ^ Error: expect(locator).toBeVisible() failed
  38 |     await contactLink.click();
  39 | 
  40 |     const contactSection = page.locator('#contact');
  41 |     await expect(contactSection).toBeVisible({ timeout: 5000 });
  42 | 
  43 |     const box = await contactSection.boundingBox();
  44 |     expect(box).not.toBeNull();
  45 |   });
  46 | });
  47 | 
```