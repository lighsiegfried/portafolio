import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  reactjs,
  tailwind,
  nodejs,
  git,
  docker,
  meta,
  Polyproductos,
  envaseal,
  alorica,
  indiana,
  kratt,
  inventario,
  simpleweb,
  java,
  crudnode,
  threejs,
  tresdmodel,
  portafolio,
  erp,
  erp2,
  androidapp,
  iaasisten,
} from "../assets";

/**
 * Top-level in-page navigation.
 *
 * `id` is the DOM anchor registered by `SectionWrapper(Component, id)`; `key`
 * is the `t.nav` dictionary key that labels it. They are separate fields on
 * purpose — the anchors are historical (`work`, `works`, `tech`) while the
 * dictionary is keyed semantically (`experience`, `projects`, `techStack`), so
 * mapping here avoids storing each label twice under a second name.
 * `src/components/Footer.jsx` mirrors this list.
 *
 * @type {ReadonlyArray<{ id: string, key: string }>}
 */
export const navLinks = [
  { id: "about", key: "about" },
  { id: "work", key: "experience" },
  { id: "tech", key: "techStack" },
  { id: "certifications", key: "certifications" },
  { id: "works", key: "projects" },
  { id: "architecture", key: "architecture" },
  { id: "contact", key: "contact" },
];

const services = [
  {
    title: { es: "Full-Stack Developer", en: "Full-Stack Developer" },
    icon: web,
  },
  {
    title: { es: "Cloud & DevOps", en: "Cloud & DevOps" },
    icon: backend,
  },
  {
    title: { es: "ERP / CRM Systems", en: "ERP / CRM Systems" },
    icon: creator,
  },
  {
    title: { es: "AI & Automation", en: "AI & Automation" },
    icon: mobile,
  },
];

const technologies = [
  { name: "React", icon: reactjs },
  { name: "JavaScript", icon: javascript },
  { name: "TypeScript", icon: typescript },
  { name: "Tailwind", icon: tailwind },
  { name: "Three.js", icon: threejs },
  { name: "Node.js", icon: nodejs },
  { name: "Docker", icon: docker },
  { name: "Git", icon: git },
];

const experiences = [
  {
    title: {
      es: "Software Engineer Full Stack",
      en: "Full Stack Software Engineer",
    },
    company_name: "Kratt",
    icon: kratt,
    iconBg: "#FFFFFF",
    date: { es: "Febrero 2026 - Actualmente", en: "February 2026 - Present" },
    points: [
      {
        es: "Ingeniería full-stack y dirección técnica en plataformas CRM, Ticket System y ERP multiorganizacional.",
        en: "Full-stack engineering and technical direction across CRM, Ticketing Systems, and multi-tenant ERP platforms.",
      },
      {
        es: "Despliegue de arquitecturas cloud en AWS, orquestando microservicios sobre ECS (Fargate), ECR y EC2 dentro de subredes VPC aisladas.",
        en: "Deployment of AWS cloud architectures, orchestrating microservices on ECS (Fargate), ECR, and EC2 within isolated VPC subnets.",
      },
      {
        es: "Implementación de pipelines CI/CD automatizados con GitHub Actions apoyados en AWS OIDC, sin claves estáticas.",
        en: "Implementation of automated GitHub Actions CI/CD pipelines leveraging AWS OIDC without static keys.",
      },
      {
        es: "Integración de flujos de IA generativa con OpenClaw y LLM locales para extracción documental automatizada y aceleración del negocio.",
        en: "Integration of Generative AI workflows with OpenClaw and local LLMs for automated document extraction and business acceleration.",
      },
      {
        es: "Aprovisionamiento de entornos de prueba bare-metal on-premises y segmentación de red empresarial con Ubiquiti UniFi.",
        en: "Provisioning on-premises bare-metal test beds and Ubiquiti UniFi enterprise network segmentation.",
      },
    ],
  },
  {
    title: { es: "Desarrollador de Software", en: "Software Developer" },
    company_name: "Envaseal S.A",
    icon: envaseal,
    iconBg: "#FFFFFF",
    date: { es: "Enero 2024 - Febrero 2026", en: "January 2024 - February 2026" },
    points: [
      {
        es: "Lideré la modernización del ERP legacy y la migración de servidores de PHP 5.4 a PHP 8.4, mejorando la seguridad y la velocidad de ejecución en producción.",
        en: "Led legacy ERP modernization and server migration from PHP 5.4 to PHP 8.4, enhancing security and production runtime speed.",
      },
      {
        es: "Rediseñé el flujo de compras y requisiciones, eliminando el 70% de la carga operativa manual.",
        en: "Redesigned the procurement and requisition workflow, eliminating 70% of manual operational overhead.",
      },
      {
        es: "Desarrollo full-stack de módulos ERP bajo arquitectura MVC con PHP, Java, JavaScript, jQuery y SQL.",
        en: "Full-stack development of MVC ERP modules using PHP, Java, JavaScript, jQuery, and SQL.",
      },
      {
        es: "Optimización de consultas SQL complejas, normalización de tablas, triggers, stored procedures y procesos ETL automatizados.",
        en: "Complex SQL optimization, table normalization, triggers, stored procedures, and automated ETL pipelines.",
      },
      {
        es: "Implementación de infraestructura on-premises con Power BI Report Server para la toma de decisiones ejecutivas en tiempo real.",
        en: "Engineered on-premises Power BI Report Server infrastructure for real-time executive decision-making.",
      },
      {
        es: "Establecimiento de una estrategia de respaldos 3-2-1 con NAS en cascada y servidores clon en standby para la continuidad del negocio (BCP/DRP).",
        en: "Established 3-2-1 backup strategy with cascaded NAS units and standby clone servers for Business Continuity (BCP/DRP).",
      },
    ],
  },
  {
    title: {
      es: "Analista de Datos / Soporte Técnico",
      en: "Data Analyst / Technical Support",
    },
    company_name: "Hoosier Manufacturing",
    icon: indiana,
    iconBg: "#A6D0DD",
    date: { es: "Enero 2021 - Septiembre 2023", en: "January 2021 - September 2023" },
    points: [
      {
        es: "Soporte técnico a usuarios finales y documentación de los flujos operativos de los módulos del ERP.",
        en: "End-user technical support and operational ERP module workflow documentation.",
      },
      {
        es: "Conceptualización de bases de datos SQL y construcción de reportes analíticos interactivos en Power BI.",
        en: "Conceptualized SQL databases and built interactive Power BI business analytics reports.",
      },
      {
        es: "Mantenimiento del control de versiones con Git/GitHub bajo sprints Agile/Scrum.",
        en: "Maintained Git/GitHub version control workflows under Agile/Scrum sprints.",
      },
    ],
  },
  {
    title: {
      es: "Help Desk Support Specialist - Remoto",
      en: "Help Desk Support Specialist - Remote",
    },
    company_name: "Alorica Inc.",
    icon: alorica,
    iconBg: "#E6E6E6",
    date: { es: "Mayo 2018 - Mayo 2019", en: "May 2018 - May 2019" },
    points: [
      {
        es: "Soporte técnico remoto de software y sistemas operativos a clientes corporativos.",
        en: "Provided remote technical software and OS support to enterprise clients.",
      },
      {
        es: "Documentación de incidentes recurrentes y aporte a los scripts de automatización del troubleshooting.",
        en: "Documented recurring incidents and contributed to troubleshooting automation scripts.",
      },
    ],
  },
];

const technicalDecisions = [
  {
    title: {
      es: "Frontend desacoplado y distribuido por CDN",
      en: "Decoupled frontend delivered through a CDN",
    },
    description: {
      es: "El portafolio utiliza una SPA en React/Vite con assets estáticos distribuidos mediante CloudFront, separando la capa visual de futuras APIs o servicios backend.",
      en: "The portfolio runs as a React/Vite SPA with static assets distributed through CloudFront, keeping the presentation layer separate from future APIs or backend services.",
    },
  },
  {
    title: {
      es: "Arquitectura preparada para serverless",
      en: "Architecture designed for serverless",
    },
    description: {
      es: "La evolución del proyecto contempla API Gateway, Lambda y DynamoDB para agregar funciones de Mini ERP/CRM Lite sin administrar servidores directamente.",
      en: "The project roadmap relies on API Gateway, Lambda and DynamoDB to add Mini ERP/CRM Lite features without managing servers directly.",
    },
  },
  {
    title: {
      es: "IaC y CI/CD como evidencia técnica",
      en: "IaC and CI/CD as technical evidence",
    },
    description: {
      es: "La infraestructura será documentada y versionada con Terraform, mientras que los despliegues se automatizarán con GitHub Actions y OIDC para evitar credenciales estáticas.",
      en: "The infrastructure will be documented and versioned with Terraform, while deployments will be automated with GitHub Actions and OIDC to avoid static credentials.",
    },
  },
  {
    title: {
      es: "Documentación como parte del producto",
      en: "Documentation as part of the product",
    },
    description: {
      es: "El proyecto incluirá README técnico, diagramas, decisiones de arquitectura y guías de despliegue para que el código pueda ser entendido y auditado fácilmente.",
      en: "The project will ship a technical README, diagrams, architecture decisions and deployment guides so the code can be understood and audited easily.",
    },
  },
];

const projects = [
  {
    title: {
      es: "Proyectos profesionales / arquitectura",
      en: "Professional / architecture projects",
    },
    items: [
      {
        name: { es: "Portafolio AWS Serverless", en: "AWS Serverless Portfolio" },
        description: {
          es: "Portafolio profesional desplegado en AWS con frontend estático en S3 privado, distribución por CloudFront, Origin Access Control y protección a nivel de aplicación mediante WAF. El proyecto evoluciona hacia una arquitectura cloud-native con backend serverless e infraestructura como código.",
          en: "Professional portfolio deployed on AWS with a static frontend in a private S3 bucket, CloudFront distribution, Origin Access Control and application-level protection through WAF. The project is evolving into a cloud-native architecture with a serverless backend and infrastructure as code.",
        },
        tags: [
          { name: "React", color: "blue-text-gradient" },
          { name: "Vite", color: "green-text-gradient" },
          { name: "AWS S3", color: "pink-text-gradient" },
          { name: "CloudFront", color: "blue-text-gradient" },
          { name: "OAC", color: "green-text-gradient" },
          { name: "WAF", color: "pink-text-gradient" },
          { name: "CI/CD", color: "blue-text-gradient" },
        ],
        image: portafolio,
        source_code_link: "https://github.com/lighsiegfried/portafolio",
        caseStudy: {
          id: "portfolio-cloud-native",
          eyebrow: { es: "Caso de estudio cloud-native", en: "Cloud-native case study" },
          title: {
            es: "Portafolio Cloud-Native + Mini ERP/CRM Lite",
            en: "Cloud-Native Portfolio + Mini ERP/CRM Lite",
          },
          status: { es: "En producción", en: "In production" },
          role: {
            es: "Arquitectura, frontend, backend y DevOps",
            en: "Architecture, frontend, backend and DevOps",
          },
          summary: {
            es: "Portafolio profesional que combina una experiencia 3D desarrollada con React y Three.js con un Mini ERP/CRM Lite funcional. El sistema fue construido como un caso de estudio para demostrar arquitectura serverless en AWS, desarrollo full-stack, lógica empresarial, infraestructura como código, seguridad, pruebas automatizadas y entrega continua.",
            en: "A professional portfolio that combines a 3D experience built with React and Three.js with a working Mini ERP/CRM Lite. The system was built as a case study to demonstrate serverless architecture on AWS, full-stack development, business logic, infrastructure as code, security, automated testing and continuous delivery.",
          },
          problem: {
            es: "Un portafolio tradicional puede enumerar tecnologías, pero no necesariamente demuestra cómo se diseñan y conectan sistemas reales. El objetivo fue convertir el propio portafolio en una solución funcional que incluyera procesos empresariales, persistencia, autenticación, infraestructura cloud, automatización de despliegues y observabilidad.",
            en: "A traditional portfolio can list technologies, but it does not necessarily show how real systems are designed and wired together. The goal was to turn the portfolio itself into a working solution covering business processes, persistence, authentication, cloud infrastructure, deployment automation and observability.",
          },
          solution: {
            es: "Se construyó una SPA 3D con React, Vite y Three.js que integra un Mini ERP/CRM Lite bajo la ruta `/mini-erp/*`. El frontend se entrega mediante CloudFront y un bucket S3 privado, mientras que el backend utiliza API Gateway, una función Lambda con router propio y DynamoDB. Terraform administra la infraestructura y GitHub Actions automatiza validación y despliegue mediante OIDC.",
            en: "A 3D SPA was built with React, Vite and Three.js, embedding a Mini ERP/CRM Lite under the `/mini-erp/*` route. The frontend is served through CloudFront and a private S3 bucket, while the backend runs on API Gateway, a Lambda function with a custom router and DynamoDB. Terraform manages the infrastructure and GitHub Actions automates validation and deployment through OIDC.",
          },
          metrics: [
            { value: "238", label: { es: "pruebas backend", en: "backend tests" } },
            { value: "9", label: { es: "tablas DynamoDB", en: "DynamoDB tables" } },
            { value: "8", label: { es: "módulos de negocio", en: "business modules" } },
            { value: "4", label: { es: "módulos Terraform", en: "Terraform modules" } },
          ],
          architecture: {
            flows: [
              {
                label: { es: "Entrega del frontend", en: "Frontend delivery" },
                nodes: [
                  "Browser",
                  "CloudFront CDN",
                  { es: "S3 privado con OAC", en: "Private S3 with OAC" },
                  "React / Vite / Three.js",
                ],
              },
              {
                label: { es: "Backend serverless", en: "Serverless backend" },
                nodes: [
                  "Browser",
                  "API Gateway HTTP API",
                  { es: "AWS Lambda con Node.js", en: "AWS Lambda with Node.js" },
                  "DynamoDB",
                ],
              },
            ],
            integrations: [
              {
                es: "Amazon SES para el formulario de contacto.",
                en: "Amazon SES for the contact form.",
              },
              {
                es: "CloudWatch para logs estructurados y alarmas.",
                en: "CloudWatch for structured logs and alarms.",
              },
              { es: "GitHub Actions + OIDC para CI/CD.", en: "GitHub Actions + OIDC for CI/CD." },
              {
                es: "Terraform para infraestructura como código.",
                en: "Terraform for infrastructure as code.",
              },
            ],
          },
          capabilities: [
            {
              es: "Autenticación JWT y autorización por roles.",
              en: "JWT authentication and role-based authorization.",
            },
            { es: "Dashboard con KPIs y visualizaciones.", en: "Dashboard with KPIs and charts." },
            {
              es: "Requisiciones con flujo de estados.",
              en: "Requisitions with a state-driven workflow.",
            },
            { es: "Productos y control de inventario.", en: "Products and inventory control." },
            {
              es: "CRM Lite con pipeline de leads y notas.",
              en: "CRM Lite with a lead pipeline and notes.",
            },
            {
              es: "Reportes CSV generados desde el backend.",
              en: "CSV reports generated from the backend.",
            },
            {
              es: "Formulario de contacto integrado con Amazon SES.",
              en: "Contact form integrated with Amazon SES.",
            },
            {
              es: "Estados de carga, error, vacío y confirmaciones en la interfaz.",
              en: "Loading, error, empty and confirmation states across the UI.",
            },
          ],
          decisions: [
            {
              title: {
                es: "Router propio en Lambda, sin Express",
                en: "Custom router inside Lambda, no Express",
              },
              reason: {
                es: "Menor cantidad de dependencias, paquete más pequeño y control directo del ciclo de ejecución serverless.",
                en: "Fewer dependencies, a smaller bundle and direct control over the serverless execution cycle.",
              },
            },
            {
              title: {
                es: "Repositorio intercambiable mock / DynamoDB",
                en: "Swappable mock / DynamoDB repository",
              },
              reason: {
                es: "Permite desarrollo y pruebas locales sin depender de una cuenta de AWS.",
                en: "Enables local development and testing without depending on an AWS account.",
              },
            },
            {
              title: { es: "DynamoDB multi-tabla", en: "Multi-table DynamoDB" },
              reason: {
                es: "Mantiene modelos y patrones de acceso explícitos para un caso de estudio empresarial.",
                en: "Keeps models and access patterns explicit for a business-oriented case study.",
              },
            },
            {
              title: { es: "S3 privado con CloudFront OAC", en: "Private S3 with CloudFront OAC" },
              reason: {
                es: "El frontend no requiere exposición pública directa del bucket.",
                en: "The frontend does not require direct public exposure of the bucket.",
              },
            },
            {
              title: {
                es: "Escritura atómica condicional para inventario",
                en: "Conditional atomic writes for inventory",
              },
              reason: {
                es: "Evita stock negativo y condiciones de carrera bajo concurrencia.",
                en: "Prevents negative stock and race conditions under concurrency.",
              },
            },
            {
              title: { es: "GitHub Actions con OIDC", en: "GitHub Actions with OIDC" },
              reason: {
                es: "El pipeline accede a AWS sin almacenar claves estáticas de larga duración.",
                en: "The pipeline reaches AWS without storing long-lived static keys.",
              },
            },
            {
              title: { es: "`node:test` nativo", en: "Native `node:test`" },
              reason: {
                es: "Reduce dependencias de testing y utiliza capacidades incluidas en Node.js.",
                en: "Cuts testing dependencies and leans on capabilities already shipped with Node.js.",
              },
            },
          ],
          security: [
            {
              es: "S3 privado protegido mediante Origin Access Control.",
              en: "Private S3 protected through Origin Access Control.",
            },
            { es: "Autenticación JWT.", en: "JWT authentication." },
            {
              es: "Autorización por roles para rutas empresariales.",
              en: "Role-based authorization on business routes.",
            },
            {
              es: "Ajustes atómicos para evitar inventario negativo.",
              en: "Atomic adjustments to prevent negative inventory.",
            },
            {
              es: "Idempotencia opcional en operaciones críticas.",
              en: "Optional idempotency on critical operations.",
            },
            { es: "Logs estructurados por solicitud.", en: "Structured per-request logs." },
            { es: "Alarmas para errores y throttling.", en: "Alarms for errors and throttling." },
            {
              es: "Concurrencia Lambda controlada para proteger costos.",
              en: "Controlled Lambda concurrency to protect costs.",
            },
            { es: "AWS OIDC en CI/CD, sin claves estáticas.", en: "AWS OIDC in CI/CD, no static keys." },
            {
              es: "WAF activo en la infraestructura actual, indicando que no formó parte de la modernización reciente.",
              en: "WAF active in the current infrastructure, noting it was not part of the recent modernization.",
            },
          ],
          quality: [
            { es: "238 pruebas backend.", en: "238 backend tests." },
            { es: "Validación de datos demo.", en: "Demo data validation." },
            {
              es: "Build independiente para frontend y backend.",
              en: "Independent builds for frontend and backend.",
            },
            {
              es: "Terraform plan y apply desde GitHub Actions.",
              en: "Terraform plan and apply from GitHub Actions.",
            },
            { es: "Smoke tests contra producción.", en: "Smoke tests against production." },
            {
              es: "Despliegue del frontend a S3 y distribución mediante CloudFront.",
              en: "Frontend deployment to S3 and distribution through CloudFront.",
            },
            { es: "Observabilidad mediante CloudWatch.", en: "Observability through CloudWatch." },
            {
              es: "Controles orientados a mantener el proyecto dentro de AWS Free Tier.",
              en: "Controls aimed at keeping the project inside the AWS Free Tier.",
            },
          ],
          limitations: [
            { es: "Refresh tokens aún no implementados.", en: "Refresh tokens are not implemented yet." },
            {
              es: "Cobertura E2E automatizada del frontend todavía parcial.",
              en: "Automated frontend E2E coverage is still partial.",
            },
            {
              es: "El catálogo de reportes puede ampliarse.",
              en: "The report catalog can be expanded.",
            },
            {
              es: "La idempotencia actual es local a cada contenedor Lambda.",
              en: "Current idempotency is local to each Lambda container.",
            },
            {
              es: "El modelo multi-tabla se eligió por claridad; una estrategia single-table podría explorarse en otra fase.",
              en: "The multi-table model was chosen for clarity; a single-table strategy could be explored in a later phase.",
            },
          ],
          links: {
            demo: "/mini-erp/login",
            github: "https://github.com/lighsiegfried/portafolio",
          },
        },
      },
      {
        name: {
          es: "Mini ERP Cloud-Native para PyME",
          en: "Cloud-Native Mini ERP for SMBs",
        },
        description: {
          es: "Demo funcional de un ERP/CRM Lite con autenticación por roles, requisiciones, inventario, dashboard, reportes y pipeline comercial. Utiliza React, una API serverless en AWS, DynamoDB, Terraform y CI/CD para demostrar arquitectura y lógica empresarial sin pretender reemplazar un ERP comercial completo.",
          en: "Working demo of an ERP/CRM Lite with role-based authentication, requisitions, inventory, dashboard, reports and a sales pipeline. It uses React, a serverless API on AWS, DynamoDB, Terraform and CI/CD to demonstrate architecture and business logic without claiming to replace a full commercial ERP.",
        },
        tags: [
          { name: "React", color: "blue-text-gradient" },
          { name: "Node.js", color: "green-text-gradient" },
          { name: "AWS Lambda", color: "pink-text-gradient" },
          { name: "API Gateway", color: "blue-text-gradient" },
          { name: "DynamoDB", color: "green-text-gradient" },
          { name: "Terraform", color: "pink-text-gradient" },
          { name: "GitHub Actions", color: "blue-text-gradient" },
        ],
        image: erp,
        source_code_link: "",
        demo_link: "/mini-erp/login",
        caseStudy: {
          id: "mini-erp-cloud-native-lite",
          eyebrow: {
            es: "Caso de estudio full-stack serverless",
            en: "Full-stack serverless case study",
          },
          title: {
            es: "Mini ERP Cloud-Native para PyME — Demo Lite",
            en: "Cloud-Native Mini ERP for SMBs — Lite Demo",
          },
          status: {
            es: "Demo funcional · datos simulados",
            en: "Working demo · simulated data",
          },
          role: {
            es: "Arquitectura, frontend, backend, lógica empresarial y DevOps",
            en: "Architecture, frontend, backend, business logic and DevOps",
          },
          scope: {
            es: "ERP/CRM Lite integrado al portafolio",
            en: "ERP/CRM Lite embedded in the portfolio",
          },
          badges: [
            { es: "Demo Lite", en: "Lite Demo" },
            { es: "Entorno demostrativo", en: "Demonstration environment" },
            { es: "Serverless", en: "Serverless" },
            { es: "Datos simulados", en: "Simulated data" },
          ],
          summary: {
            es: "Mini ERP Cloud-Native para PyME es una aplicación demostrativa integrada al portafolio para evidenciar cómo se conectan una interfaz empresarial, reglas de negocio, autenticación, persistencia, infraestructura cloud y entrega continua. Su alcance es deliberadamente Lite: cubre procesos representativos de una organización sin intentar reproducir toda la complejidad funcional, contable o regulatoria de un ERP comercial.",
            en: "Cloud-Native Mini ERP for SMBs is a demonstration application embedded in the portfolio to show how a business UI, domain rules, authentication, persistence, cloud infrastructure and continuous delivery fit together. Its scope is deliberately Lite: it covers representative organizational processes without trying to reproduce the full functional, accounting or regulatory complexity of a commercial ERP.",
          },
          metrics: [
            { value: "8", label: { es: "módulos de negocio", en: "business modules" } },
            { value: "9", label: { es: "tablas DynamoDB", en: "DynamoDB tables" } },
            { value: "4", label: { es: "módulos Terraform", en: "Terraform modules" } },
            { value: "246", label: { es: "pruebas backend", en: "backend tests" } },
          ],
          links: {
            demo: "/mini-erp/login",
          },
          sections: [
            {
              type: "prose",
              title: { es: "¿Por qué se creó?", en: "Why it was built" },
              body: {
                es: "Un portafolio puede mostrar tecnologías, pero no necesariamente demuestra cómo se aplican en procesos empresariales. Esta demo fue creada para convertir el portafolio en una prueba funcional de arquitectura full-stack, mostrando autenticación, roles, estados de negocio, inventario, CRM, reportes, persistencia y despliegue serverless dentro de un mismo caso de estudio.",
                en: "A portfolio can show technologies, but it does not necessarily prove how they apply to business processes. This demo was created to turn the portfolio into a working proof of full-stack architecture, covering authentication, roles, business states, inventory, CRM, reports, persistence and serverless deployment inside a single case study.",
              },
            },
            {
              type: "split",
              columns: [
                {
                  title: { es: "Problema", en: "Problem" },
                  body: {
                    es: "Las aplicaciones de demostración suelen limitarse a formularios CRUD sin reglas, permisos ni infraestructura real. El objetivo fue representar un flujo empresarial suficientemente completo para demostrar separación de responsabilidades, contratos de API, lógica de estados, control de inventario, autorización por roles y operación en AWS, pero manteniendo un alcance pequeño, comprensible y económico.",
                    en: "Demo applications usually stop at CRUD forms with no rules, no permissions and no real infrastructure. The goal was to model a business flow complete enough to show separation of concerns, API contracts, state logic, inventory control, role-based authorization and real operation on AWS, while keeping the scope small, understandable and inexpensive.",
                  },
                },
                {
                  title: { es: "Solución", en: "Solution" },
                  body: {
                    es: "Se construyó una SPA empresarial dentro del portafolio, con frontend React y una API serverless en Node.js. La aplicación incluye módulos de autenticación, requisiciones, productos, inventario, leads, dashboard y reportes. En producción, el frontend se distribuye mediante CloudFront y S3 privado, mientras API Gateway conecta con Lambda y DynamoDB. Terraform define la infraestructura y GitHub Actions automatiza validaciones y despliegues mediante OIDC.",
                    en: "A business SPA was built inside the portfolio, with a React frontend and a serverless Node.js API. The application ships modules for authentication, requisitions, products, inventory, leads, dashboard and reports. In production the frontend is distributed through CloudFront and private S3, while API Gateway connects to Lambda and DynamoDB. Terraform defines the infrastructure and GitHub Actions automates checks and deployments through OIDC.",
                  },
                },
              ],
            },
            {
              type: "flows",
              title: { es: "Arquitectura", en: "Architecture" },
              badge: { es: "Serverless en AWS", en: "Serverless on AWS" },
              flows: [
                {
                  label: { es: "Producción (AWS)", en: "Production (AWS)" },
                  nodes: [
                    { es: "Usuario", en: "User" },
                    "React / Vite",
                    "Mini ERP UI",
                    "API client",
                    "API Gateway HTTP API",
                    "Lambda Node.js",
                    { es: "Router propio", en: "Custom router" },
                    "Middleware",
                    { es: "Módulos de negocio", en: "Business modules" },
                    "Repository factory",
                    { es: "DynamoDB o repositorio mock", en: "DynamoDB or mock repository" },
                  ],
                },
                {
                  label: { es: "Modo local (sin AWS)", en: "Local mode (no AWS)" },
                  nodes: [
                    { es: "Frontend local", en: "Local frontend" },
                    { es: "API local", en: "Local API" },
                    { es: "Repositorio mock", en: "Mock repository" },
                    { es: "Fixtures demo", en: "Demo fixtures" },
                  ],
                },
              ],
              note: {
                es: "Componentes de apoyo: CloudFront, S3 privado con OAC, Amazon SES, CloudWatch, Terraform, GitHub Actions y OIDC. El desarrollo local no requiere una cuenta de AWS: usa el repositorio mock con datos de demostración.",
                en: "Supporting components: CloudFront, private S3 with OAC, Amazon SES, CloudWatch, Terraform, GitHub Actions and OIDC. Local development needs no AWS account: it runs on the mock repository with demo data.",
              },
            },
            {
              type: "cards",
              title: { es: "Módulos de negocio", en: "Business modules" },
              columns: 2,
              items: [
                {
                  title: { es: "Autenticación y roles", en: "Authentication and roles" },
                  items: [
                    { es: "Login JWT", en: "JWT login" },
                    "bcrypt",
                    { es: "Roles empresariales", en: "Business roles" },
                    { es: "Rutas protegidas", en: "Protected routes" },
                    { es: "Navegación adaptada por permisos", en: "Permission-aware navigation" },
                  ],
                },
                {
                  title: { es: "Requisiciones", en: "Requisitions" },
                  items: [
                    { es: "Creación", en: "Creation" },
                    { es: "Aprobación", en: "Approval" },
                    { es: "Rechazo", en: "Rejection" },
                    { es: "Finalización", en: "Completion" },
                    { es: "Transición de estados", en: "State transitions" },
                    {
                      es: "Historial y auditoría (tabla audit-events)",
                      en: "History and audit trail (audit-events table)",
                    },
                  ],
                },
                {
                  title: { es: "Productos", en: "Products" },
                  items: [
                    { es: "Catálogo", en: "Catalog" },
                    { es: "SKU único", en: "Unique SKU" },
                    { es: "Existencias", en: "Stock levels" },
                    { es: "Alertas de bajo inventario", en: "Low-stock alerts" },
                  ],
                },
                {
                  title: { es: "Inventario", en: "Inventory" },
                  items: [
                    { es: "Entradas", en: "Inbound movements" },
                    { es: "Salidas", en: "Outbound movements" },
                    { es: "Movimientos", en: "Movement log" },
                    { es: "Ajuste atómico", en: "Atomic adjustment" },
                    { es: "Protección contra stock negativo", en: "Negative-stock protection" },
                  ],
                },
                {
                  title: { es: "CRM Lite", en: "CRM Lite" },
                  items: [
                    { es: "Leads", en: "Leads" },
                    { es: "Pipeline", en: "Pipeline" },
                    { es: "Estados", en: "Stages" },
                    { es: "Notas", en: "Notes" },
                    { es: "Vista Kanban y tabla", en: "Kanban and table views" },
                  ],
                },
                {
                  title: { es: "Dashboard", en: "Dashboard" },
                  items: [
                    "KPIs",
                    { es: "Resúmenes", en: "Summaries" },
                    { es: "Gráficas", en: "Charts" },
                    { es: "Información agrupada por módulo", en: "Data grouped by module" },
                  ],
                },
                {
                  title: { es: "Reportes", en: "Reports" },
                  items: [
                    { es: "Exportación CSV", en: "CSV export" },
                    { es: "Generación desde el backend", en: "Backend-side generation" },
                    { es: "Descarga desde la interfaz", en: "Download from the UI" },
                  ],
                },
                {
                  title: { es: "Contacto", en: "Contact" },
                  items: [
                    { es: "Formulario público", en: "Public form" },
                    {
                      es: "Integración con Amazon SES cuando está habilitada",
                      en: "Amazon SES integration when enabled",
                    },
                  ],
                },
              ],
            },
            {
              type: "flows",
              title: { es: "Flujo de una requisición", en: "Requisition workflow" },
              flows: [
                {
                  label: { es: "Ruta principal", en: "Main path" },
                  nodes: [
                    { es: "Pendiente", en: "Pending" },
                    { es: "Aprobada", en: "Approved" },
                    { es: "Completada", en: "Completed" },
                  ],
                },
                {
                  label: { es: "Ruta alterna", en: "Alternate path" },
                  nodes: [
                    { es: "Pendiente", en: "Pending" },
                    { es: "Rechazada", en: "Rejected" },
                  ],
                },
              ],
              note: {
                es: "El backend es el dueño de las transiciones de estado permitidas. La interfaz presenta las acciones, pero no decide por sí misma qué transición es válida.",
                en: "The backend owns which state transitions are allowed. The UI surfaces the actions, but never decides on its own which transition is valid.",
              },
            },
            {
              type: "callout",
              title: {
                es: "El inventario nunca debe quedar negativo",
                en: "Inventory must never go negative",
              },
              body: {
                es: "Las salidas de inventario utilizan una operación atómica y condicional. La actualización solamente continúa cuando existe stock suficiente, evitando una secuencia insegura de lectura, cálculo y escritura que podría producir valores negativos bajo concurrencia.",
                en: "Outbound inventory movements use a conditional atomic operation. The update only proceeds when there is enough stock, avoiding an unsafe read-compute-write sequence that could produce negative values under concurrency.",
              },
            },
            {
              type: "flows",
              title: {
                es: "Desarrollo local sin depender de AWS",
                en: "Local development without depending on AWS",
              },
              flows: [
                {
                  label: { es: "Local y pruebas", en: "Local and tests" },
                  nodes: [
                    { es: "Handler de negocio", en: "Business handler" },
                    { es: "Contrato de repositorio", en: "Repository contract" },
                    { es: "Repositorio mock", en: "Mock repository" },
                  ],
                },
                {
                  label: { es: "Producción", en: "Production" },
                  nodes: [
                    { es: "Handler de negocio", en: "Business handler" },
                    { es: "Contrato de repositorio", en: "Repository contract" },
                    { es: "Repositorio DynamoDB", en: "DynamoDB repository" },
                  ],
                },
              ],
              note: {
                es: "Los handlers dependen de una fábrica de repositorios en lugar de acoplarse directamente a DynamoDB. La fábrica selecciona una implementación mock en memoria para desarrollo local y pruebas, o DynamoDB para producción.",
                en: "Handlers depend on a repository factory instead of coupling directly to DynamoDB. The factory picks an in-memory mock implementation for local development and tests, or DynamoDB for production.",
              },
            },
            {
              type: "decisions",
              title: { es: "Decisiones técnicas", en: "Technical decisions" },
              items: [
                {
                  title: { es: "Router propio en Lambda", en: "Custom router inside Lambda" },
                  reason: {
                    es: "Reduce dependencias y da control directo sobre las rutas y el ciclo de vida de Lambda.",
                    en: "Cuts dependencies and gives direct control over routes and the Lambda lifecycle.",
                  },
                  tradeoff: {
                    es: "El comportamiento de enrutamiento y middleware debe mantenerlo el proyecto.",
                    en: "Routing and middleware behavior must be maintained by the project itself.",
                  },
                },
                {
                  title: { es: "DynamoDB multi-tabla", en: "Multi-table DynamoDB" },
                  reason: {
                    es: "Mantiene las entidades y los patrones de acceso explícitos para una demo empresarial orientada al aprendizaje.",
                    en: "Keeps entities and access patterns explicit for a learning-oriented business demo.",
                  },
                  tradeoff: {
                    es: "No es un ejercicio de optimización single-table.",
                    en: "It is not a single-table optimization exercise.",
                  },
                },
                {
                  title: { es: "Repositorio mock por defecto", en: "Mock repository by default" },
                  reason: {
                    es: "Permite el uso local y las pruebas sin AWS.",
                    en: "Enables local usage and testing without AWS.",
                  },
                  tradeoff: {
                    es: "Las implementaciones mock y DynamoDB deben permanecer compatibles con el contrato.",
                    en: "The mock and DynamoDB implementations must stay compatible with the contract.",
                  },
                },
                {
                  title: { es: "S3 privado con CloudFront OAC", en: "Private S3 with CloudFront OAC" },
                  reason: {
                    es: "Evita el acceso público al bucket.",
                    en: "Prevents public access to the bucket.",
                  },
                  tradeoff: {
                    es: "La distribución y la invalidación de caché requieren administrar CloudFront.",
                    en: "Distribution and cache invalidation require managing CloudFront.",
                  },
                },
                {
                  title: { es: "Autenticación JWT", en: "JWT authentication" },
                  reason: {
                    es: "Autenticación stateless simple para una demostración técnica.",
                    en: "Simple stateless authentication for a technical demonstration.",
                  },
                  tradeoff: {
                    es: "La rotación de refresh tokens queda fuera del alcance Lite actual.",
                    en: "Refresh-token rotation is outside the current Lite scope.",
                  },
                },
                {
                  title: { es: "`node:test` nativo", en: "Native `node:test`" },
                  reason: {
                    es: "Reduce dependencias externas de testing.",
                    en: "Reduces external testing dependencies.",
                  },
                  tradeoff: {
                    es: "Algunas conveniencias del ecosistema requieren helpers propios.",
                    en: "Some ecosystem conveniences require custom helpers.",
                  },
                },
                {
                  title: { es: "Terraform", en: "Terraform" },
                  reason: {
                    es: "La infraestructura permanece reproducible y revisable.",
                    en: "Infrastructure stays reproducible and reviewable.",
                  },
                  tradeoff: {
                    es: "Los cambios de infraestructura requieren revisión de plan y gestión de estado.",
                    en: "Infrastructure changes require plan review and state management.",
                  },
                },
                {
                  title: { es: "GitHub Actions con OIDC", en: "GitHub Actions with OIDC" },
                  reason: {
                    es: "Evita credenciales de AWS estáticas y de larga duración.",
                    en: "Avoids static, long-lived AWS credentials.",
                  },
                  tradeoff: {
                    es: "Las políticas de confianza en la nube deben configurarse correctamente.",
                    en: "Cloud trust policies must be configured correctly.",
                  },
                },
              ],
            },
            {
              type: "list",
              title: { es: "Fiabilidad y seguridad", en: "Reliability and security" },
              columns: 2,
              items: [
                { es: "Rutas de negocio protegidas.", en: "Protected business routes." },
                { es: "Autorización por roles.", en: "Role-based authorization." },
                { es: "Contrato de respuesta de la API.", en: "Consistent API response contract." },
                { es: "Validación de solicitudes.", en: "Request validation." },
                {
                  es: "Escrituras condicionales de inventario.",
                  en: "Conditional inventory writes.",
                },
                { es: "Idempotencia opcional.", en: "Optional idempotency." },
                { es: "Logs estructurados.", en: "Structured logs." },
                { es: "Alarmas de CloudWatch.", en: "CloudWatch alarms." },
                { es: "Concurrencia Lambda reservada.", en: "Reserved Lambda concurrency." },
                { es: "Throttling de la API.", en: "API throttling." },
                { es: "Acceso privado a S3.", en: "Private S3 access." },
                { es: "Acceso de CI mediante OIDC.", en: "CI access through OIDC." },
                {
                  es: "Controles de costo dentro de Free Tier.",
                  en: "Cost controls within the Free Tier.",
                },
                {
                  es: "No es una seguridad empresarial formalmente auditada.",
                  en: "This is not formally audited enterprise security.",
                },
              ],
            },
            {
              type: "list",
              title: { es: "Calidad y DevOps", en: "Quality and DevOps" },
              columns: 2,
              items: [
                {
                  es: "Pruebas automatizadas del backend (246 aprobadas).",
                  en: "Automated backend tests (246 passing).",
                },
                { es: "Validación de datos semilla (seed).", en: "Seed data validation." },
                {
                  es: "Builds independientes de frontend y backend.",
                  en: "Independent frontend and backend builds.",
                },
                { es: "Validación de Terraform.", en: "Terraform validation." },
                { es: "Workflow de despliegue.", en: "Deployment workflow." },
                { es: "Smoke tests contra producción.", en: "Smoke tests against production." },
                { es: "Logs en CloudWatch.", en: "CloudWatch logs." },
                { es: "Configuración de alarmas.", en: "Alarm configuration." },
                { es: "Fixtures de datos.", en: "Data fixtures." },
                {
                  es: "Validación en producción mediante el pipeline.",
                  en: "Production validation through the pipeline.",
                },
              ],
            },
            {
              type: "list",
              title: { es: "Alcance Lite", en: "Lite scope" },
              columns: 2,
              items: [
                {
                  es: "Utiliza datos simulados o de demostración.",
                  en: "Runs on simulated or demonstration data.",
                },
                { es: "No incluye libros contables.", en: "No accounting ledgers." },
                {
                  es: "No produce estados financieros oficiales.",
                  en: "No official financial statements.",
                },
                { es: "No incluye facturación electrónica.", en: "No electronic invoicing." },
                { es: "No incluye nómina.", en: "No payroll." },
                {
                  es: "No incluye contabilidad multiempresa.",
                  en: "No multi-company accounting.",
                },
                { es: "No incluye cumplimiento tributario.", en: "No tax compliance." },
                { es: "No reemplaza un ERP comercial.", en: "It does not replace a commercial ERP." },
                {
                  es: "La rotación de refresh JWT queda fuera del alcance actual.",
                  en: "JWT refresh rotation is outside the current scope.",
                },
                {
                  es: "La automatización E2E del frontend puede ser parcial.",
                  en: "Frontend E2E automation may be partial.",
                },
                {
                  es: "El catálogo de reportes es intencionalmente limitado.",
                  en: "The report catalog is intentionally limited.",
                },
                {
                  es: "La idempotencia puede ser local al contenedor Lambda.",
                  en: "Idempotency may be local to the Lambda container.",
                },
                {
                  es: "El modelado en DynamoDB prioriza la claridad sobre la optimización single-table avanzada.",
                  en: "DynamoDB modeling favors clarity over advanced single-table optimization.",
                },
                {
                  es: "El proyecto está diseñado como una demostración de arquitectura y lógica de negocio.",
                  en: "The project is designed as a demonstration of architecture and business logic.",
                },
              ],
            },
            {
              type: "list",
              title: { es: "Qué demuestra este proyecto", en: "What this project demonstrates" },
              columns: 2,
              items: [
                { es: "Diseño de sistemas full-stack.", en: "Full-stack systems design." },
                { es: "UI empresarial en React.", en: "Business UI in React." },
                {
                  es: "Arquitectura de backend serverless.",
                  en: "Serverless backend architecture.",
                },
                { es: "Modelado de estados de negocio.", en: "Business state modeling." },
                { es: "Autorización por roles.", en: "Role-based authorization." },
                { es: "Integridad de inventario.", en: "Inventory integrity." },
                { es: "Abstracción de repositorio.", en: "Repository abstraction." },
                { es: "Patrones de acceso a DynamoDB.", en: "DynamoDB access patterns." },
                { es: "Infraestructura como código.", en: "Infrastructure as code." },
                {
                  es: "CI/CD sin credenciales estáticas de nube.",
                  en: "CI/CD without static cloud credentials.",
                },
                { es: "Observabilidad.", en: "Observability." },
                { es: "Desarrollo local testeable.", en: "Testable local development." },
                {
                  es: "Control consciente del alcance y del costo.",
                  en: "Deliberate scope and cost control.",
                },
              ],
            },
          ],
        },
      },
      {
        name: {
          es: "ERP / Requisiciones / Compras",
          en: "ERP / Requisitions / Purchasing",
        },
        description: {
          es: "Demo Lite orientada a procesos internos de compras, requisiciones y seguimiento comercial. Representa flujos de solicitud, aprobación, asignación, reportería y modernización de módulos empresariales, con un alcance ligero creado para demostrar lógica de negocio y diseño de procesos.",
          en: "Lite demo focused on internal purchasing, requisition and sales-follow-up processes. It models request, approval, assignment, reporting and business-module modernization flows, with a light scope built to demonstrate business logic and process design.",
        },
        tags: [
          { name: "PHP", color: "pink-text-gradient" },
          { name: "JavaScript", color: "green-text-gradient" },
          { name: "SQL", color: "blue-text-gradient" },
          { name: "MVC", color: "pink-text-gradient" },
          { name: "Power BI", color: "green-text-gradient" },
          { name: "Linux", color: "blue-text-gradient" },
        ],
        image: erp2,
        source_code_link: "",
        caseStudy: {
          id: "erp-requisiciones-compras-lite",
          eyebrow: {
            es: "Caso de estudio de procesos internos",
            en: "Internal process case study",
          },
          title: {
            es: "ERP / Requisiciones / Compras — Demo Lite",
            en: "ERP / Requisitions / Purchasing — Lite Demo",
          },
          status: {
            es: "Prototipo funcional · alcance demostrativo",
            en: "Working prototype · demonstration scope",
          },
          role: {
            es: "Análisis, modernización, lógica empresarial y experiencia de usuario",
            en: "Analysis, modernization, business logic and user experience",
          },
          scope: {
            es: "Compras, requisiciones, aprobaciones y CRM interno Lite",
            en: "Purchasing, requisitions, approvals and internal CRM Lite",
          },
          badges: [
            { es: "Demo Lite", en: "Lite Demo" },
            { es: "Entorno demostrativo", en: "Demonstration environment" },
            { es: "Procesos internos", en: "Internal processes" },
          ],
          summary: {
            es: "Este proyecto representa una demostración ligera de cómo modernizar procesos internos relacionados con requisiciones, compras, aprobaciones y seguimiento comercial. Su objetivo es evidenciar análisis de flujo, reglas de estado, separación de responsabilidades, diseño de módulos y mejora de experiencia de usuario, sin intentar reproducir toda la operación de un ERP corporativo.",
            en: "This project is a lightweight demonstration of how to modernize internal processes around requisitions, purchasing, approvals and sales follow-up. Its purpose is to show workflow analysis, state rules, separation of concerns, module design and user-experience improvements, without trying to reproduce the entire operation of a corporate ERP.",
          },
          links: {},
          sections: [
            {
              type: "chips",
              title: { es: "Áreas cubiertas", en: "Areas covered" },
              items: [
                { es: "Flujo de aprobación", en: "Approval workflow" },
                { es: "Compras", en: "Purchasing" },
                { es: "CRM interno Lite", en: "Internal CRM Lite" },
                { es: "Reportería", en: "Reporting" },
                "SQL",
              ],
            },
            {
              type: "prose",
              title: { es: "¿Por qué se creó?", en: "Why it was built" },
              body: {
                es: "El caso fue creado para demostrar que el desarrollo empresarial no consiste solamente en formularios y tablas. Los procesos internos requieren estados válidos, responsables, permisos, trazabilidad, validaciones y una interfaz que permita comprender qué ocurre antes, durante y después de cada decisión.",
                en: "The case study was created to show that business development is not only forms and tables. Internal processes require valid states, owners, permissions, traceability, validation and a UI that makes clear what happens before, during and after every decision.",
              },
            },
            {
              type: "split",
              columns: [
                {
                  title: { es: "Problema", en: "Problem" },
                  body: {
                    es: "En muchos sistemas internos, las requisiciones, compras y oportunidades comerciales se administran mediante pantallas aisladas, estados ambiguos, consultas manuales y poca visibilidad sobre responsables o siguientes pasos. Esto puede producir solicitudes duplicadas, aprobaciones sin contexto, dificultad para conocer pendientes y reportes que requieren intervención técnica.",
                    en: "In many internal systems, requisitions, purchases and sales opportunities are handled through isolated screens, ambiguous states, manual queries and little visibility into owners or next steps. That produces duplicated requests, approvals without context, difficulty tracking pending work and reports that need technical intervention.",
                  },
                },
                {
                  title: { es: "Solución", en: "Solution" },
                  body: {
                    es: "La demo organiza el proceso en módulos pequeños y conectados. Las solicitudes atraviesan estados definidos, se asignan responsables, se registran decisiones y se presentan resúmenes que permiten visualizar pendientes, aprobaciones, compras y seguimiento comercial. La interfaz prioriza claridad operativa y la lógica se mantiene separada de la presentación.",
                    en: "The demo splits the process into small, connected modules. Requests move through defined states, owners are assigned, decisions are recorded and summaries surface pending work, approvals, purchases and sales follow-up. The interface prioritizes operational clarity and the logic stays separate from the presentation layer.",
                  },
                },
              ],
            },
            {
              type: "cards",
              title: { es: "Áreas funcionales", en: "Functional areas" },
              columns: 2,
              items: [
                {
                  title: { es: "Requisiciones", en: "Requisitions" },
                  items: [
                    { es: "Creación de solicitud", en: "Request creation" },
                    { es: "Detalle", en: "Detail view" },
                    { es: "Estado", en: "Status" },
                    { es: "Responsable", en: "Owner" },
                    { es: "Seguimiento", en: "Follow-up" },
                    {
                      es: "Validación antes de la transición",
                      en: "Validation before each transition",
                    },
                  ],
                },
                {
                  title: { es: "Aprobaciones", en: "Approvals" },
                  items: [
                    { es: "Aprobación", en: "Approval" },
                    { es: "Rechazo", en: "Rejection" },
                    { es: "Diálogos de confirmación", en: "Confirmation dialogs" },
                    { es: "Acciones según permisos", en: "Permission-aware actions" },
                  ],
                },
                {
                  title: { es: "Compras", en: "Purchasing" },
                  items: [
                    {
                      es: "Conversión de una solicitud aprobada en flujo de compra",
                      en: "Turning an approved request into a purchase flow",
                    },
                    { es: "Estado de la compra", en: "Purchase status" },
                  ],
                },
                {
                  title: { es: "CRM interno Lite", en: "Internal CRM Lite" },
                  items: [
                    { es: "Clientes o leads", en: "Customers or leads" },
                    { es: "Etapa comercial", en: "Sales stage" },
                    { es: "Notas", en: "Notes" },
                    { es: "Usuario responsable", en: "Assigned user" },
                    { es: "Seguimiento interno", en: "Internal follow-up" },
                  ],
                },
                {
                  title: { es: "Reporterías", en: "Reporting" },
                  items: [
                    { es: "Filtros", en: "Filters" },
                    { es: "Resúmenes por estado", en: "Summaries by status" },
                    { es: "Resúmenes por responsable", en: "Summaries by owner" },
                    { es: "Exportaciones", en: "Exports" },
                    { es: "Visualización con Power BI", en: "Power BI visualization" },
                  ],
                },
                {
                  title: { es: "SQL y acceso a datos", en: "SQL and data access" },
                  items: [
                    { es: "Consultas optimizadas", en: "Optimized queries" },
                    { es: "Joins", en: "Joins" },
                    { es: "Filtros", en: "Filters" },
                    { es: "Paginación", en: "Pagination" },
                    { es: "Consultas de reportería", en: "Reporting queries" },
                  ],
                },
              ],
            },
            {
              type: "flows",
              title: {
                es: "Flujo de requisición (representativo)",
                en: "Requisition flow (representative)",
              },
              flows: [
                {
                  label: { es: "Proceso interno", en: "Internal process" },
                  nodes: [
                    { es: "Necesidad interna", en: "Internal need" },
                    { es: "Creación de requisición", en: "Requisition created" },
                    { es: "Validación", en: "Validation" },
                    { es: "Revisión", en: "Review" },
                    { es: "Aprobación o rechazo", en: "Approval or rejection" },
                    { es: "Compra", en: "Purchase" },
                    { es: "Recepción o cierre", en: "Reception or closure" },
                    { es: "Reportería e historial", en: "Reporting and history" },
                  ],
                },
              ],
              note: {
                es: "Los estados mostrados son representativos del proceso; el objetivo es ilustrar transiciones controladas, responsables y trazabilidad, no imponer nombres exactos de una implementación concreta.",
                en: "The states shown are representative of the process; the goal is to illustrate controlled transitions, ownership and traceability, not to impose the exact naming of a specific implementation.",
              },
            },
            {
              type: "flows",
              title: { es: "Seguimiento comercial (CRM)", en: "Sales follow-up (CRM)" },
              flows: [
                {
                  label: { es: "Etapas del contacto", en: "Contact stages" },
                  nodes: [
                    { es: "Nuevo contacto", en: "New contact" },
                    { es: "Calificación", en: "Qualification" },
                    { es: "Presentación", en: "Presentation" },
                    { es: "Negociación", en: "Negotiation" },
                    { es: "Cierre", en: "Closing" },
                  ],
                },
              ],
            },
            {
              type: "groups",
              title: {
                es: "De una pantalla aislada a un proceso trazable",
                en: "From an isolated screen to a traceable process",
              },
              groups: [
                {
                  category: { es: "Antes", en: "Before" },
                  items: [
                    { es: "Formularios aislados.", en: "Isolated forms." },
                    { es: "Seguimiento manual.", en: "Manual follow-up." },
                    { es: "Estados ambiguos.", en: "Ambiguous states." },
                    {
                      es: "Visibilidad limitada de responsables.",
                      en: "Limited visibility of owners.",
                    },
                    {
                      es: "Reportería mediante consultas directas a la base de datos.",
                      en: "Reporting through direct database queries.",
                    },
                    { es: "Validación inconsistente.", en: "Inconsistent validation." },
                  ],
                },
                {
                  category: { es: "Después", en: "After" },
                  items: [
                    { es: "Flujo de trabajo explícito.", en: "Explicit workflow." },
                    { es: "Transiciones controladas.", en: "Controlled transitions." },
                    { es: "Responsabilidad asignada.", en: "Assigned ownership." },
                    { es: "Estado visible.", en: "Visible status." },
                    { es: "Validación reutilizable.", en: "Reusable validation." },
                    { es: "Reportería centralizada.", en: "Centralized reporting." },
                    { es: "Mejor retroalimentación al usuario.", en: "Better user feedback." },
                  ],
                },
              ],
            },
            {
              type: "flows",
              title: { es: "Arquitectura por capas", en: "Layered architecture" },
              badge: "MVC",
              flows: [
                {
                  label: { es: "Flujo de una solicitud", en: "Path of a request" },
                  nodes: [
                    "Frontend",
                    { es: "Controlador o API", en: "Controller or API" },
                    { es: "Capa de negocio", en: "Business layer" },
                    { es: "Modelo o repositorio", en: "Model or repository" },
                    { es: "Base de datos relacional", en: "Relational database" },
                    { es: "Reportería", en: "Reporting" },
                  ],
                },
              ],
            },
            {
              type: "definitions",
              title: { es: "Responsabilidades por capa", en: "Responsibilities per layer" },
              items: [
                {
                  term: { es: "Presentación", en: "Presentation" },
                  desc: {
                    es: "Formularios, tablas, filtros, resúmenes y diálogos de confirmación.",
                    en: "Forms, tables, filters, summaries and confirmation dialogs.",
                  },
                },
                {
                  term: { es: "Controlador o API", en: "Controller or API" },
                  desc: {
                    es: "Recibe solicitudes, valida permisos y coordina los casos de uso.",
                    en: "Receives requests, validates permissions and coordinates use cases.",
                  },
                },
                {
                  term: { es: "Lógica de negocio", en: "Business logic" },
                  desc: {
                    es: "Define las transiciones permitidas, la información requerida y las reglas del proceso.",
                    en: "Defines allowed transitions, required information and process rules.",
                  },
                },
                {
                  term: { es: "Persistencia", en: "Persistence" },
                  desc: {
                    es: "Almacena requisiciones, compras, usuarios, responsables, clientes e historial.",
                    en: "Stores requisitions, purchases, users, owners, customers and history.",
                  },
                },
                {
                  term: { es: "Reportería", en: "Reporting" },
                  desc: {
                    es: "Agrega información operativa para tableros o análisis de negocio, incluida la visualización con Power BI.",
                    en: "Aggregates operational data for dashboards or business analysis, including Power BI visualization.",
                  },
                },
              ],
            },
            {
              type: "decisions",
              title: { es: "Decisiones técnicas", en: "Technical decisions" },
              items: [
                {
                  title: { es: "Separación MVC", en: "MVC separation" },
                  reason: {
                    es: "Evita que las plantillas y la UI sean dueñas de las reglas de negocio.",
                    en: "Prevents templates and UI from owning business rules.",
                  },
                  tradeoff: {
                    es: "Los módulos legacy pueden requerir una refactorización gradual.",
                    en: "Legacy modules may require gradual refactoring.",
                  },
                },
                {
                  title: {
                    es: "Estados de workflow explícitos",
                    en: "Explicit workflow states",
                  },
                  reason: {
                    es: "Evita transiciones arbitrarias y hace visible el trabajo pendiente.",
                    en: "Prevents arbitrary transitions and makes pending work visible.",
                  },
                  tradeoff: {
                    es: "Cada estado nuevo debe definir transiciones y permisos.",
                    en: "Every new state must define its transitions and permissions.",
                  },
                },
                {
                  title: { es: "Validación centralizada", en: "Centralized validation" },
                  reason: {
                    es: "Mantiene consistentes las reglas del formulario y del backend.",
                    en: "Keeps form and backend rules consistent.",
                  },
                  tradeoff: {
                    es: "La validación legacy debe migrarse con cuidado.",
                    en: "Legacy validation must be migrated carefully.",
                  },
                },
                {
                  title: { es: "Optimización de consultas SQL", en: "SQL query optimization" },
                  reason: {
                    es: "Los módulos operativos y los reportes pueden degradarse cuando los joins y filtros no están diseñados para sus patrones de acceso.",
                    en: "Operational modules and reports degrade when joins and filters are not designed for their access patterns.",
                  },
                  tradeoff: {
                    es: "Los índices mejoran las lecturas pero agregan costo de escritura y mantenimiento.",
                    en: "Indexes improve reads but add write and maintenance cost.",
                  },
                },
                {
                  title: { es: "Modernización incremental", en: "Incremental modernization" },
                  reason: {
                    es: "Permite mejorar sin reemplazar por completo el ERP legacy.",
                    en: "Allows improvement without fully replacing the legacy ERP.",
                  },
                  tradeoff: {
                    es: "Patrones nuevos y legacy pueden coexistir temporalmente.",
                    en: "New and legacy patterns may coexist temporarily.",
                  },
                },
                {
                  title: { es: "Integración ligera de CRM", en: "Lightweight CRM integration" },
                  reason: {
                    es: "Conecta el seguimiento comercial con los procesos operativos internos.",
                    en: "Connects sales follow-up with internal operational processes.",
                  },
                  tradeoff: {
                    es: "No es un CRM completo e independiente.",
                    en: "It is not a complete, standalone CRM.",
                  },
                },
                {
                  title: { es: "Reportería con Power BI", en: "Reporting with Power BI" },
                  reason: {
                    es: "Separa la visualización analítica de las pantallas transaccionales.",
                    en: "Separates analytical visualization from transactional screens.",
                  },
                  tradeoff: {
                    es: "El refresco, los permisos y la gobernanza del modelo de datos requieren mantenimiento.",
                    en: "Refresh, permissions and data-model governance require maintenance.",
                  },
                },
              ],
            },
            {
              type: "list",
              title: {
                es: "Decisiones de experiencia de usuario",
                en: "User experience decisions",
              },
              columns: 2,
              items: [
                { es: "Etiquetas de estado visibles.", en: "Visible status labels." },
                { es: "Responsables claros.", en: "Clear owners." },
                {
                  es: "Confirmación antes de transiciones importantes.",
                  en: "Confirmation before meaningful transitions.",
                },
                { es: "Filtros por estado y por tiempo.", en: "Filters by status and by date." },
                {
                  es: "Retroalimentación de carga y de error.",
                  en: "Loading and error feedback.",
                },
                { es: "Guía para estados vacíos.", en: "Guidance for empty states." },
                { es: "Tablas legibles.", en: "Readable tables." },
                { es: "Acciones según el estado actual.", en: "Actions driven by the current state." },
                {
                  es: "Sin acciones críticas de flujo ocultas.",
                  en: "No hidden critical workflow actions.",
                },
              ],
            },
            {
              type: "list",
              title: { es: "Calidad", en: "Quality" },
              columns: 2,
              items: [
                { es: "Separación modular.", en: "Modular separation." },
                { es: "Validaciones reutilizables.", en: "Reusable validation." },
                { es: "Transiciones controladas.", en: "Controlled transitions." },
                { es: "Revisión de consultas.", en: "Query review." },
                {
                  es: "Validación en el frontend responsivo.",
                  en: "Validation in the responsive frontend.",
                },
                { es: "Manejo de errores.", en: "Error handling." },
                {
                  es: "Restricciones a nivel de base de datos.",
                  en: "Database-level constraints.",
                },
                { es: "Protección frente a regresiones.", en: "Protection against regressions." },
              ],
            },
            {
              type: "list",
              title: { es: "Alcance Lite", en: "Lite scope" },
              columns: 2,
              items: [
                {
                  es: "Es una demostración, no un ERP corporativo completo.",
                  en: "It is a demonstration, not a full corporate ERP.",
                },
                { es: "No cubre contabilidad.", en: "It does not cover accounting." },
                { es: "No cubre nómina.", en: "It does not cover payroll." },
                {
                  es: "No cubre cumplimiento tributario.",
                  en: "It does not cover tax compliance.",
                },
                {
                  es: "No representa todos los escenarios de compra.",
                  en: "It does not represent every purchasing scenario.",
                },
                {
                  es: "La gestión de proveedores puede estar simplificada.",
                  en: "Supplier management may be simplified.",
                },
                {
                  es: "La integración de inventario puede ser parcial.",
                  en: "Inventory integration may be partial.",
                },
                {
                  es: "La funcionalidad de CRM es intencionalmente ligera.",
                  en: "CRM functionality is intentionally light.",
                },
                {
                  es: "La reportería es representativa, no exhaustiva.",
                  en: "Reporting is representative, not exhaustive.",
                },
                {
                  es: "Algunos datos o pantallas pueden ser simulados.",
                  en: "Some data or screens may be simulated.",
                },
                {
                  es: "Está diseñada para demostrar modelado de procesos y decisiones de modernización.",
                  en: "It is designed to demonstrate process modeling and modernization decisions.",
                },
                {
                  es: "Cualquier uso en producción requeriría reglas, integraciones, permisos y migración de datos específicos de la empresa.",
                  en: "Any production use would require company-specific rules, integrations, permissions and data migration.",
                },
              ],
            },
            {
              type: "list",
              title: { es: "Qué demuestra este proyecto", en: "What this project demonstrates" },
              columns: 2,
              items: [
                { es: "Análisis de procesos empresariales.", en: "Business process analysis." },
                {
                  es: "Modelado de requisiciones y aprobaciones.",
                  en: "Requisition and approval modeling.",
                },
                { es: "Diseño de flujo de compras.", en: "Purchasing workflow design." },
                { es: "Conceptos de CRM interno.", en: "Internal CRM concepts." },
                { es: "Arquitectura MVC.", en: "MVC architecture." },
                { es: "SQL y reportería.", en: "SQL and reporting." },
                {
                  es: "Modernización incremental de sistemas legacy.",
                  en: "Incremental modernization of legacy systems.",
                },
                { es: "UI consciente de permisos.", en: "Permission-aware UI." },
                { es: "UX orientada a procesos.", en: "Process-oriented UX." },
                {
                  es: "Capacidad de convertir requisitos en flujos de software con estado.",
                  en: "Ability to turn requirements into stateful software workflows.",
                },
                { es: "Definición honesta del alcance.", en: "Honest scope definition." },
              ],
            },
          ],
        },
      },
      {
        name: { es: "Mis Finanzas", en: "Mis Finanzas" },
        description: {
          es: "Comenzó como una herramienta muy personal para organizar mis finanzas y evolucionó hasta convertirse en una aplicación Android nativa de nivel profesional. Permite administrar ingresos, gastos, presupuestos, metas, cuotas y movimientos con una arquitectura local-first: toda la información se guarda cifrada en el dispositivo y funciona sin conexión a Internet. AWS se utiliza únicamente para distribuir el APK.",
          en: "It started as a deeply personal tool to organize my own finances and grew into a professional-grade native Android app. It manages income, expenses, budgets, goals, installments and transactions with a local-first architecture: everything is stored encrypted on the device and works with no internet connection. AWS is used only to distribute the APK.",
        },
        tags: [
          { name: "Kotlin", color: "blue-text-gradient" },
          { name: "JetpackCompose", color: "green-text-gradient" },
          { name: "SQLCipher", color: "pink-text-gradient" },
          { name: "LocalFirst", color: "blue-text-gradient" },
          { name: "Android", color: "green-text-gradient" },
        ],
        image: androidapp,
        image_alt: {
          es: "Vista previa de la aplicación Android Mis Finanzas",
          en: "Preview of the Mis Finanzas Android app",
        },
        source_code_link: "https://github.com/lighsiegfried/Finanzas",
        download_link: import.meta.env.VITE_FINANZAS_APK_URL,
        download_label: {
          es: "Descargar Mis Finanzas para Android",
          en: "Download Mis Finanzas for Android",
        },
        download_description: {
          es: "APK oficial · descarga directa",
          en: "Official APK · direct download",
        },
        caseStudy: {
          id: "mis-finanzas-android",
          eyebrow: {
            es: "Caso de estudio Android local-first",
            en: "Local-first Android case study",
          },
          title: {
            es: "Mis Finanzas — control financiero privado y offline",
            en: "Mis Finanzas — private, offline personal finance",
          },
          status: {
            es: "Aplicación funcional · APK disponible",
            en: "Working application · APK available",
          },
          role: {
            es: "Producto, arquitectura, desarrollo Android y seguridad",
            en: "Product, architecture, Android development and security",
          },
          platform: { es: "Android 8.0 o superior", en: "Android 8.0 or higher" },
          locale: "Guatemala · Quetzales · es-GT",
          badges: [
            { es: "Local-first", en: "Local-first" },
            { es: "Sin conexión", en: "Offline" },
            { es: "Datos cifrados", en: "Encrypted data" },
            { es: "Android nativo", en: "Native Android" },
            { es: "Privacidad por diseño", en: "Privacy by design" },
          ],
          summary: {
            es: "Mis Finanzas es una aplicación Android nativa creada inicialmente para organizar mis propios ingresos, gastos y compromisos financieros. El proyecto evolucionó hasta convertirse en una solución local-first con arquitectura Clean Architecture y MVVM, persistencia cifrada, reportes, presupuestos, metas, respaldos portables y un asistente financiero local de solo lectura. Toda la información permanece en el dispositivo y la aplicación funciona sin conexión a Internet.",
            en: "Mis Finanzas is a native Android application originally built to organize my own income, expenses and financial commitments. The project grew into a local-first solution with Clean Architecture and MVVM, encrypted persistence, reports, budgets, goals, portable backups and a read-only local financial assistant. All data stays on the device and the app works with no internet connection.",
          },
          metrics: [
            { value: "10", label: { es: "reportes financieros", en: "financial reports" } },
            { value: "54", label: { es: "casos de uso de dominio", en: "domain use cases" } },
            { value: "17", label: { es: "modelos de dominio", en: "domain models" } },
            { value: "6", label: { es: "versiones de esquema Room", en: "Room schema versions" } },
          ],
          links: {
            github: "https://github.com/lighsiegfried/Finanzas",
            download: true,
          },
          sections: [
            {
              type: "prose",
              title: { es: "¿Por qué se creó?", en: "Why it was built" },
              body: {
                es: "El proyecto nació de una necesidad personal: contar con una herramienta sencilla para registrar movimientos y comprender en qué se utilizaba el dinero, sin depender de hojas de cálculo, notas dispersas, conexiones bancarias ni plataformas que almacenaran información financiera en servidores externos. Conforme aumentó el alcance, la herramienta se convirtió en una aplicación completa orientada a privacidad, continuidad de datos, planificación financiera y uso cotidiano.",
                en: "The project came out of a personal need: a simple tool to record transactions and understand where the money went, without relying on spreadsheets, scattered notes, bank connections or platforms that store financial data on external servers. As the scope grew, the tool became a complete application built around privacy, data continuity, financial planning and everyday use.",
              },
            },
            {
              type: "list",
              title: { es: "¿Para quién está pensada?", en: "Who is it for?" },
              items: [
                {
                  es: "Personas que desean registrar sus finanzas manualmente.",
                  en: "People who want to record their finances manually.",
                },
                {
                  es: "Usuarios que prefieren mantener sus datos en el dispositivo.",
                  en: "Users who prefer to keep their data on the device.",
                },
                {
                  es: "Personas que manejan efectivo, bancos, tarjetas, ahorro o billeteras digitales.",
                  en: "People juggling cash, bank accounts, cards, savings or digital wallets.",
                },
                {
                  es: "Usuarios que necesitan controlar cuotas y pagos recurrentes.",
                  en: "Users who need to track installments and recurring payments.",
                },
                {
                  es: "Personas que quieren planificar metas y presupuestos.",
                  en: "People who want to plan goals and budgets.",
                },
                {
                  es: "Usuarios que no desean conectar cuentas bancarias a terceros.",
                  en: "Users who do not want to link bank accounts to third parties.",
                },
                {
                  es: "Contexto guatemalteco, con moneda en quetzales y formato es-GT.",
                  en: "A Guatemalan context, with quetzal currency and es-GT formatting.",
                },
                {
                  es: "No sustituye la contabilidad profesional ni la asesoría financiera regulada.",
                  en: "It does not replace professional accounting or regulated financial advice.",
                },
              ],
            },
            {
              type: "split",
              columns: [
                {
                  title: { es: "Problema", en: "Problem" },
                  body: {
                    es: "Las finanzas personales suelen registrarse de forma fragmentada entre notas, hojas de cálculo, mensajes o memoria. Esto dificulta conocer el saldo disponible, identificar patrones de gasto, controlar cuotas, anticipar compromisos recurrentes y medir el avance de metas. Muchas aplicaciones además requieren cuentas, conexión permanente, sincronización en la nube o acceso a información bancaria. El reto fue construir una alternativa privada, utilizable sin conexión y suficientemente estructurada para acompañar el ciclo financiero personal completo.",
                    en: "Personal finances are usually tracked in fragments across notes, spreadsheets, messages or memory. That makes it hard to know the available balance, spot spending patterns, control installments, anticipate recurring commitments and measure progress toward goals. Many apps also require accounts, a permanent connection, cloud sync or access to banking data. The challenge was to build a private alternative, usable offline and structured enough to support the entire personal finance cycle.",
                  },
                },
                {
                  title: { es: "Solución", en: "Solution" },
                  body: {
                    es: "Se desarrolló una aplicación Android nativa centrada en el registro manual y consciente de la actividad financiera. La solución permite organizar cuentas, ingresos, gastos, transferencias, cuotas, recurrencias, presupuestos, metas y compras planificadas. La información se procesa mediante reglas de dominio independientes de la interfaz y se almacena en una base Room cifrada con SQLCipher. El producto incorpora reportes, gráficas, respaldos cifrados, comprobantes protegidos, OCR local y un asistente que consulta los datos sin modificarlos.",
                    en: "A native Android application was built around deliberate, manual recording of financial activity. It organizes accounts, income, expenses, transfers, installments, recurring items, budgets, goals and planned purchases. Data is processed by domain rules that are independent of the UI and stored in a Room database encrypted with SQLCipher. The product adds reports, charts, encrypted backups, protected receipts, local OCR and an assistant that reads the data without modifying it.",
                  },
                },
              ],
            },
            {
              type: "flows",
              title: { es: "Arquitectura", en: "Architecture" },
              badge: "Clean Architecture · MVVM",
              flows: [
                {
                  label: { es: "Flujo principal", en: "Main flow" },
                  nodes: [
                    "Jetpack Compose + Material 3",
                    "ViewModels / MVVM",
                    { es: "Casos de uso del dominio", en: "Domain use cases" },
                    { es: "Interfaces de repositorio", en: "Repository interfaces" },
                    { es: "Implementaciones de datos", en: "Data implementations" },
                    "Room + SQLCipher",
                    {
                      es: "Almacenamiento cifrado en el dispositivo",
                      en: "Encrypted on-device storage",
                    },
                  ],
                },
              ],
            },
            {
              type: "definitions",
              title: { es: "Sistemas de apoyo", en: "Supporting systems" },
              items: [
                {
                  term: "Android Keystore",
                  desc: {
                    es: "Envuelve y protege la contraseña de la base de datos SQLCipher.",
                    en: "Wraps and protects the SQLCipher database password.",
                  },
                },
                {
                  term: "AndroidX Biometric",
                  desc: {
                    es: "Controla el acceso a la aplicación.",
                    en: "Guards access to the application.",
                  },
                },
                {
                  term: "DataStore",
                  desc: {
                    es: "Almacena preferencias no sensibles.",
                    en: "Stores non-sensitive preferences.",
                  },
                },
                {
                  term: "WorkManager",
                  desc: {
                    es: "Programa recordatorios y trabajo local diferido.",
                    en: "Schedules reminders and deferred local work.",
                  },
                },
                {
                  term: "Glance",
                  desc: {
                    es: "Proporciona widgets en la pantalla de inicio.",
                    en: "Provides home-screen widgets.",
                  },
                },
                {
                  term: "Vico",
                  desc: {
                    es: "Renderiza gráficas y visualizaciones financieras.",
                    en: "Renders charts and financial visualizations.",
                  },
                },
                {
                  term: {
                    es: "Almacenamiento cifrado de adjuntos",
                    en: "Encrypted attachment storage",
                  },
                  desc: {
                    es: "Guarda comprobantes en imagen y PDF.",
                    en: "Keeps image and PDF receipts.",
                  },
                },
                {
                  term: { es: "OCR local", en: "Local OCR" },
                  desc: {
                    es: "Extrae información de comprobantes como asistencia opcional.",
                    en: "Extracts receipt data as optional assistance.",
                  },
                },
                {
                  term: { es: "Gestor de respaldos", en: "Backup manager" },
                  desc: {
                    es: "Crea y restaura respaldos cifrados portables.",
                    en: "Creates and restores portable encrypted backups.",
                  },
                },
                {
                  term: { es: "Asistente financiero local", en: "Local financial assistant" },
                  desc: {
                    es: "Lee la información financiera mediante herramientas de dominio controladas.",
                    en: "Reads financial data through controlled domain tools.",
                  },
                },
              ],
            },
            {
              type: "definitions",
              title: { es: "Responsabilidades por capa", en: "Responsibilities per layer" },
              items: [
                {
                  term: { es: "Presentación", en: "Presentation" },
                  desc: {
                    es: "Las pantallas y ViewModels de Jetpack Compose gestionan la interacción, el estado visual y la navegación. Cada área funcional tiene su propio paquete de presentación: cuentas, movimientos, presupuestos, reportes, metas, adjuntos, asistente y ajustes.",
                    en: "Jetpack Compose screens and ViewModels handle interaction, visual state and navigation. Each functional area has its own presentation package: accounts, transactions, budgets, reports, goals, attachments, assistant and settings.",
                  },
                },
                {
                  term: { es: "Dominio", en: "Domain" },
                  desc: {
                    es: "Contiene los modelos financieros, los contratos de repositorio, las reglas de validación y los casos de uso. No depende de la UI de Android ni de Room. Los cálculos financieros se realizan en esta capa y no dentro de los composables o ViewModels.",
                    en: "Holds the financial models, repository contracts, validation rules and use cases. It depends on neither the Android UI nor Room. Financial calculations live in this layer, not inside composables or ViewModels.",
                  },
                },
                {
                  term: { es: "Datos", en: "Data" },
                  desc: {
                    es: "Implementa los repositorios y coordina Room, SQLCipher, DataStore, importación/exportación CSV, adjuntos cifrados, respaldos, OCR y el acceso a datos del asistente local. Mapea las entidades de persistencia a los modelos de dominio.",
                    en: "Implements the repositories and coordinates Room, SQLCipher, DataStore, CSV import/export, encrypted attachments, backups, OCR and the local assistant's data access. It maps persistence entities to domain models.",
                  },
                },
                {
                  term: { es: "Inyección de dependencias", en: "Dependency injection" },
                  desc: {
                    es: "Las dependencias se ensamblan manualmente a través de AppContainer y AppViewModelProvider. Esto evita el acoplamiento a frameworks y mantiene la construcción de objetos centralizada y explícita.",
                    en: "Dependencies are wired manually through AppContainer and AppViewModelProvider. This avoids framework coupling and keeps object construction centralized and explicit.",
                  },
                },
              ],
            },
            {
              type: "prose",
              title: { es: "Propiedad y flujo de los datos", en: "Data ownership and flow" },
              body: {
                es: "El dispositivo Android del usuario es el único propietario automático del estado financiero. No existe una base de datos remota, cuenta en la nube ni sincronización con servidores. AWS solo distribuye el APK y nunca recibe los registros financieros generados por la aplicación.",
                en: "The user's Android device is the only automatic owner of the financial state. There is no remote database, cloud account or server sync. AWS only distributes the APK and never receives the financial records the app produces.",
              },
            },
            {
              type: "flows",
              title: { es: "Flujo de datos", en: "Data flow" },
              flows: [
                {
                  label: { es: "Registro de un movimiento", en: "Recording a transaction" },
                  nodes: [
                    { es: "Acción del usuario", en: "User action" },
                    "ViewModel",
                    { es: "Caso de uso de validación", en: "Validation use case" },
                    { es: "Regla de dominio financiero", en: "Financial domain rule" },
                    { es: "Interfaz de repositorio", en: "Repository interface" },
                    { es: "Transacción Room", en: "Room transaction" },
                    { es: "Base de datos cifrada SQLCipher", en: "SQLCipher encrypted database" },
                    "Flow / StateFlow",
                    { es: "UI Compose actualizada", en: "Compose UI updated" },
                  ],
                },
                {
                  label: { es: "Adjuntos", en: "Attachments" },
                  nodes: [
                    { es: "Imagen o PDF elegido por el usuario", en: "Image or PDF picked by the user" },
                    { es: "Validación", en: "Validation" },
                    { es: "Almacenamiento de archivo cifrado", en: "Encrypted file storage" },
                    { es: "Referencia de metadatos cifrada", en: "Encrypted metadata reference" },
                    { es: "Detalle del movimiento", en: "Transaction detail" },
                  ],
                },
                {
                  label: { es: "Respaldos", en: "Backups" },
                  nodes: [
                    { es: "El usuario solicita un respaldo", en: "User requests a backup" },
                    {
                      es: "Elige destino con el selector de documentos de Android",
                      en: "Picks a destination with the Android document picker",
                    },
                    {
                      es: "Proporciona una contraseña de respaldo",
                      en: "Provides a backup password",
                    },
                    { es: "Derivación de clave Argon2id", en: "Argon2id key derivation" },
                    { es: "Cifrado AES-256-GCM", en: "AES-256-GCM encryption" },
                    { es: "Archivo de respaldo portable", en: "Portable backup file" },
                  ],
                },
              ],
            },
            {
              type: "list",
              title: { es: "Integridad financiera", en: "Financial integrity" },
              badge: { es: "Enteros en centavos", en: "Integer cents" },
              items: [
                {
                  es: "El dinero nunca se almacena ni se calcula con Float o Double.",
                  en: "Money is never stored or computed with Float or Double.",
                },
                {
                  es: "Los importes usan valores enteros Long en centavos.",
                  en: "Amounts use Long integer values in cents.",
                },
                { es: "Q125.75 se almacena como 12575.", en: "Q125.75 is stored as 12575." },
                {
                  es: "El parseo está centralizado en AmountParser.",
                  en: "Parsing is centralized in AmountParser.",
                },
                {
                  es: "El formato de visualización está centralizado en CurrencyFormatter.",
                  en: "Display formatting is centralized in CurrencyFormatter.",
                },
                {
                  es: "La aplicación usa formato es-GT y quetzales.",
                  en: "The app uses es-GT formatting and quetzales.",
                },
                {
                  es: "La aritmética segura rechaza valores fuera del rango permitido.",
                  en: "Safe arithmetic rejects values outside the allowed range.",
                },
                {
                  es: "Los cálculos financieros permanecen en la capa de dominio.",
                  en: "Financial calculations stay in the domain layer.",
                },
                {
                  es: "El modo privacidad enmascara los saldos sin cambiar los valores almacenados.",
                  en: "Privacy mode masks balances without changing stored values.",
                },
                {
                  es: "Las transferencias preservan la relación entre la cuenta de origen y la de destino.",
                  en: "Transfers preserve the relationship between source and destination accounts.",
                },
                {
                  es: "Los reportes y el asistente reutilizan la misma lógica de cálculo.",
                  en: "Reports and the assistant reuse the same calculation logic.",
                },
              ],
            },
            {
              type: "groups",
              title: { es: "Capacidades principales", en: "Core capabilities" },
              groups: [
                {
                  category: { es: "Registro diario", en: "Daily tracking" },
                  items: [
                    { es: "Cuentas", en: "Accounts" },
                    { es: "Categorías", en: "Categories" },
                    { es: "Gastos", en: "Expenses" },
                    { es: "Ingresos", en: "Income" },
                    { es: "Transferencias", en: "Transfers" },
                    { es: "Edición y eliminación", en: "Editing and deletion" },
                    { es: "Plantillas de transacción", en: "Transaction templates" },
                    { es: "Acciones rápidas o favoritas", en: "Quick or favorite actions" },
                  ],
                },
                {
                  category: { es: "Compromisos", en: "Commitments" },
                  items: [
                    { es: "Compras en cuotas", en: "Installment purchases" },
                    { es: "Gastos recurrentes", en: "Recurring expenses" },
                    { es: "Ingresos recurrentes", en: "Recurring income" },
                    { es: "Seguimiento de ocurrencias", en: "Occurrence tracking" },
                    { es: "Recordatorios", en: "Reminders" },
                  ],
                },
                {
                  category: { es: "Planificación", en: "Planning" },
                  items: [
                    { es: "Presupuestos mensuales", en: "Monthly budgets" },
                    { es: "Presupuestos por categoría", en: "Budgets by category" },
                    { es: "Metas de ahorro", en: "Savings goals" },
                    { es: "Aportes de ahorro", en: "Savings contributions" },
                    { es: "Compras planificadas", en: "Planned purchases" },
                  ],
                },
                {
                  category: { es: "Análisis", en: "Analysis" },
                  items: [
                    { es: "Diez reportes financieros", en: "Ten financial reports" },
                    { es: "Gráficas", en: "Charts" },
                    { es: "Comparaciones mes a mes", en: "Month-over-month comparisons" },
                    { es: "Saldos de cuentas", en: "Account balances" },
                    { es: "Análisis por categoría", en: "Category analysis" },
                    { es: "Avance de presupuesto", en: "Budget progress" },
                    { es: "Avance de ahorro", en: "Savings progress" },
                  ],
                },
                {
                  category: { es: "Portabilidad de datos", en: "Data portability" },
                  items: [
                    { es: "Exportación CSV", en: "CSV export" },
                    { es: "Importación CSV", en: "CSV import" },
                    { es: "Respaldo cifrado", en: "Encrypted backup" },
                    { es: "Restauración cifrada", en: "Encrypted restore" },
                    {
                      es: "Migración a otro dispositivo Android",
                      en: "Migration to another Android device",
                    },
                  ],
                },
                {
                  category: { es: "Acceso diario", en: "Everyday access" },
                  items: [
                    { es: "Widgets de Android", en: "Android widgets" },
                    { es: "Accesos directos de la aplicación", en: "App shortcuts" },
                    { es: "Registro rápido de transacciones", en: "Quick transaction entry" },
                    { es: "Navegación adaptable", en: "Adaptive navigation" },
                  ],
                },
                {
                  category: { es: "Documentos", en: "Documents" },
                  items: [
                    { es: "Adjuntos de imagen cifrados", en: "Encrypted image attachments" },
                    { es: "Adjuntos de PDF cifrados", en: "Encrypted PDF attachments" },
                    { es: "Resumen de uso de almacenamiento", en: "Storage usage summary" },
                    { es: "OCR local opcional", en: "Optional local OCR" },
                    {
                      es: "Asociación de comprobantes con movimientos",
                      en: "Linking receipts to transactions",
                    },
                  ],
                },
                {
                  category: {
                    es: "Personalización y protección",
                    en: "Personalization and protection",
                  },
                  items: [
                    { es: "Tema claro", en: "Light theme" },
                    { es: "Tema oscuro", en: "Dark theme" },
                    { es: "Color dinámico", en: "Dynamic color" },
                    { es: "Modo privacidad para saldos", en: "Privacy mode for balances" },
                    { es: "Bloqueo de la aplicación", en: "App lock" },
                    { es: "Desbloqueo biométrico", en: "Biometric unlock" },
                    { es: "Centro de protección de datos", en: "Data protection center" },
                  ],
                },
              ],
            },
            {
              type: "prose",
              title: { es: "Asistente financiero local", en: "Local financial assistant" },
              badge: { es: "Solo lectura", en: "Read-only" },
              body: {
                es: "La aplicación incorpora un asistente que responde consultas en español utilizando únicamente los datos registrados en el dispositivo. Puede explicar gastos por categoría, comportamiento mensual, presupuestos o avance de metas. El asistente comparte las mismas reglas de cálculo que los reportes y está diseñado para reconocer cuándo faltan datos en lugar de inventar resultados.",
                en: "The app ships an assistant that answers questions in Spanish using only the data stored on the device. It can explain spending by category, monthly behavior, budgets or goal progress. The assistant shares the same calculation rules as the reports and is designed to admit when data is missing instead of inventing results.",
              },
            },
            {
              type: "list",
              title: { es: "Restricciones del asistente", en: "Assistant constraints" },
              items: [
                { es: "Ejecución únicamente local.", en: "Runs locally only." },
                {
                  es: "Sin modelo remoto ni API en la nube.",
                  en: "No remote model and no cloud API.",
                },
                { es: "Acceso de solo lectura.", en: "Read-only access." },
                {
                  es: "No puede guardar, editar ni eliminar datos financieros.",
                  en: "It cannot save, edit or delete financial data.",
                },
                {
                  es: "Puede preparar un borrador o abrir un formulario normal.",
                  en: "It can prepare a draft or open a regular form.",
                },
                {
                  es: "El usuario debe confirmar cada escritura.",
                  en: "The user must confirm every write.",
                },
                {
                  es: "Usa los cálculos existentes del dominio financiero.",
                  en: "It reuses the existing financial domain calculations.",
                },
                {
                  es: "No constituye asesoría financiera ni de inversión.",
                  en: "It is not financial or investment advice.",
                },
              ],
            },
            {
              type: "list",
              title: { es: "Privacidad por diseño", en: "Privacy by design" },
              badge: { es: "Privacidad por diseño", en: "Privacy by design" },
              columns: 2,
              items: [
                { es: "Sin permiso de INTERNET.", en: "No INTERNET permission." },
                { es: "Sin bibliotecas de red.", en: "No networking libraries." },
                { es: "Sin sincronización en la nube.", en: "No cloud sync." },
                { es: "Sin conexiones bancarias.", en: "No bank connections." },
                { es: "Sin Firebase.", en: "No Firebase." },
                { es: "Sin analítica.", en: "No analytics." },
                { es: "Sin telemetría.", en: "No telemetry." },
                { es: "Sin publicidad.", en: "No advertising." },
                {
                  es: "Sin servicio de reporte de fallos en la nube.",
                  en: "No cloud crash-reporting service.",
                },
                {
                  es: "Base de datos Room cifrada con SQLCipher.",
                  en: "Room database encrypted with SQLCipher.",
                },
                { es: "Clave de base de datos aleatoria.", en: "Randomly generated database key." },
                {
                  es: "Clave de base de datos envuelta por una clave no exportable de Android Keystore.",
                  en: "Database key wrapped by a non-exportable Android Keystore key.",
                },
                {
                  es: "Bloqueo de la aplicación con AndroidX Biometric o credencial del dispositivo.",
                  en: "App lock through AndroidX Biometric or device credentials.",
                },
                { es: "allowBackup=false.", en: "allowBackup=false." },
                { es: "FLAG_SECURE en release.", en: "FLAG_SECURE in release builds." },
                {
                  es: "Sin valores financieros ni credenciales escritos en los logs.",
                  en: "No financial values or credentials written to logs.",
                },
                {
                  es: "Adjuntos de comprobantes cifrados.",
                  en: "Encrypted receipt attachments.",
                },
                {
                  es: "Respaldos portables controlados por el usuario.",
                  en: "Portable backups controlled by the user.",
                },
              ],
            },
            {
              type: "flows",
              title: { es: "Cifrado de respaldos", en: "Backup encryption" },
              flows: [
                {
                  label: { es: "Respaldo portable", en: "Portable backup" },
                  nodes: [
                    { es: "Contraseña elegida por el usuario", en: "User-chosen password" },
                    { es: "Derivación de clave Argon2id", en: "Argon2id key derivation" },
                    {
                      es: "Cifrado autenticado AES-256-GCM",
                      en: "AES-256-GCM authenticated encryption",
                    },
                    { es: "Respaldo cifrado portable", en: "Portable encrypted backup" },
                  ],
                },
              ],
              note: {
                es: "La contraseña no puede ser recuperada por la aplicación; perder la contraseña hace inaccesible ese respaldo. El usuario elige el destino con el selector de documentos del sistema Android, y elegir un proveedor respaldado en la nube es una decisión explícita del usuario. Desinstalar la aplicación puede eliminar los datos locales, por lo que conviene crear un respaldo antes de desinstalar o cambiar de dispositivo.",
                en: "The app cannot recover the password; losing it makes that backup unreadable. The user picks the destination with the Android system document picker, and choosing a cloud-backed provider is an explicit user decision. Uninstalling the app may remove local data, so creating a backup before uninstalling or switching devices is recommended.",
              },
            },
            {
              type: "list",
              title: { es: "Continuidad y migraciones", en: "Continuity and migrations" },
              items: [
                {
                  es: "Nombre de la base de datos finanzas.db.",
                  en: "Database named finanzas.db.",
                },
                { es: "Versión de esquema actual 6.", en: "Current schema version 6." },
                {
                  es: "Archivos JSON de esquema Room exportados.",
                  en: "Exported Room schema JSON files.",
                },
                {
                  es: "Migraciones encadenadas no destructivas de las versiones 1 a 6.",
                  en: "Non-destructive chained migrations from version 1 to 6.",
                },
                {
                  es: "Sin fallback destructivo como estrategia de reparación.",
                  en: "No destructive fallback as a repair strategy.",
                },
                {
                  es: "Los datos existentes se preservan durante las actualizaciones.",
                  en: "Existing data is preserved across updates.",
                },
                {
                  es: "Un fallo de migración lleva a un manejo de recuperación en lugar de eliminar datos en silencio.",
                  en: "A migration failure triggers recovery handling instead of silently dropping data.",
                },
                {
                  es: "Restauración entre dispositivos mediante respaldo cifrado.",
                  en: "Cross-device restore through an encrypted backup.",
                },
                {
                  es: "Continuidad de datos documentada y validada por evidencia de fases.",
                  en: "Data continuity documented and validated by phase evidence.",
                },
              ],
            },
            {
              type: "decisions",
              title: { es: "Decisiones técnicas clave", en: "Key technical decisions" },
              items: [
                {
                  title: { es: "Android nativo con Kotlin", en: "Native Android with Kotlin" },
                  reason: {
                    es: "Acceso directo a la seguridad, el almacenamiento, los widgets, las APIs biométricas y el comportamiento del ciclo de vida de Android.",
                    en: "Direct access to Android security, storage, widgets, biometric APIs and lifecycle behavior.",
                  },
                  tradeoff: {
                    es: "La aplicación es específica de Android.",
                    en: "The application is Android-specific.",
                  },
                },
                {
                  title: {
                    es: "Jetpack Compose y Material 3",
                    en: "Jetpack Compose and Material 3",
                  },
                  reason: {
                    es: "UI declarativa, renderizado guiado por estado y componentes reutilizables y responsivos.",
                    en: "Declarative UI, state-driven rendering and reusable, responsive components.",
                  },
                  tradeoff: {
                    es: "Requiere una gestión cuidadosa del estado y pruebas del comportamiento de recomposición.",
                    en: "Requires careful state management and testing of recomposition behavior.",
                  },
                },
                {
                  title: {
                    es: "Clean Architecture + MVVM en un solo módulo Gradle",
                    en: "Clean Architecture + MVVM in a single Gradle module",
                  },
                  reason: {
                    es: "Fuerte separación lógica sin la sobrecarga operativa de muchos módulos de compilación para una aplicación personal.",
                    en: "Strong logical separation without the operational overhead of many build modules for a personal app.",
                  },
                  tradeoff: {
                    es: "La disciplina de paquetes debe mantenerse manualmente.",
                    en: "Package discipline has to be maintained manually.",
                  },
                },
                {
                  title: {
                    es: "Inyección de dependencias manual",
                    en: "Manual dependency injection",
                  },
                  reason: {
                    es: "Construcción explícita a través de AppContainer, sin reflexión en tiempo de ejecución ni dependencia de Hilt, Koin o Dagger.",
                    en: "Explicit construction through AppContainer, with no runtime reflection and no dependency on Hilt, Koin or Dagger.",
                  },
                  tradeoff: {
                    es: "La raíz de composición crece a medida que la aplicación se expande.",
                    en: "The composition root grows as the application expands.",
                  },
                },
                {
                  title: { es: "Room + SQLCipher", en: "Room + SQLCipher" },
                  reason: {
                    es: "Persistencia local estructurada combinada con almacenamiento cifrado.",
                    en: "Structured local persistence combined with encrypted storage.",
                  },
                  tradeoff: {
                    es: "Las migraciones de esquema y la compatibilidad del cifrado requieren pruebas adicionales.",
                    en: "Schema migrations and encryption compatibility require extra testing.",
                  },
                },
                {
                  title: {
                    es: "Enteros en centavos en lugar de punto flotante",
                    en: "Integer cents instead of floating point",
                  },
                  reason: {
                    es: "Evita los errores de precisión de punto flotante binario en los cálculos financieros.",
                    en: "Avoids binary floating-point precision errors in financial calculations.",
                  },
                  tradeoff: {
                    es: "El parseo, el formato y el manejo de desbordamientos deben centralizarse.",
                    en: "Parsing, formatting and overflow handling must be centralized.",
                  },
                },
                {
                  title: {
                    es: "DataStore solo para preferencias no sensibles",
                    en: "DataStore only for non-sensitive preferences",
                  },
                  reason: {
                    es: "Separa las preferencias visuales y de comportamiento de los datos financieros protegidos.",
                    en: "Separates visual and behavioral preferences from protected financial data.",
                  },
                  tradeoff: {
                    es: "Deben coordinarse varios mecanismos de persistencia.",
                    en: "Several persistence mechanisms must be kept in sync.",
                  },
                },
                {
                  title: {
                    es: "WorkManager en lugar de alarmas exactas",
                    en: "WorkManager instead of exact alarms",
                  },
                  reason: {
                    es: "Trabajo diferido confiable sin solicitar permisos de alarma exacta.",
                    en: "Reliable deferred work without requesting exact-alarm permissions.",
                  },
                  tradeoff: {
                    es: "El tiempo de ejecución no está garantizado al minuto exacto.",
                    en: "Execution time is not guaranteed to the exact minute.",
                  },
                },
                {
                  title: {
                    es: "Respaldos manuales y cifrados",
                    en: "Manual, encrypted backups",
                  },
                  reason: {
                    es: "Aporta portabilidad preservando el control del usuario y evitando la subida automática a la nube.",
                    en: "Adds portability while preserving user control and avoiding automatic cloud uploads.",
                  },
                  tradeoff: {
                    es: "El usuario es responsable de recordar su contraseña de respaldo y de crear los respaldos.",
                    en: "The user is responsible for remembering the backup password and for creating backups.",
                  },
                },
                {
                  title: {
                    es: "Asistente local de solo lectura",
                    en: "Read-only local assistant",
                  },
                  reason: {
                    es: "Permite el análisis conversacional sin dar a un componente de IA autoridad para mutar registros financieros.",
                    en: "Enables conversational analysis without giving an AI component authority to mutate financial records.",
                  },
                  tradeoff: {
                    es: "Todos los cambios siguen requiriendo los formularios normales de la aplicación y confirmación explícita.",
                    en: "Every change still goes through the app's regular forms and explicit confirmation.",
                  },
                },
                {
                  title: { es: "Sin integración bancaria", en: "No banking integration" },
                  reason: {
                    es: "Reduce la exposición de privacidad, el riesgo de dependencias y la complejidad del manejo de credenciales.",
                    en: "Reduces privacy exposure, dependency risk and credential-handling complexity.",
                  },
                  tradeoff: {
                    es: "Las transacciones deben registrarse o importarse manualmente.",
                    en: "Transactions must be recorded or imported manually.",
                  },
                },
              ],
            },
            {
              type: "list",
              title: { es: "Calidad y validación", en: "Quality and validation" },
              items: [
                {
                  es: "Los conteos de archivos son archivos, no casos de prueba ejecutados.",
                  en: "File counts are files, not executed test cases.",
                },
                { es: "327 archivos Kotlin de producción.", en: "327 production Kotlin files." },
                { es: "73 archivos de prueba unitarios.", en: "73 unit test files." },
                { es: "40 archivos de prueba instrumentados.", en: "40 instrumented test files." },
                { es: "42 ViewModels.", en: "42 ViewModels." },
                { es: "11 DAO.", en: "11 DAOs." },
                { es: "13 entidades de persistencia.", en: "13 persistence entities." },
                { es: "6 esquemas de Room exportados.", en: "6 exported Room schemas." },
                {
                  es: "Pruebas de migración del esquema 1 al 6 y validación de migraciones encadenadas.",
                  en: "Schema migration tests from version 1 to 6 and chained-migration validation.",
                },
                {
                  es: "Pruebas de integridad financiera, parseo de importes y aritmética monetaria segura.",
                  en: "Tests for financial integrity, amount parsing and safe monetary arithmetic.",
                },
                {
                  es: "Pruebas de compatibilidad de respaldos y de migración de base de datos cifrada.",
                  en: "Backup compatibility and encrypted-database migration tests.",
                },
                { es: "Pruebas de cifrado de adjuntos.", en: "Attachment encryption tests." },
                {
                  es: "Pruebas del asistente: parseo, preguntas de referencia y comportamiento de solo lectura.",
                  en: "Assistant tests: parsing, benchmark questions and read-only behavior.",
                },
                {
                  es: "Validación de privacidad y de permisos.",
                  en: "Privacy and permission validation.",
                },
                {
                  es: "Validación de R8 y reducción de recursos.",
                  en: "R8 and resource-shrinking validation.",
                },
                {
                  es: "Validación de builds debug, staging y release.",
                  en: "Validation of debug, staging and release builds.",
                },
                {
                  es: "Validación de rendimiento en emulador y dispositivos Android físicos.",
                  en: "Performance validation on emulators and physical Android devices.",
                },
                {
                  es: "Evidencia agrupada por fases de implementación.",
                  en: "Evidence grouped by implementation phase.",
                },
              ],
            },
            {
              type: "chips",
              title: {
                es: "Detalle técnico y plataforma",
                en: "Technical and platform detail",
              },
              items: [
                "Kotlin 2.1.20",
                "Jetpack Compose",
                "Material 3",
                "Gradle 8.13 (Kotlin DSL)",
                "Android Gradle Plugin 8.9.1",
                { es: "Bytecode Java/Kotlin 17", en: "Java/Kotlin 17 bytecode" },
                "compileSdk/targetSdk 36",
                "minSdk 26",
                "KSP",
                { es: "Builds: debug, staging, release", en: "Builds: debug, staging, release" },
                { es: "R8 + reducción de recursos", en: "R8 + resource shrinking" },
                "Room",
                "SQLCipher",
                "DataStore",
                "WorkManager",
                "AndroidX Biometric",
                "Android Keystore",
                "Bouncy Castle",
                "Argon2id",
                "AES-256-GCM",
                "Vico",
                "Glance",
              ],
            },
            {
              type: "list",
              title: { es: "Alcance y limitaciones", en: "Scope and limitations" },
              items: [
                {
                  es: "La aplicación no se sincroniza automáticamente entre dispositivos.",
                  en: "The app does not sync automatically between devices.",
                },
                {
                  es: "No se conecta a bancos ni instituciones financieras.",
                  en: "It does not connect to banks or financial institutions.",
                },
                {
                  es: "Las transacciones requieren registro manual o importación CSV.",
                  en: "Transactions require manual entry or CSV import.",
                },
                {
                  es: "La creación de respaldos se inicia manualmente.",
                  en: "Backup creation is started manually.",
                },
                {
                  es: "Una contraseña de respaldo perdida no puede recuperarse.",
                  en: "A lost backup password cannot be recovered.",
                },
                {
                  es: "Desinstalar puede eliminar los datos locales si no existe un respaldo cifrado.",
                  en: "Uninstalling may remove local data if no encrypted backup exists.",
                },
                {
                  es: "El compromiso del dispositivo, malware o acceso root pueden reducir las protecciones locales.",
                  en: "Device compromise, malware or root access can weaken local protections.",
                },
                {
                  es: "El OCR es un mecanismo de asistencia y su resultado debe revisarse.",
                  en: "OCR is an assistance mechanism and its output should be reviewed.",
                },
                {
                  es: "El asistente es de solo lectura y no constituye asesoría financiera profesional.",
                  en: "The assistant is read-only and is not professional financial advice.",
                },
                {
                  es: "La aplicación actualmente está orientada solo a Android.",
                  en: "The application currently targets Android only.",
                },
                {
                  es: "No existe un panel web ni una cuenta remota.",
                  en: "There is no web dashboard and no remote account.",
                },
                {
                  es: "La distribución mediante AWS concierne únicamente al archivo APK, no a los datos financieros del usuario.",
                  en: "AWS distribution covers only the APK file, never the user's financial data.",
                },
              ],
            },
            {
              type: "list",
              title: { es: "Qué demuestra este proyecto", en: "What this project demonstrates" },
              columns: 2,
              items: [
                {
                  es: "Desarrollo de producto nativo de Android.",
                  en: "Native Android product development.",
                },
                { es: "Modelado del dominio financiero.", en: "Financial domain modeling." },
                { es: "Arquitectura offline-first.", en: "Offline-first architecture." },
                { es: "Persistencia local cifrada.", en: "Encrypted local persistence." },
                { es: "Diseño de respaldos seguros.", en: "Secure backup design." },
                { es: "Disciplina de migración de datos.", en: "Data migration discipline." },
                { es: "Clean Architecture y MVVM.", en: "Clean Architecture and MVVM." },
                {
                  es: "Ingeniería consciente de la privacidad.",
                  en: "Privacy-conscious engineering.",
                },
                {
                  es: "Integración de IA local con permisos controlados.",
                  en: "Local AI integration with controlled permissions.",
                },
                { es: "UI construida con Jetpack Compose.", en: "UI built with Jetpack Compose." },
                {
                  es: "Pruebas en dominio, persistencia, seguridad y UI.",
                  en: "Testing across domain, persistence, security and UI.",
                },
                {
                  es: "Evolución de producto: de herramienta personal a aplicación profesional.",
                  en: "Product evolution: from personal tool to professional application.",
                },
              ],
            },
          ],
        },
      },
      {
        name: { es: "agent-automaton", en: "agent-automaton" },
        description: {
          es: "Fifi es un asistente personal local para Windows controlado por voz o texto. Utiliza modelos mediante Ollama, reconocimiento y síntesis de voz, memoria local y herramientas protegidas por una capa central de seguridad. Las acciones sensibles requieren confirmación y las capacidades destructivas permanecen bloqueadas.",
          en: "Fifi is a local personal assistant for Windows driven by voice or text. It runs models through Ollama, adds speech recognition and synthesis, local memory and tools guarded by a central safety layer. Sensitive actions require confirmation and destructive capabilities stay blocked.",
        },
        tags: [
          { name: "Python", color: "blue-text-gradient" },
          { name: "FastAPI", color: "green-text-gradient" },
          { name: "Ollama", color: "pink-text-gradient" },
          { name: "VoiceAI", color: "blue-text-gradient" },
          { name: "Windows", color: "green-text-gradient" },
        ],
        image: iaasisten,
        image_alt: {
          es: "Vista previa de agent-automaton, asistente personal local Fifi para Windows",
          en: "Preview of agent-automaton, the local Fifi personal assistant for Windows",
        },
        image_fit: "contain",
        image_background: "bg-white",
        source_code_link: "https://github.com/lighsiegfried/agent-automaton",
        caseStudy: {
          id: "agent-automaton-local-ai",
          eyebrow: {
            es: "Caso de estudio de IA local y automatización segura",
            en: "Local AI and safe automation case study",
          },
          title: {
            es: "agent-automaton — Fifi, asistente personal local para Windows",
            en: "agent-automaton — Fifi, a local personal assistant for Windows",
          },
          status: {
            es: "Proyecto funcional · ejecución local",
            en: "Working project · local execution",
          },
          role: {
            es: "Arquitectura, backend, voz, IA local, automatización y seguridad",
            en: "Architecture, backend, voice, local AI, automation and safety",
          },
          platform: {
            es: "Windows · Python 3.11+ · GPU NVIDIA",
            en: "Windows · Python 3.11+ · NVIDIA GPU",
          },
          hardware: {
            es: "Runtime GPU-first · referencia RTX 5060 Ti 16 GB VRAM",
            en: "GPU-first runtime · RTX 5060 Ti 16 GB VRAM reference",
          },
          badges: [
            "Local-first",
            "Voice + Text",
            "Safety by construction",
            "GPU-first",
            "Windows host",
          ],
          summary: {
            es: "agent-automaton es una plataforma de asistente personal local para Windows, presentada mediante la persona de Fifi. Recibe instrucciones por texto o voz, las interpreta mediante reglas deterministas o un modelo local ejecutado con Ollama y las convierte en acciones controladas mediante un registro de herramientas. Cada solicitud atraviesa una capa central de seguridad, las acciones sensibles requieren confirmación y las destructivas permanecen bloqueadas. El sistema funciona sin depender de APIs de inteligencia artificial en la nube.",
            en: "agent-automaton is a local personal-assistant platform for Windows, presented through the Fifi persona. It takes instructions by text or voice, interprets them with deterministic rules or a local model running on Ollama, and turns them into controlled actions through a tool registry. Every request crosses a central safety layer, sensitive actions require confirmation and destructive ones stay blocked. The system runs without depending on cloud AI APIs.",
          },
          metrics: [
            { value: "1165", label: { es: "pruebas aprobadas", en: "passing tests" } },
            { value: "3", label: { es: "niveles de seguridad", en: "safety levels" } },
            { value: "3", label: { es: "acciones reales controladas", en: "controlled real actions" } },
            { value: "2", label: { es: "rutas de planificación", en: "planning paths" } },
          ],
          links: {
            github: "https://github.com/lighsiegfried/agent-automaton",
            note: {
              es: "Proyecto local para Windows · sin demo web pública",
              en: "Local Windows project · no public web demo",
            },
          },
          sections: [
            {
              type: "prose",
              title: { es: "¿Por qué se creó?", en: "Why it was built" },
              body: [
                {
                  es: "El proyecto nació con el objetivo de construir un asistente personal que pudiera entender instrucciones naturales, responder por voz y realizar tareas útiles en Windows sin enviar comandos, audio o contexto operativo a proveedores de inteligencia artificial externos. El reto no era solamente ejecutar un modelo local, sino diseñar una arquitectura donde el modelo nunca recibiera autoridad directa sobre el sistema operativo.",
                  en: "The project set out to build a personal assistant that could understand natural instructions, answer by voice and perform useful tasks on Windows without sending commands, audio or operational context to external AI providers. The challenge was not merely running a local model, but designing an architecture where the model never receives direct authority over the operating system.",
                },
                {
                  es: "Conforme el proyecto evolucionó, la idea inicial se convirtió en una plataforma modular que integra voz, modelos locales, herramientas de escritorio, memoria, administración de procesos y controles de seguridad. La prioridad fue mantener una separación clara entre interpretar una intención y autorizar una acción.",
                  en: "As the project evolved, the initial idea became a modular platform that combines voice, local models, desktop tools, memory, process management and safety controls. The priority was to keep a clear separation between interpreting an intent and authorizing an action.",
                },
              ],
            },
            {
              type: "prose",
              title: { es: "Problema que resuelve", en: "The problem it solves" },
              body: [
                {
                  es: "Los asistentes convencionales suelen depender de servicios en la nube y ofrecen poca transparencia sobre cómo una interpretación del modelo termina convertida en una acción real. Cuando se incorpora automatización del escritorio, un error de interpretación, una instrucción ambigua o un plan inventado por el modelo puede afectar aplicaciones, archivos o configuraciones del usuario.",
                  en: "Conventional assistants usually depend on cloud services and offer little transparency about how a model's interpretation turns into a real action. Once desktop automation enters the picture, a misreading, an ambiguous instruction or a plan hallucinated by the model can affect the user's applications, files or settings.",
                },
                {
                  es: "agent-automaton aborda este problema mediante una arquitectura local-first en la que la inteligencia artificial solamente propone o redacta resultados. La autorización y ejecución permanecen bajo reglas deterministas, validaciones de entrada, niveles de seguridad, listas permitidas y confirmaciones de un solo uso.",
                  en: "agent-automaton addresses this with a local-first architecture in which the AI only proposes or phrases results. Authorization and execution stay under deterministic rules, input validation, safety levels, allowlists and single-use confirmations.",
                },
              ],
            },
            {
              type: "list",
              title: { es: "Objetivo del sistema", en: "System goals" },
              items: [
                {
                  es: "Permitir interacción con Windows mediante texto y voz.",
                  en: "Enable interaction with Windows through text and voice.",
                },
                {
                  es: "Ejecutar inferencia local sin depender de APIs de IA en la nube.",
                  en: "Run inference locally without depending on cloud AI APIs.",
                },
                {
                  es: "Convertir lenguaje natural en planes estructurados y verificables.",
                  en: "Turn natural language into structured, verifiable plans.",
                },
                {
                  es: "Mantener la autorización fuera del modelo.",
                  en: "Keep authorization outside the model.",
                },
                {
                  es: "Probar nuevas herramientas primero mediante simulación.",
                  en: "Exercise new tools in simulation first.",
                },
                {
                  es: "Permitir acciones reales únicamente cuando tienen validación y alcance definido.",
                  en: "Allow real actions only when they have validation and a defined scope.",
                },
                {
                  es: "Conservar historial y estado local sin convertir el proyecto en un servicio SaaS.",
                  en: "Keep history and state local without turning the project into a SaaS service.",
                },
                {
                  es: "Administrar de forma explícita GPU, modelos y servicios pesados.",
                  en: "Explicitly manage GPU, models and heavy services.",
                },
              ],
            },
            {
              type: "flows",
              title: { es: "Arquitectura principal", en: "Core architecture" },
              badge: {
                es: "El LLM no ejecuta herramientas",
                en: "The LLM never executes tools",
              },
              flows: [
                {
                  label: {
                    es: "De la instrucción a la respuesta",
                    en: "From instruction to answer",
                  },
                  nodes: [
                    {
                      es: "Comando de texto o transcripción de voz",
                      en: "Text command or voice transcript",
                    },
                    { es: "Endpoint de comando FastAPI", en: "FastAPI command endpoint" },
                    {
                      es: "Router determinista o planificador LLM local",
                      en: "Deterministic router or local LLM planner",
                    },
                    { es: "Validación estricta del plan", en: "Strict plan validation" },
                    { es: "Capa central de seguridad", en: "Central safety layer" },
                    { es: "Registro de herramientas", en: "Tool registry" },
                    {
                      es: "Ejecución simulada o real controlada",
                      en: "Simulated or controlled real execution",
                    },
                    { es: "Historial SQLite y memoria local", en: "SQLite history and local memory" },
                    { es: "Respuesta escrita o hablada", en: "Written or spoken answer" },
                  ],
                },
              ],
              note: {
                es: "Fases: interpretación → autorización → ejecución → persistencia → respuesta. El plan del modelo nunca invoca una herramienta directamente; siempre atraviesa la validación y la misma capa de seguridad.",
                en: "Phases: interpretation → authorization → execution → persistence → response. The model's plan never invokes a tool directly; it always goes through validation and the same safety layer.",
              },
            },
            {
              type: "callout",
              title: {
                es: "El modelo propone; el sistema decide",
                en: "The model proposes; the system decides",
              },
              body: [
                {
                  es: "Ollama puede interpretar una instrucción y proponer un plan estructurado, pero nunca ejecuta una herramienta directamente. El plan se trata como entrada no confiable: debe utilizar una herramienta conocida, coincidir con la intención declarada, incluir únicamente argumentos permitidos y superar el umbral de confianza. Después de ser validado, todavía debe atravesar la misma capa de seguridad utilizada por el router determinista.",
                  en: "Ollama can interpret an instruction and propose a structured plan, but it never executes a tool directly. The plan is treated as untrusted input: it must use a known tool, match the declared intent, carry only allowed arguments and clear the confidence threshold. Once validated, it still has to cross the same safety layer used by the deterministic router.",
                },
                {
                  es: "El planificador puede aumentar el nivel de precaución, pero nunca reducirlo.",
                  en: "The planner can raise the caution level, but never lower it.",
                },
              ],
            },
            {
              type: "cards",
              title: {
                es: "Windows ejecuta; Docker proporciona cómputo",
                en: "Windows executes; Docker provides compute",
              },
              columns: 2,
              items: [
                {
                  title: { es: "Windows host", en: "Windows host" },
                  items: [
                    { es: "Proceso host FastAPI / Uvicorn", en: "FastAPI / Uvicorn host process" },
                    {
                      es: "Herramientas de escritorio y de sistema operativo",
                      en: "Desktop and operating-system tools",
                    },
                    { es: "Cliente push-to-talk", en: "Push-to-talk client" },
                    {
                      es: "Cliente de bandeja o escritorio cuando está verificado",
                      en: "Tray or desktop client when verified",
                    },
                    {
                      es: "Sesión interactiva del usuario de Windows",
                      en: "Interactive Windows user session",
                    },
                  ],
                },
                {
                  title: { es: "Docker Desktop / WSL2", en: "Docker Desktop / WSL2" },
                  items: [
                    "Ollama",
                    {
                      es: "Workers opcionales de modelos de voz",
                      en: "Optional voice-model workers",
                    },
                    {
                      es: "Servicios de soporte solo simulados",
                      en: "Simulation-only support services",
                    },
                  ],
                },
              ],
            },
            {
              type: "prose",
              title: {
                es: "Por qué el host ejecuta y los contenedores solo apoyan",
                en: "Why the host executes and containers only assist",
              },
              body: {
                es: "Las acciones de escritorio se ejecutan directamente en el host de Windows porque necesitan acceso a la sesión interactiva, aplicaciones instaladas, asociaciones de archivos, navegador predeterminado y administración de ventanas. Los contenedores se utilizan únicamente para servicios de soporte. El código exige tanto la activación explícita de herramientas reales como la plataforma `win32`, por lo que un contenedor Linux no puede obtener autoridad sobre el escritorio aunque exista una configuración incorrecta.",
                en: "Desktop actions run directly on the Windows host because they need the interactive session, installed applications, file associations, the default browser and window management. Containers are used only for support services. The code requires both an explicit real-tool opt-in and the `win32` platform, so a Linux container cannot gain desktop authority even under a misconfiguration.",
              },
            },
            {
              type: "callout",
              body: {
                es: "El host actúa; los servicios de soporte solamente piensan.",
                en: "The host acts; the support services only think.",
              },
            },
            {
              type: "cards",
              title: { es: "Componentes principales", en: "Core components" },
              columns: 2,
              items: [
                {
                  title: "FastAPI",
                  desc: {
                    es: "Expone salud, identidad, comandos, herramientas, historial y endpoints de voz.",
                    en: "Exposes health, identity, commands, tools, history and voice endpoints.",
                  },
                },
                {
                  title: { es: "Router de reglas", en: "Rule-based router" },
                  desc: {
                    es: "Interpreta comandos en español e inglés mediante reglas deterministas y funciona sin depender del modelo.",
                    en: "Interprets Spanish and English commands with deterministic rules and works without the model.",
                  },
                },
                {
                  title: { es: "Planificador LLM", en: "LLM planner" },
                  desc: {
                    es: "Solicita a Ollama un plan JSON estructurado y lo somete a validación estricta antes de permitir que continúe.",
                    en: "Asks Ollama for a structured JSON plan and puts it through strict validation before letting it proceed.",
                  },
                },
                {
                  title: { es: "Capa de seguridad", en: "Safety layer" },
                  desc: {
                    es: "Es el punto central de autorización para cada acción y decide si se permite, requiere confirmación o se bloquea.",
                    en: "The central authorization point for every action, deciding whether it is allowed, needs confirmation or is blocked.",
                  },
                },
                {
                  title: { es: "Registro de herramientas", en: "Tool registry" },
                  desc: {
                    es: "Mantiene el catálogo declarativo de capacidades, sus argumentos y su nivel de seguridad.",
                    en: "Holds the declarative catalog of capabilities, their arguments and their safety level.",
                  },
                },
                {
                  title: { es: "Memoria e historial", en: "Memory and history" },
                  desc: {
                    es: "Registra localmente comandos, decisiones, resultados y estados necesarios mediante SQLite.",
                    en: "Records commands, decisions, results and required state locally through SQLite.",
                  },
                },
                {
                  title: { es: "Reconocimiento de voz", en: "Speech recognition" },
                  desc: {
                    es: "Transcribe audio localmente mediante faster-whisper con soporte para español e inglés.",
                    en: "Transcribes audio locally with faster-whisper, supporting Spanish and English.",
                  },
                },
                {
                  title: { es: "Síntesis de voz", en: "Speech synthesis" },
                  desc: {
                    es: "Convierte la respuesta final en audio mediante motores locales o Windows SAPI.",
                    en: "Turns the final answer into audio through local engines or Windows SAPI.",
                  },
                },
                {
                  title: { es: "Administrador de runtime", en: "Runtime manager" },
                  desc: {
                    es: "Administra Ollama, la API del host, modelos, procesos, salud, PID y logs sin modificar permisos de herramientas.",
                    en: "Manages Ollama, the host API, models, processes, health, PIDs and logs without changing tool permissions.",
                  },
                },
                {
                  title: { es: "Cliente push-to-talk", en: "Push-to-talk client" },
                  desc: {
                    es: "Graba únicamente mientras el usuario mantiene presionada la combinación configurada y envía el audio por el mismo pipeline seguro.",
                    en: "Records only while the user holds the configured shortcut and sends the audio through the same guarded pipeline.",
                  },
                },
              ],
            },
            {
              type: "list",
              title: { es: "Flujo de un comando", en: "Command lifecycle" },
              items: [
                {
                  es: "1. El usuario envía texto o una transcripción de voz.",
                  en: "1. The user sends text or a voice transcript.",
                },
                {
                  es: "2. Pydantic valida la estructura de la solicitud.",
                  en: "2. Pydantic validates the request structure.",
                },
                {
                  es: "3. El router determinista o el planificador LLM produce intención, herramienta y argumentos.",
                  en: "3. The deterministic router or the LLM planner produces intent, tool and arguments.",
                },
                {
                  es: "4. Cuando interviene el LLM, su salida se valida contra un esquema estricto.",
                  en: "4. When the LLM is involved, its output is validated against a strict schema.",
                },
                {
                  es: "5. La capa de seguridad consulta el nivel declarado de la herramienta.",
                  en: "5. The safety layer checks the tool's declared level.",
                },
                { es: "6. Una acción segura continúa.", en: "6. A safe action proceeds." },
                {
                  es: "7. Una acción sensible solicita confirmación para esa solicitud.",
                  en: "7. A sensitive action asks for confirmation for that request.",
                },
                {
                  es: "8. Una acción destructiva se bloquea.",
                  en: "8. A destructive action is blocked.",
                },
                {
                  es: "9. La herramienta ejecuta una simulación o una acción real controlada.",
                  en: "9. The tool runs a simulation or a controlled real action.",
                },
                {
                  es: "10. El resultado se almacena en el historial SQLite.",
                  en: "10. The result is stored in the SQLite history.",
                },
                {
                  es: "11. El generador produce una respuesta escrita.",
                  en: "11. The generator produces a written answer.",
                },
                {
                  es: "12. Cuando está habilitado, la respuesta final se reproduce por voz.",
                  en: "12. When enabled, the final answer is spoken aloud.",
                },
              ],
            },
            {
              type: "cards",
              title: { es: "Planificación híbrida", en: "Hybrid planning" },
              columns: 2,
              items: [
                {
                  title: { es: "Router determinista", en: "Deterministic router" },
                  items: [
                    { es: "Reglas bilingües.", en: "Bilingual rules." },
                    { es: "Respuesta inmediata.", en: "Immediate response." },
                    { es: "Comportamiento predecible.", en: "Predictable behavior." },
                    { es: "No necesita Ollama.", en: "No Ollama required." },
                    { es: "Ruta de fallback.", en: "Fallback path." },
                    { es: "Ideal para comandos conocidos.", en: "Ideal for known commands." },
                  ],
                },
                {
                  title: { es: "Planificador LLM local", en: "Local LLM planner" },
                  items: [
                    {
                      es: "Comprende variaciones naturales.",
                      en: "Understands natural phrasing variations.",
                    },
                    {
                      es: "Devuelve un `CommandPlan` estructurado.",
                      en: "Returns a structured `CommandPlan`.",
                    },
                    { es: "Confianza mínima verificable.", en: "Verifiable minimum confidence." },
                    { es: "Argumentos restringidos.", en: "Restricted arguments." },
                    { es: "Herramientas inventadas rechazadas.", en: "Hallucinated tools rejected." },
                    { es: "Planes destructivos rechazados.", en: "Destructive plans rejected." },
                    { es: "Fallback automático ante error.", en: "Automatic fallback on error." },
                  ],
                },
              ],
            },
            {
              type: "callout",
              body: {
                es: "Ambos planificadores alimentan exactamente la misma capa de seguridad y el mismo registro de herramientas.",
                en: "Both planners feed exactly the same safety layer and the same tool registry.",
              },
            },
            {
              type: "cards",
              title: { es: "Seguridad por construcción", en: "Safety by construction" },
              badge: { es: "3 niveles", en: "3 levels" },
              columns: 3,
              items: [
                {
                  title: { es: "Seguro", en: "Safe" },
                  desc: {
                    es: "Acciones sin efecto persistente significativo. Pueden ejecutarse o simularse inmediatamente después de validar sus argumentos.",
                    en: "Actions with no meaningful persistent effect. They can run or be simulated immediately after their arguments are validated.",
                  },
                  items: [
                    { es: "Hablar", en: "Speaking" },
                    { es: "Búsqueda web", en: "Web search" },
                    { es: "Apertura validada de carpetas", en: "Validated folder opening" },
                  ],
                },
                {
                  title: { es: "Sensible", en: "Sensitive" },
                  desc: {
                    es: "Acciones que interactúan con aplicaciones o pueden resultar intrusivas. Requieren una confirmación explícita para una sola solicitud.",
                    en: "Actions that interact with applications or may be intrusive. They require explicit confirmation for a single request.",
                  },
                  items: [
                    { es: "Abrir una aplicación permitida", en: "Opening an allowlisted application" },
                    {
                      es: "Futuras acciones de entrada controlada",
                      en: "Future controlled input actions",
                    },
                  ],
                },
                {
                  title: { es: "Destructivo", en: "Destructive" },
                  desc: {
                    es: "Acciones que pueden provocar pérdida de datos o modificar significativamente el sistema. Permanecen bloqueadas de forma incondicional.",
                    en: "Actions that could cause data loss or significantly alter the system. They stay unconditionally blocked.",
                  },
                  items: [
                    { es: "Eliminar archivos", en: "Deleting files" },
                    { es: "Apagar el equipo", en: "Shutting the machine down" },
                    { es: "Comandos arbitrarios de shell", en: "Arbitrary shell commands" },
                  ],
                },
              ],
            },
            {
              type: "list",
              title: { es: "Invariantes de seguridad", en: "Safety invariants" },
              columns: 2,
              items: [
                {
                  es: "Cada capacidad debe registrarse como una herramienta.",
                  en: "Every capability must be registered as a tool.",
                },
                {
                  es: "Cada herramienta declara su nivel de seguridad junto a su implementación.",
                  en: "Every tool declares its safety level next to its implementation.",
                },
                {
                  es: "El router nunca llama directamente a funciones del sistema operativo.",
                  en: "The router never calls operating-system functions directly.",
                },
                {
                  es: "Todos los comandos pasan por la misma capa de seguridad.",
                  en: "All commands go through the same safety layer.",
                },
                {
                  es: "Las herramientas nuevas comienzan en modo simulado.",
                  en: "New tools start in simulation mode.",
                },
                {
                  es: "La validación se ejecuta tanto en simulación como en modo real.",
                  en: "Validation runs in both simulation and real mode.",
                },
                {
                  es: "Una confirmación aprueba un solo comando.",
                  en: "One confirmation approves exactly one command.",
                },
                {
                  es: "No existe un estado permanente de «permitir siempre».",
                  en: "There is no permanent \"always allow\" state.",
                },
                {
                  es: "Las operaciones destructivas no pueden habilitarse mediante configuración.",
                  en: "Destructive operations cannot be enabled through configuration.",
                },
                {
                  es: "El texto del usuario nunca se interpola en comandos de shell.",
                  en: "User text is never interpolated into shell commands.",
                },
                {
                  es: "Las aplicaciones se lanzan desde listas permitidas definidas en el código.",
                  en: "Applications are launched from allowlists defined in code.",
                },
                {
                  es: "Las rutas se normalizan y validan.",
                  en: "Paths are normalized and validated.",
                },
                {
                  es: "La salida del modelo nunca evita la autorización.",
                  en: "Model output never bypasses authorization.",
                },
                {
                  es: "La persona y el nombre del asistente nunca alteran los permisos.",
                  en: "The assistant's persona and name never alter permissions.",
                },
                {
                  es: "La ejecución en GPU o CPU nunca altera los permisos.",
                  en: "Running on GPU or CPU never alters permissions.",
                },
                {
                  es: "Iniciar el runtime nunca altera los permisos.",
                  en: "Starting the runtime never alters permissions.",
                },
              ],
            },
            {
              type: "cards",
              title: {
                es: "Acciones reales actualmente controladas",
                en: "Real actions currently allowed",
              },
              badge: { es: "3 acciones", en: "3 actions" },
              columns: 3,
              items: [
                {
                  title: { es: "Abrir una carpeta", en: "Open a folder" },
                  items: [
                    { es: "La ruta debe existir.", en: "The path must exist." },
                    { es: "Debe ser un directorio.", en: "It must be a directory." },
                    {
                      es: "Se rechazan directorios del sistema y protegidos.",
                      en: "System and protected directories are rejected.",
                    },
                    {
                      es: "Las carpetas conocidas se normalizan de forma determinista.",
                      en: "Known folders are normalized deterministically.",
                    },
                    {
                      es: "El texto arbitrario no se interpreta como ruta relativa.",
                      en: "Arbitrary text is not treated as a relative path.",
                    },
                  ],
                },
                {
                  title: { es: "Abrir una aplicación", en: "Open an application" },
                  items: [
                    {
                      es: "Solo aplicaciones en lista permitida.",
                      en: "Allowlisted applications only.",
                    },
                    {
                      es: "Los alias resuelven a nombres canónicos.",
                      en: "Aliases resolve to canonical names.",
                    },
                    {
                      es: "Los objetivos provienen de un mapa definido en el código.",
                      en: "Targets come from a map defined in code.",
                    },
                    {
                      es: "La confirmación explícita sigue siendo obligatoria.",
                      en: "Explicit confirmation remains mandatory.",
                    },
                  ],
                },
                {
                  title: { es: "Buscar en la web", en: "Search the web" },
                  items: [
                    { es: "Abre el navegador predeterminado.", en: "Opens the default browser." },
                    { es: "La consulta se codifica en la URL.", en: "The query is URL-encoded." },
                    {
                      es: "Sin ejecución arbitraria de shell.",
                      en: "No arbitrary shell execution.",
                    },
                  ],
                },
              ],
            },
            {
              type: "callout",
              body: {
                es: "Escribir texto, escrituras de archivos, eliminación, apagado, acceso arbitrario a shell, acceso al portapapeles y mensajería sin restricciones no están habilitados por este flag.",
                en: "Typing text, file writes, deletion, shutdown, arbitrary shell access, clipboard access and unrestricted messaging are not enabled by this flag.",
              },
            },
            {
              type: "prose",
              title: { es: "Simular antes de ejecutar", en: "Simulate before executing" },
              body: {
                es: "Una herramienta nueva no obtiene acceso real al sistema en su primera versión. Primero devuelve una descripción `would_do` que explica lo que intentaría realizar. Las mismas validaciones de argumentos se ejecutan tanto en simulación como en modo real, por lo que una simulación no oculta entradas que serían rechazadas posteriormente.",
                en: "A new tool does not get real system access in its first version. It first returns a `would_do` description explaining what it would attempt. The same argument validation runs in both simulation and real mode, so a simulation never hides input that would later be rejected.",
              },
            },
            {
              type: "flows",
              title: {
                es: "De herramienta nueva a implementación real",
                en: "From new tool to real implementation",
              },
              flows: [
                {
                  label: { es: "Ciclo de vida de una herramienta", en: "Tool lifecycle" },
                  nodes: [
                    { es: "Herramienta nueva", en: "New tool" },
                    { es: "Nivel de seguridad declarado", en: "Declared safety level" },
                    { es: "Comportamiento simulado", en: "Simulated behavior" },
                    { es: "Pruebas de rutas de rechazo", en: "Rejection-path tests" },
                    { es: "Listas permitidas y validación", en: "Allowlists and validation" },
                    { es: "Implementación real revisada", en: "Reviewed real implementation" },
                  ],
                },
              ],
            },
            {
              type: "flows",
              title: {
                es: "Voz local sin ruta privilegiada",
                en: "Local voice with no privileged path",
              },
              flows: [
                {
                  label: { es: "Pipeline de voz", en: "Voice pipeline" },
                  nodes: [
                    { es: "Micrófono o WAV", en: "Microphone or WAV" },
                    "faster-whisper",
                    { es: "Transcripción", en: "Transcript" },
                    "handle_command()",
                    { es: "Router o planificador", en: "Router or planner" },
                    { es: "Capa de seguridad", en: "Safety layer" },
                    { es: "Herramienta", en: "Tool" },
                    { es: "Historial", en: "History" },
                    { es: "Respuesta", en: "Response" },
                    { es: "TTS local opcional", en: "Optional local TTS" },
                  ],
                },
              ],
              note: {
                es: "La voz se sitúa por encima del pipeline de comandos. Una vez transcrita, la instrucción se procesa exactamente igual que un comando escrito. No existe una ruta de ejecución especial para audio y la voz nunca evita las reglas de seguridad.",
                en: "Voice sits on top of the command pipeline. Once transcribed, the instruction is processed exactly like a typed command. There is no special execution path for audio and voice never bypasses the safety rules.",
              },
            },
            {
              type: "list",
              title: {
                es: "Push-to-talk y confirmaciones habladas",
                en: "Push-to-talk and spoken confirmations",
              },
              columns: 2,
              items: [
                {
                  es: "Referencia de atajo por defecto: Ctrl + Alt + Space.",
                  en: "Default shortcut reference: Ctrl + Alt + Space.",
                },
                {
                  es: "La grabación comienza solo mientras se mantiene presionado el atajo completo.",
                  en: "Recording starts only while the full shortcut is held down.",
                },
                {
                  es: "Soltar cualquier tecla finaliza la grabación.",
                  en: "Releasing any key ends the recording.",
                },
                {
                  es: "Escape cancela la grabación actual.",
                  en: "Escape cancels the current recording.",
                },
                { es: "El audio usa WAV mono de 16 kHz.", en: "Audio uses 16 kHz mono WAV." },
                { es: "Los clips muy cortos se ignoran.", en: "Very short clips are ignored." },
                {
                  es: "La duración de grabación tiene un límite estricto.",
                  en: "Recording duration is hard-capped.",
                },
                {
                  es: "Se evitan grabaciones concurrentes.",
                  en: "Concurrent recordings are prevented.",
                },
                {
                  es: "Los WAV temporales se eliminan tras procesarse.",
                  en: "Temporary WAV files are deleted after processing.",
                },
                {
                  es: "El cliente push-to-talk no tiene autoridad para habilitar herramientas.",
                  en: "The push-to-talk client has no authority to enable tools.",
                },
                {
                  es: "Envía el audio a través de `/voice/command`.",
                  en: "It sends audio through `/voice/command`.",
                },
                {
                  es: "Las confirmaciones sensibles se mantienen solo en memoria.",
                  en: "Sensitive confirmations are kept in memory only.",
                },
                {
                  es: "Solo puede existir un comando pendiente.",
                  en: "Only one pending command can exist.",
                },
                {
                  es: "Las frases de confirmación usan coincidencia exacta.",
                  en: "Confirmation phrases use exact matching.",
                },
                {
                  es: "Un comando distinto cancela la confirmación pendiente.",
                  en: "A different command cancels the pending confirmation.",
                },
                {
                  es: "Un tiempo de espera cancela la confirmación pendiente.",
                  en: "A timeout cancels the pending confirmation.",
                },
                {
                  es: "Un reinicio cancela la confirmación pendiente.",
                  en: "A restart cancels the pending confirmation.",
                },
                {
                  es: "La aprobación reenvía el comando original exacto.",
                  en: "Approval resubmits the exact original command.",
                },
                {
                  es: "La capa de seguridad lo evalúa de nuevo.",
                  en: "The safety layer evaluates it again.",
                },
              ],
            },
            {
              type: "callout",
              body: {
                es: "Una confirmación hablada aprueba una solicitud concreta; nunca crea un permiso permanente.",
                en: "A spoken confirmation approves one specific request; it never creates a permanent permission.",
              },
            },
            {
              type: "prose",
              title: { es: "Activación por voz continua", en: "Always-on voice activation" },
              badge: { es: "En evolución", en: "Evolving" },
              body: {
                es: "El proyecto incorpora configuración y espacios de experimentación para una palabra de activación, pero la experiencia pública documentada utiliza grabación explícita o push-to-talk. No se presenta como un micrófono siempre activo.",
                en: "The project includes configuration and room to experiment with a wake word, but the documented public experience uses explicit recording or push-to-talk. It is not presented as an always-on microphone.",
              },
            },
            {
              type: "prose",
              title: { es: "La respuesta describe; no decide", en: "The answer describes; it does not decide" },
              body: {
                es: "La respuesta de Fifi se genera después de que el router, la capa de seguridad y la herramienta ya determinaron el resultado. Puede redactarse mediante plantillas deterministas o mediante un modelo local, pero solamente describe una decisión final. No puede ejecutar, confirmar, reintentar ni modificar una acción.",
                en: "Fifi's answer is generated after the router, the safety layer and the tool have already determined the outcome. It may be phrased by deterministic templates or by a local model, but it only describes a final decision. It cannot execute, confirm, retry or modify an action.",
              },
            },
            {
              type: "list",
              title: {
                es: "Garantías de la generación de respuesta",
                en: "Response generation guarantees",
              },
              items: [
                {
                  es: "Las acciones bloqueadas producen un rechazo.",
                  en: "Blocked actions produce a refusal.",
                },
                {
                  es: "Las acciones sensibles sin confirmar solicitan confirmación.",
                  en: "Unconfirmed sensitive actions ask for confirmation.",
                },
                {
                  es: "Las respuestas generadas tienen un fallback.",
                  en: "Generated answers always have a fallback.",
                },
                {
                  es: "La cadena de razonamiento no se solicita ni se expone.",
                  en: "The reasoning chain is neither requested nor exposed.",
                },
                {
                  es: "Solo puede aparecer un resumen corto del razonamiento.",
                  en: "Only a short reasoning summary may appear.",
                },
                {
                  es: "El idioma sigue al del comando del usuario.",
                  en: "The language follows the user's command.",
                },
              ],
            },
            {
              type: "flows",
              title: { es: "Runtime local administrado", en: "Managed local runtime" },
              flows: [
                {
                  label: "scripts/local_runtime.py start",
                  nodes: [
                    { es: "Inicia el servicio Ollama en Docker", en: "Starts the Ollama service in Docker" },
                    {
                      es: "Verifica la disponibilidad de Docker",
                      en: "Checks that Docker is available",
                    },
                    { es: "Verifica la visibilidad de la GPU", en: "Checks GPU visibility" },
                    {
                      es: "Verifica o descarga el modelo configurado",
                      en: "Verifies or pulls the configured model",
                    },
                    {
                      es: "Inicia FastAPI en el host de Windows",
                      en: "Starts FastAPI on the Windows host",
                    },
                    { es: "Registra el PID propio", en: "Records its own PID" },
                    { es: "Escribe logs locales", en: "Writes local logs" },
                    { es: "Comprueba /health e /identity", en: "Probes /health and /identity" },
                  ],
                },
              ],
            },
            {
              type: "list",
              title: {
                es: "Operaciones de ciclo de vida y garantías del runtime",
                en: "Lifecycle operations and runtime guarantees",
              },
              columns: 2,
              items: [
                {
                  es: "Operaciones: start, stop, restart, status y smoke.",
                  en: "Operations: start, stop, restart, status and smoke.",
                },
                {
                  es: "full-start y full-stop solo cuando están verificados.",
                  en: "full-start and full-stop only when verified.",
                },
                {
                  es: "Estado del modelo; ciclo de vida de voz solo cuando está verificado.",
                  en: "Model status; voice lifecycle only when verified.",
                },
                {
                  es: "Bandeja, escritorio y autoarranque solo cuando están verificados.",
                  en: "Tray, desktop and autostart only when verified.",
                },
                {
                  es: "Detener la API no elimina los modelos.",
                  en: "Stopping the API does not remove the models.",
                },
                { es: "Ollama puede permanecer persistente.", en: "Ollama can stay persistent." },
                {
                  es: "Los volúmenes de Docker no se eliminan.",
                  en: "Docker volumes are not deleted.",
                },
                {
                  es: "El runtime no modifica los permisos de las herramientas.",
                  en: "The runtime does not modify tool permissions.",
                },
                {
                  es: "Nunca habilita acciones reales por sí mismo.",
                  en: "It never enables real actions on its own.",
                },
                {
                  es: "No toma posesión de procesos ajenos.",
                  en: "It never takes ownership of foreign processes.",
                },
              ],
            },
            {
              type: "list",
              title: { es: "Administración consciente de GPU", en: "GPU-aware management" },
              columns: 2,
              items: [
                {
                  es: "Ollama requiere una GPU NVIDIA por defecto.",
                  en: "Ollama requires an NVIDIA GPU by default.",
                },
                {
                  es: "La inferencia por CPU requiere activación explícita.",
                  en: "CPU inference requires an explicit opt-in.",
                },
                {
                  es: "La visibilidad de la GPU se verifica dentro del contenedor.",
                  en: "GPU visibility is verified inside the container.",
                },
                {
                  es: "El runtime reporta la GPU detectada.",
                  en: "The runtime reports the detected GPU.",
                },
                {
                  es: "El runtime verifica que el modelo configurado esté disponible.",
                  en: "The runtime verifies that the configured model is available.",
                },
                {
                  es: "La aceleración por GPU afecta el rendimiento, no la autorización.",
                  en: "GPU acceleration affects performance, not authorization.",
                },
                {
                  es: "Se distingue la VRAM dedicada de la memoria de GPU compartida de Windows.",
                  en: "Dedicated VRAM is distinguished from Windows shared GPU memory.",
                },
                {
                  es: "El STT en RTX 50 / Blackwell usa una configuración de cómputo segura.",
                  en: "STT on RTX 50 / Blackwell uses a safe compute configuration.",
                },
                {
                  es: "Se evita INT8 donde la ruta de hardware no lo soporta.",
                  en: "INT8 is avoided where the hardware path does not support it.",
                },
                {
                  es: "Un fallo de CUDA devuelve un error estructurado.",
                  en: "A CUDA failure returns a structured error.",
                },
                {
                  es: "Los endpoints de salud e identidad siguen disponibles tras un fallo de STT.",
                  en: "Health and identity endpoints stay available after an STT failure.",
                },
                {
                  es: "El STT usa ejecución acotada de workers y bloqueo de GPU.",
                  en: "STT uses bounded worker execution and GPU locking.",
                },
              ],
            },
            {
              type: "callout",
              title: {
                es: "Configuración de referencia y objetivo de validación",
                en: "Reference configuration and validation target",
              },
              body: {
                es: "Ryzen 7 2700X · 16 GB de RAM del sistema · RTX 5060 Ti · 16 GB de VRAM dedicada. La RTX 5060 Ti es la referencia de validación, no la única GPU compatible.",
                en: "Ryzen 7 2700X · 16 GB system RAM · RTX 5060 Ti · 16 GB dedicated VRAM. The RTX 5060 Ti is the validation reference, not the only supported GPU.",
              },
            },
            {
              type: "list",
              title: {
                es: "Presupuesto de memoria local (Docker y WSL2)",
                en: "Local memory budget (Docker and WSL2)",
              },
              columns: 2,
              items: [
                {
                  es: "Los contenedores de Docker Desktop comparten una única máquina virtual WSL2.",
                  en: "Docker Desktop containers share a single WSL2 virtual machine.",
                },
                {
                  es: "Ollama y los workers de voz neuronal consumen el mismo pool de RAM de WSL2.",
                  en: "Ollama and the neural voice workers draw on the same WSL2 RAM pool.",
                },
                {
                  es: "La RAM del host no equivale a la RAM visible para Docker.",
                  en: "Host RAM is not the same as the RAM visible to Docker.",
                },
                {
                  es: "El runtime advierte por debajo de 12 GB de memoria WSL2.",
                  en: "The runtime warns below 12 GB of WSL2 memory.",
                },
                {
                  es: "Aproximadamente 14 GB se documenta como referencia cómoda para un host de 16 GB, sujeto a la presión del host.",
                  en: "Around 14 GB is documented as a comfortable reference for a 16 GB host, subject to host pressure.",
                },
                {
                  es: "Los modelos pesados de voz y LLM no deberían permanecer todos residentes innecesariamente.",
                  en: "Heavy voice and LLM models should not all stay resident unnecessarily.",
                },
                {
                  es: "Los modelos pesados inactivos pueden descargarse.",
                  en: "Idle heavy models can be unloaded.",
                },
                {
                  es: "El swap puede absorber picos cortos de carga de modelos, pero no reemplaza la RAM.",
                  en: "Swap can absorb short model-loading spikes, but it does not replace RAM.",
                },
                {
                  es: "La aplicación nunca edita `.wslconfig` de forma automática.",
                  en: "The application never edits `.wslconfig` automatically.",
                },
              ],
            },
            {
              type: "list",
              title: {
                es: "Datos y modelos permanecen locales",
                en: "Data and models stay local",
              },
              columns: 2,
              items: [
                {
                  es: "Historial de comandos almacenado en SQLite.",
                  en: "Command history stored in SQLite.",
                },
                {
                  es: "Estado del runtime en almacenamiento local.",
                  en: "Runtime state in local storage.",
                },
                { es: "Logs en almacenamiento local.", en: "Logs in local storage." },
                {
                  es: "Modelos de Ollama en un volumen Docker persistente.",
                  en: "Ollama models in a persistent Docker volume.",
                },
                {
                  es: "Modelos de voz almacenados localmente.",
                  en: "Voice models stored locally.",
                },
                {
                  es: "No se requiere ninguna API de IA en la nube.",
                  en: "No cloud AI API is required.",
                },
                { es: "`.env` permanece en gitignore.", en: "`.env` stays gitignored." },
                {
                  es: "Directorios de almacenamiento y modelos excluidos del contexto de build de Docker.",
                  en: "Storage and model directories excluded from the Docker build context.",
                },
                {
                  es: "Los respaldos excluyen archivos transitorios y secretos.",
                  en: "Backups exclude transient files and secrets.",
                },
                {
                  es: "Los directorios de datos locales se clasifican como protegidos.",
                  en: "Local data directories are classified as protected.",
                },
                {
                  es: "Los modelos y las bases de datos de usuario nunca se eliminan en una limpieza general.",
                  en: "Models and user databases are never removed by a general cleanup.",
                },
              ],
            },
            {
              type: "callout",
              body: {
                es: "La inteligencia, el procesamiento de comandos y la arquitectura de estado del usuario no requieren APIs de IA en la nube. Las herramientas de búsqueda web pueden abrir el navegador de forma intencional, por lo que no se afirma la ausencia total de acceso a la red.",
                en: "The intelligence, the command processing and the user-state architecture require no cloud AI APIs. Web-search tools may intentionally open the browser, so no claim is made of total absence of network access.",
              },
            },
            {
              type: "list",
              title: {
                es: "Capacidades funcionales actuales",
                en: "Current functional capabilities",
              },
              columns: 2,
              items: [
                { es: "API FastAPI local.", en: "Local FastAPI API." },
                { es: "Endpoints de salud e identidad.", en: "Health and identity endpoints." },
                { es: "Comandos de texto.", en: "Text commands." },
                { es: "Enrutamiento en español e inglés.", en: "Spanish and English routing." },
                { es: "Planificación local con Ollama.", en: "Local planning with Ollama." },
                { es: "Fallback determinista.", en: "Deterministic fallback." },
                { es: "Reconocimiento de voz local.", en: "Local speech recognition." },
                { es: "Respuestas de voz locales.", en: "Local spoken responses." },
                { es: "Push-to-talk.", en: "Push-to-talk." },
                { es: "Confirmación de voz exacta.", en: "Exact spoken confirmation." },
                { es: "Ejecución simulada de herramientas.", en: "Simulated tool execution." },
                { es: "Apertura controlada de carpetas.", en: "Controlled folder opening." },
                { es: "Lanzamiento controlado de aplicaciones.", en: "Controlled application launching." },
                {
                  es: "Búsqueda web en el navegador predeterminado.",
                  en: "Web search in the default browser.",
                },
                { es: "Historial de comandos local.", en: "Local command history." },
                {
                  es: "Runtime de modelos consciente de la GPU.",
                  en: "GPU-aware model runtime.",
                },
                {
                  es: "Operaciones start, stop, status y smoke.",
                  en: "start, stop, status and smoke operations.",
                },
                {
                  es: "Validación de disponibilidad de modelos.",
                  en: "Model availability validation.",
                },
                { es: "Estados y errores estructurados.", en: "Structured states and errors." },
              ],
            },
            {
              type: "cards",
              title: { es: "Ejemplos de interacción", en: "Interaction examples" },
              columns: 2,
              items: [
                {
                  title: {
                    es: "«Abre mi carpeta de descargas»",
                    en: "“Open my downloads folder”",
                  },
                  desc: {
                    es: "El normalizador de carpetas conocidas resuelve el directorio Descargas del usuario y el validador de rutas rechaza ubicaciones protegidas del sistema.",
                    en: "The known-folder normalizer resolves the user's Downloads directory and the path validator rejects protected system locations.",
                  },
                },
                {
                  title: {
                    es: "«Busca comparativas de modelos locales»",
                    en: "“Search for local model comparisons”",
                  },
                  desc: {
                    es: "La herramienta de navegador crea una búsqueda codificada y abre el navegador predeterminado.",
                    en: "The browser tool builds an encoded search and opens the default browser.",
                  },
                },
                {
                  title: { es: "«Abre el bloc de notas»", en: "“Open notepad”" },
                  desc: {
                    es: "La aplicación se resuelve mediante la lista permitida y la acción sensible solicita confirmación.",
                    en: "The application resolves through the allowlist and the sensitive action asks for confirmation.",
                  },
                },
                {
                  title: { es: "«Elimina esta carpeta»", en: "“Delete this folder”" },
                  desc: {
                    es: "La solicitud se clasifica como destructiva y permanece bloqueada.",
                    en: "The request is classified as destructive and stays blocked.",
                  },
                },
              ],
            },
            {
              type: "decisions",
              title: {
                es: "Decisiones técnicas y compensaciones",
                en: "Technical decisions and trade-offs",
              },
              items: [
                {
                  title: {
                    es: "FastAPI en el host de Windows",
                    en: "FastAPI on the Windows host",
                  },
                  reason: {
                    es: "El proceso que puede interactuar con el escritorio necesita acceso a la sesión activa del usuario de Windows.",
                    en: "The process that can interact with the desktop needs access to the active Windows user session.",
                  },
                  tradeoff: {
                    es: "El runtime del host debe administrarse por separado de los servicios de soporte en contenedores.",
                    en: "The host runtime must be managed separately from the containerized support services.",
                  },
                },
                {
                  title: {
                    es: "Docker solo para servicios de soporte",
                    en: "Docker only for support services",
                  },
                  reason: {
                    es: "Ollama y los workers de modelos se benefician de dependencias aisladas y volúmenes persistentes, mientras que los contenedores no deben recibir autoridad sobre el escritorio.",
                    en: "Ollama and the model workers benefit from isolated dependencies and persistent volumes, while containers should never receive desktop authority.",
                  },
                  tradeoff: {
                    es: "Los límites de recursos de Windows y WSL2 deben administrarse en conjunto.",
                    en: "Windows and WSL2 resource limits have to be managed together.",
                  },
                },
                {
                  title: {
                    es: "Router de reglas más LLM local opcional",
                    en: "Rule-based router plus optional local LLM",
                  },
                  reason: {
                    es: "Los comandos conocidos permanecen deterministas y disponibles sin el modelo, mientras que las variaciones de lenguaje natural pueden beneficiarse de Ollama.",
                    en: "Known commands stay deterministic and available without the model, while natural-language variations can benefit from Ollama.",
                  },
                  tradeoff: {
                    es: "Dos rutas de planificación deben compartir un mismo contrato validado y mantenerse consistentes.",
                    en: "Two planning paths must share one validated contract and stay consistent.",
                  },
                },
                {
                  title: {
                    es: "Tratar los planes del LLM como entrada no confiable",
                    en: "Treat LLM plans as untrusted input",
                  },
                  reason: {
                    es: "Un modelo de lenguaje puede inventar herramientas, argumentos o interpretaciones inseguras.",
                    en: "A language model can hallucinate tools, arguments or unsafe interpretations.",
                  },
                  tradeoff: {
                    es: "La validación puede rechazar algunos comandos plausibles y recurrir al comportamiento determinista.",
                    en: "Validation may reject some plausible commands and fall back to deterministic behavior.",
                  },
                },
                {
                  title: {
                    es: "Registro central de herramientas",
                    en: "Central tool registry",
                  },
                  reason: {
                    es: "Cada capacidad, contrato de argumentos y nivel de seguridad permanece descubrible y revisable.",
                    en: "Every capability, argument contract and safety level stays discoverable and reviewable.",
                  },
                  tradeoff: {
                    es: "Agregar una función requiere registro, enrutamiento y pruebas explícitos.",
                    en: "Adding a feature requires explicit registration, routing and tests.",
                  },
                },
                {
                  title: { es: "Herramientas simuladas primero", en: "Simulated tools first" },
                  reason: {
                    es: "El comportamiento nuevo puede probarse sin otorgar acceso inmediato al sistema operativo.",
                    en: "New behavior can be exercised without granting immediate operating-system access.",
                  },
                  tradeoff: {
                    es: "Una capacidad simulada requiere una revisión de seguridad posterior antes de volverse real.",
                    en: "A simulated capability needs a later safety review before becoming real.",
                  },
                },
                {
                  title: {
                    es: "Acciones destructivas bloqueadas en el código",
                    en: "Destructive actions blocked in code",
                  },
                  reason: {
                    es: "Un aviso de confirmación no es un control suficiente para la pérdida irreversible de datos.",
                    en: "A confirmation prompt is not a sufficient control for irreversible data loss.",
                  },
                  tradeoff: {
                    es: "Algunas acciones útiles de alto riesgo permanecen intencionalmente no disponibles.",
                    en: "Some useful high-risk actions remain intentionally unavailable.",
                  },
                },
                {
                  title: { es: "Confirmación por solicitud", en: "Per-request confirmation" },
                  reason: {
                    es: "La aprobación permanece acotada, de corta duración y atribuible a un comando específico.",
                    en: "Approval stays scoped, short-lived and attributable to a specific command.",
                  },
                  tradeoff: {
                    es: "Las acciones sensibles repetidas requieren confirmación repetida.",
                    en: "Repeated sensitive actions require repeated confirmation.",
                  },
                },
                {
                  title: {
                    es: "Grupos de dependencias opcionales",
                    en: "Optional dependency groups",
                  },
                  reason: {
                    es: "La API central puede ejecutarse sin instalar cada dependencia pesada de voz, navegador o escritorio.",
                    en: "The core API can run without installing every heavy voice, browser or desktop dependency.",
                  },
                  tradeoff: {
                    es: "La disponibilidad de capacidades depende de qué grupos opcionales estén instalados.",
                    en: "Capability availability depends on which optional groups are installed.",
                  },
                },
                {
                  title: {
                    es: "Persistencia local con SQLite",
                    en: "Local persistence with SQLite",
                  },
                  reason: {
                    es: "Historial de comandos simple, privado y portable sin una base de datos externa.",
                    en: "Simple, private and portable command history without an external database.",
                  },
                  tradeoff: {
                    es: "El proyecto se orienta a un único usuario local, no a una operación distribuida multiusuario.",
                    en: "The project targets a single local user, not a distributed multi-user operation.",
                  },
                },
                {
                  title: { es: "Ejecución GPU-first", en: "GPU-first execution" },
                  reason: {
                    es: "Las cargas de LLM y STT locales requieren un rendimiento predecible.",
                    en: "Local LLM and STT workloads require predictable performance.",
                  },
                  tradeoff: {
                    es: "La configuración de hardware y de memoria de WSL2 forma parte de la operación del runtime.",
                    en: "Hardware and WSL2 memory configuration become part of running the runtime.",
                  },
                },
                {
                  title: {
                    es: "Persona separada de la autorización",
                    en: "Persona separated from authorization",
                  },
                  reason: {
                    es: "Renombrar o dirigirse a Fifi nunca debe alterar los permisos.",
                    en: "Renaming or addressing Fifi must never alter permissions.",
                  },
                  tradeoff: {
                    es: "La personalidad es una capa de presentación, no una fuente de política.",
                    en: "Personality is a presentation layer, not a source of policy.",
                  },
                },
              ],
            },
            {
              type: "list",
              title: { es: "Degradación controlada", en: "Controlled degradation" },
              columns: 2,
              items: [
                {
                  es: "Ollama no disponible → el router determinista sigue disponible.",
                  en: "Ollama unavailable → the deterministic router remains available.",
                },
                { es: "Plan LLM inválido → router de fallback.", en: "Invalid LLM plan → fallback router." },
                {
                  es: "Plan de baja confianza → router de fallback.",
                  en: "Low-confidence plan → fallback router.",
                },
                {
                  es: "Dependencias de voz ausentes → respuesta estructurada de no disponible.",
                  en: "Missing voice dependencies → structured unavailable response.",
                },
                {
                  es: "Motor de TTS ausente → respuesta de voz simulada.",
                  en: "Missing TTS engine → simulated voice response.",
                },
                {
                  es: "Fallo de CUDA → error estructurado sin caer los endpoints de salud.",
                  en: "CUDA failure → structured error without taking health endpoints down.",
                },
                {
                  es: "Fallback de STT por CPU → deshabilitado salvo activación explícita.",
                  en: "CPU STT fallback → disabled unless explicitly enabled.",
                },
                {
                  es: "PID de API presente pero no saludable → el runtime valida la salud en lugar de confiar en el PID.",
                  en: "API PID present but unhealthy → the runtime validates health instead of trusting the PID.",
                },
                {
                  es: "El runtime encuentra un proceso que no le pertenece → no lo termina.",
                  en: "The runtime finds a process it does not own → it does not kill it.",
                },
                {
                  es: "Modelo ausente → el runtime lo verifica o descarga según reglas de ciclo de vida explícitas.",
                  en: "Missing model → the runtime verifies or pulls it under explicit lifecycle rules.",
                },
                {
                  es: "Comando sensible no confirmado → needs_confirmation.",
                  en: "Unconfirmed sensitive command → needs_confirmation.",
                },
                { es: "Comando destructivo → bloqueado.", en: "Destructive command → blocked." },
                {
                  es: "Comando desconocido → solicita aclaración.",
                  en: "Unknown command → asks for clarification.",
                },
              ],
            },
            {
              type: "list",
              title: { es: "Calidad y validación", en: "Quality and validation" },
              columns: 2,
              items: [
                {
                  es: "Valores según la auditoría de versión del snapshot auditado; no todas las 1165 pruebas son de integración.",
                  en: "Figures come from the release audit of the audited snapshot; not all 1165 tests are integration tests.",
                },
                { es: "1165 pruebas aprobadas.", en: "1165 passing tests." },
                { es: "1 prueba omitida.", en: "1 skipped test." },
                { es: "`pip check` sin conflictos.", en: "`pip check` with no conflicts." },
                {
                  es: "Cero marcadores TODO/FIXME/XXX/HACK en los directorios de runtime auditados.",
                  en: "Zero TODO/FIXME/XXX/HACK markers in the audited runtime directories.",
                },
                {
                  es: "Cero patrones de credenciales rastreadas en el snapshot auditado.",
                  en: "Zero tracked credential patterns in the audited snapshot.",
                },
                { es: "API de Docker solo simulada.", en: "Docker API simulation-only." },
                { es: "Ollama enlazado a loopback.", en: "Ollama bound to loopback." },
                {
                  es: "Servicios de Compose protegidos por perfiles.",
                  en: "Compose services guarded by profiles.",
                },
                {
                  es: "Almacenamiento y modelos excluidos del contexto de build de Docker.",
                  en: "Storage and models excluded from the Docker build context.",
                },
                {
                  es: "Pruebas del router determinista y de enrutamiento en español e inglés.",
                  en: "Tests for the deterministic router and Spanish/English routing.",
                },
                {
                  es: "Pruebas de niveles de seguridad y de bloqueo de acciones destructivas.",
                  en: "Tests for safety levels and destructive-action blocking.",
                },
                {
                  es: "Pruebas de confirmación por solicitud y de validación de listas permitidas.",
                  en: "Tests for per-request confirmation and allowlist validation.",
                },
                {
                  es: "Pruebas de validación de rutas y de ejecución simulada frente a real.",
                  en: "Tests for path validation and simulated versus real execution.",
                },
                {
                  es: "Validación del esquema de planes del LLM y rechazo de herramientas inventadas.",
                  en: "LLM plan schema validation and rejection of hallucinated tools.",
                },
                {
                  es: "Rechazo por confianza del plan y comportamiento del router de fallback.",
                  en: "Plan confidence rejection and fallback router behavior.",
                },
                {
                  es: "Pruebas del pipeline de voz, de grabación push-to-talk y de confirmación hablada exacta.",
                  en: "Tests for the voice pipeline, push-to-talk recording and exact spoken confirmation.",
                },
                {
                  es: "Pruebas de timeout y cancelación.",
                  en: "Timeout and cancellation tests.",
                },
                {
                  es: "Pruebas de fallo con GPU requerida y de activación explícita de CPU.",
                  en: "Tests for required-GPU failures and explicit CPU opt-in.",
                },
                {
                  es: "Pruebas de contención de Docker y de ciclo de vida del runtime local.",
                  en: "Tests for Docker containment and the local runtime lifecycle.",
                },
                {
                  es: "Sin lanzamientos reales de aplicaciones durante las pruebas automatizadas; bases de datos temporales y dependencias simuladas (micrófono, atajo, HTTP y TTS).",
                  en: "No real application launches during automated tests; temporary databases and mocked dependencies (microphone, shortcut, HTTP and TTS).",
                },
              ],
            },
            {
              type: "cards",
              title: { es: "Herramientas de versión", en: "Release tooling" },
              badge: { es: "según auditoría", en: "per audit" },
              columns: 3,
              items: [
                {
                  title: "Deploy doctor",
                  desc: {
                    es: "Verifica intérprete, imports, valores seguros por defecto, enlace loopback, archivos de entorno ignorados, capacidad de escritura del almacenamiento y patrones de secretos rastreados.",
                    en: "Checks the interpreter, imports, safe defaults, loopback binding, ignored environment files, storage writability and tracked secret patterns.",
                  },
                },
                {
                  title: "Release smoke",
                  desc: {
                    es: "Arranca el ciclo de vida de la aplicación y verifica salud, identidad, registro de herramientas, control de seguridad y un estado de comando pendiente limpio.",
                    en: "Boots the application lifecycle and verifies health, identity, tool registry, safety control and a clean pending-command state.",
                  },
                },
                {
                  title: "Backup y restore",
                  desc: {
                    es: "Copia los datos protegidos del usuario excluyendo secretos y archivos transitorios, y luego valida la restauración.",
                    en: "Copies protected user data while excluding secrets and transient files, then validates the restore.",
                  },
                },
              ],
            },
            {
              type: "list",
              title: { es: "Alcance y limitaciones", en: "Scope and limitations" },
              columns: 2,
              items: [
                { es: "Arquitectura enfocada en Windows.", en: "Windows-focused architecture." },
                {
                  es: "No es una plataforma multiusuario ni SaaS.",
                  en: "It is not a multi-user or SaaS platform.",
                },
                {
                  es: "No requiere APIs de IA en la nube.",
                  en: "It requires no cloud AI APIs.",
                },
                {
                  es: "El hardware local determina la velocidad de inferencia.",
                  en: "Local hardware determines inference speed.",
                },
                {
                  es: "El runtime GPU-first requiere una configuración NVIDIA compatible.",
                  en: "The GPU-first runtime requires a compatible NVIDIA setup.",
                },
                {
                  es: "La memoria de WSL2 debe configurarse adecuadamente.",
                  en: "WSL2 memory must be configured appropriately.",
                },
                {
                  es: "Algunas capacidades opcionales requieren grupos de dependencias separados.",
                  en: "Some optional capabilities require separate dependency groups.",
                },
                {
                  es: "Las acciones reales de Windows están intencionalmente limitadas.",
                  en: "Real Windows actions are intentionally limited.",
                },
                {
                  es: "No está disponible la ejecución arbitraria de shell.",
                  en: "Arbitrary shell execution is not available.",
                },
                {
                  es: "Las acciones destructivas permanecen bloqueadas.",
                  en: "Destructive actions stay blocked.",
                },
                {
                  es: "La eliminación de archivos y el apagado permanecen no disponibles.",
                  en: "File deletion and shutdown remain unavailable.",
                },
                {
                  es: "La inyección general de texto permanece simulada salvo revisión aparte.",
                  en: "General text injection stays simulated unless separately reviewed.",
                },
                {
                  es: "La automatización del navegador debe permanecer acotada y en lista permitida.",
                  en: "Browser automation must stay scoped and allowlisted.",
                },
                {
                  es: "El reconocimiento de voz puede cometer errores de transcripción.",
                  en: "Speech recognition can make transcription mistakes.",
                },
                {
                  es: "El push-to-talk es más seguro que el audio siempre activo, pero requiere interacción explícita.",
                  en: "Push-to-talk is safer than always-on audio, but requires explicit interaction.",
                },
                {
                  es: "No se afirma palabra de activación salvo que esté verificada.",
                  en: "No wake word is claimed unless it has been verified.",
                },
                {
                  es: "Los modelos locales pueden entender menos casos límite que los grandes sistemas remotos.",
                  en: "Local models may handle fewer edge cases than large remote systems.",
                },
                {
                  es: "La salida del modelo es probabilística y por ello no puede convertirse en autoridad.",
                  en: "Model output is probabilistic and therefore cannot become authority.",
                },
                {
                  es: "El proyecto requiere sincronización continua entre la documentación y el código actual.",
                  en: "The project requires continuous alignment between documentation and current code.",
                },
                {
                  es: "Los módulos avanzados de un snapshot de auditoría no se describen como publicados salvo que estén confirmados y verificados.",
                  en: "Advanced modules from an audit snapshot are not described as shipped unless confirmed and verified.",
                },
              ],
            },
            {
              type: "groups",
              title: { es: "Evolución del proyecto", en: "Project evolution" },
              groups: [
                {
                  category: {
                    es: "Completado y verificado (núcleo)",
                    en: "Completed and verified (core)",
                  },
                  items: [
                    {
                      es: "API FastAPI local con salud e identidad.",
                      en: "Local FastAPI API with health and identity.",
                    },
                    {
                      es: "Router determinista bilingüe y planificador LLM validado.",
                      en: "Bilingual deterministic router and validated LLM planner.",
                    },
                    {
                      es: "Capa de seguridad central con tres niveles.",
                      en: "Central safety layer with three levels.",
                    },
                    {
                      es: "Voz local (STT/TTS) y push-to-talk sobre el mismo pipeline.",
                      en: "Local voice (STT/TTS) and push-to-talk over the same pipeline.",
                    },
                    {
                      es: "Acciones reales controladas y ejecución simulada primero.",
                      en: "Controlled real actions with simulation-first execution.",
                    },
                    {
                      es: "Runtime local administrado y consciente de la GPU.",
                      en: "Managed, GPU-aware local runtime.",
                    },
                  ],
                },
                {
                  category: {
                    es: "Experimentos actuales (no publicados)",
                    en: "Current experiments (not shipped)",
                  },
                  items: [
                    {
                      es: "Palabra de activación por voz en evolución.",
                      en: "Voice wake word still evolving.",
                    },
                    {
                      es: "Knowledge Vault, memoria personal y tareas/horarios.",
                      en: "Knowledge Vault, personal memory and tasks/schedules.",
                    },
                    {
                      es: "Automatización de navegador acotada y cliente de escritorio PySide6.",
                      en: "Scoped browser automation and a PySide6 desktop client.",
                    },
                    {
                      es: "Bandeja/autoarranque y laboratorio de voz.",
                      en: "Tray/autostart and a voice lab.",
                    },
                    {
                      es: "Los módulos de auditoría no se presentan como operativos hasta verificarse en el código actual.",
                      en: "Audit modules are not presented as operational until verified against current code.",
                    },
                  ],
                },
                {
                  category: { es: "Trabajo futuro", en: "Future work" },
                  items: [
                    {
                      es: "Gestión de ventanas cuidadosamente acotada.",
                      en: "Carefully scoped window management.",
                    },
                    {
                      es: "Flujos de navegador en lista permitida.",
                      en: "Allowlisted browser flows.",
                    },
                    {
                      es: "Inyección de texto basada en vista previa.",
                      en: "Preview-based text injection.",
                    },
                    {
                      es: "Memoria local ampliada y conversación local más rica.",
                      en: "Expanded local memory and richer local conversation.",
                    },
                    { es: "TTS local de mayor calidad.", en: "Higher-quality local TTS." },
                    {
                      es: "Activación por palabra clave tras validar falsos positivos y privacidad.",
                      en: "Wake-word activation after validating false positives and privacy.",
                    },
                    {
                      es: "Herramientas seguras adicionales y perfiles de runtime de menor memoria.",
                      en: "Additional safe tools and lower-memory runtime profiles.",
                    },
                  ],
                },
              ],
            },
            {
              type: "list",
              title: { es: "Qué demuestra este proyecto", en: "What this project demonstrates" },
              columns: 2,
              items: [
                {
                  es: "Ingeniería de sistemas de IA local.",
                  en: "Local AI systems engineering.",
                },
                { es: "Diseño de backend con FastAPI.", en: "Backend design with FastAPI." },
                {
                  es: "Planificación determinista y basada en LLM.",
                  en: "Deterministic and LLM-based planning.",
                },
                { es: "Validación estricta de esquemas.", en: "Strict schema validation." },
                {
                  es: "Autorización separada de la inferencia.",
                  en: "Authorization separated from inference.",
                },
                { es: "Arquitectura orientada a herramientas.", en: "Tool-oriented architecture." },
                {
                  es: "Integración con el escritorio de Windows.",
                  en: "Windows desktop integration.",
                },
                { es: "Ingeniería de pipeline de voz.", en: "Voice pipeline engineering." },
                {
                  es: "Integración de STT y TTS locales.",
                  en: "Local STT and TTS integration.",
                },
                { es: "Ciclo de vida de push-to-talk.", en: "Push-to-talk lifecycle." },
                {
                  es: "Diseño de confirmación explícita.",
                  en: "Explicit confirmation design.",
                },
                { es: "Automatización defensiva.", en: "Defensive automation." },
                {
                  es: "Arquitectura híbrida de Docker y Windows.",
                  en: "Hybrid Docker and Windows architecture.",
                },
                {
                  es: "Administración de runtime consciente de la GPU.",
                  en: "GPU-aware runtime management.",
                },
                { es: "Conciencia de la memoria de WSL2.", en: "WSL2 memory awareness." },
                { es: "Persistencia local con SQLite.", en: "Local persistence with SQLite." },
                {
                  es: "Diseño de dependencias opcionales.",
                  en: "Optional dependency design.",
                },
                { es: "Degradación controlada.", en: "Controlled degradation." },
                {
                  es: "Pruebas de rutas de rechazo y de fallo.",
                  en: "Rejection-path and failure-path testing.",
                },
                { es: "Diagnósticos de versión.", en: "Release diagnostics." },
                {
                  es: "Ejecución local consciente de la privacidad.",
                  en: "Privacy-conscious local execution.",
                },
                {
                  es: "Evolución de prototipo a plataforma modular.",
                  en: "Evolution from prototype to modular platform.",
                },
              ],
            },
          ],
        },
      },
    ],
  },
  {
    title: {
      es: "Proyectos iniciales / académicos",
      en: "Early / academic projects",
    },
    items: [
      {
        name: { es: "Inventario (Java EE)", en: "Inventory (Java EE)" },
        description: {
          es: "Sistema web para gestión de inventarios de proveedores desarrollado con Java EE, PrimeFaces y MySQL sobre servidor GlassFish.",
          en: "Web system for supplier inventory management built with Java EE, PrimeFaces and MySQL on a GlassFish server.",
        },
        tags: [
          { name: "PrimeFaces", color: "blue-text-gradient" },
          { name: "MySQL", color: "green-text-gradient" },
          { name: "Java EE", color: "pink-text-gradient" },
        ],
        image: inventario,
        source_code_link: "https://github.com/lighsiegfried/JavaWebProyectUnivesity",
      },
      {
        name: { es: "HTML + CSS + JavaScript", en: "HTML + CSS + JavaScript" },
        description: {
          es: "Página web con HTML, CSS y JavaScript nativo. Incluye maquetación y animaciones básicas.",
          en: "Website built with HTML, CSS and vanilla JavaScript. Includes layout work and basic animations.",
        },
        tags: [
          { name: "HTML", color: "blue-text-gradient" },
          { name: "CSS", color: "green-text-gradient" },
          { name: "JavaScript", color: "pink-text-gradient" },
        ],
        image: simpleweb,
        source_code_link: "https://github.com/lighsiegfried/html-css",
      },
      {
        name: { es: "Java Base App", en: "Java Base App" },
        description: {
          es: "Aplicación Java de escritorio para visualización y modificación de datos desde archivos Excel con estructura de árbol.",
          en: "Java desktop application to view and edit data from Excel files using a tree structure.",
        },
        tags: [
          { name: "Java", color: "blue-text-gradient" },
        ],
        image: java,
        source_code_link: "https://github.com/lighsiegfried/JavaTree",
      },
      {
        name: { es: "CRUD en Node.js", en: "CRUD in Node.js" },
        description: {
          es: "API REST construida con Node.js, PHP y jQuery para operaciones CRUD con integración frontend-backend.",
          en: "REST API built with Node.js, PHP and jQuery for CRUD operations with frontend-backend integration.",
        },
        tags: [
          { name: "PHP", color: "pink-text-gradient" },
          { name: "jQuery", color: "green-text-gradient" },
          { name: "Bootstrap", color: "pink-text-gradient" },
          { name: "Node.js", color: "blue-text-gradient" },
        ],
        image: crudnode,
        source_code_link: "https://github.com/lighsiegfried/crud_nodejs",
      },
      {
        name: { es: "Modelado 3D Web", en: "Web 3D Modeling" },
        description: {
          es: "Aplicación web para modelado y previsualización de productos 3D utilizando Next.js, Three.js, React Three Fiber y Drei.",
          en: "Web application for modeling and previewing 3D products using Next.js, Three.js, React Three Fiber and Drei.",
        },
        tags: [
          { name: "Next.js", color: "pink-text-gradient" },
          { name: "Three.js", color: "green-text-gradient" },
          { name: "React Three Fiber", color: "pink-text-gradient" },
          { name: "Drei", color: "blue-text-gradient" },
          { name: "Tailwind CSS", color: "green-text-gradient" },
        ],
        image: tresdmodel,
        source_code_link: "https://github.com/lighsiegfried/modelos3d",
      },
    ],
  },
];

export { services, technologies, experiences, technicalDecisions, projects };
