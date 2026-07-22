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
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "Sobre mí",
  },
  {
    id: "work",
    title: "Experiencia",
  },
  {
    id: "architecture",
    title: "Arquitectura",
  },
  {
    id: "contact",
    title: "Contacto",
  },
];

const services = [
  {
    title: "Full-Stack Developer",
    icon: web,
  },
  {
    title: "Cloud & DevOps",
    icon: backend,
  },
  {
    title: "ERP / CRM Systems",
    icon: creator,
  },
  {
    title: "AI & Automation",
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
    title: "Software Engineer Full Stack",
    company_name: "Kratt",
    icon: kratt,
    iconBg: "#FFFFFF",
    date: "Febrero 2026 - Actualmente",
    points: [
      "Desarrollo y acompañamiento técnico en proyectos CRM, Ticket System y ERP multiorganizacional.",
      "Participación en arquitecturas cloud sobre AWS, incluyendo despliegues, contenedores y servicios administrados.",
      "Integración de flujos asistidos con IA para automatización documental, generación asistida y optimización de procesos.",
      "Documentación técnica, diagramas de arquitectura y estandarización de procesos para trazabilidad operativa.",
      "Apoyo en infraestructura de pruebas, redes internas y entornos de validación.",
    ],
  },
  {
    title: "Desarrollador de Software",
    company_name: "Envaseal S.A",
    icon: envaseal,
    iconBg: "#FFFFFF",
    date: "Enero 2024 - Febrero 2026",
    points: [
      "Migración y modernización de sistemas críticos, incluyendo actualización de versiones PHP y mejoras de seguridad.",
      "Rediseño del módulo de compras y requisiciones, reduciendo carga manual y optimizando tiempos de aprobación.",
      "Desarrollo full-stack de módulos ERP bajo arquitectura MVC con PHP, Java, JavaScript, jQuery y SQL.",
      "Optimización de consultas SQL, normalización de base de datos, triggers, stored procedures y procesos ETL.",
      "Implementación de Power BI Report Server para reportería interna y toma de decisiones.",
      "Apoyo en continuidad del negocio mediante estrategia de respaldos 3-2-1, NAS y servidores de contingencia.",
      "Creación de base de conocimiento institucional y documentación técnica.",
    ],
  },
  {
    title: "Analista de Datos / Soporte Técnico",
    company_name: "Hoosier Manufacturing",
    icon: indiana,
    iconBg: "#A6D0DD",
    date: "Enero 2021 - Septiembre 2023",
    points: [
      "Soporte técnico a usuarios y documentación de procesos.",
      "Conceptualización de bases de datos SQL y reportería en Power BI.",
      "Uso de Git/GitHub para control de versiones y colaboración.",
      "Apoyo en mejoras de administración de información en módulos internos.",
    ],
  },
  {
    title: "Help Desk Support Specialist - Remoto",
    company_name: "Alorica Inc.",
    icon: alorica,
    iconBg: "#E6E6E6",
    date: "Mayo 2018 - Mayo 2019",
    points: [
      "Soporte técnico remoto a clientes.",
      "Documentación de problemas recurrentes.",
      "Apoyo en análisis y automatización del proceso de troubleshooting.",
    ],
  },
];

const technicalDecisions = [
  {
    title: "Frontend desacoplado y distribuido por CDN",
    description:
      "El portafolio utiliza una SPA en React/Vite con assets estáticos distribuidos mediante CloudFront, separando la capa visual de futuras APIs o servicios backend.",
  },
  {
    title: "Arquitectura preparada para serverless",
    description:
      "La evolución del proyecto contempla API Gateway, Lambda y DynamoDB para agregar funciones de Mini ERP/CRM Lite sin administrar servidores directamente.",
  },
  {
    title: "IaC y CI/CD como evidencia técnica",
    description:
      "La infraestructura será documentada y versionada con Terraform, mientras que los despliegues se automatizarán con GitHub Actions y OIDC para evitar credenciales estáticas.",
  },
  {
    title: "Documentación como parte del producto",
    description:
      "El proyecto incluirá README técnico, diagramas, decisiones de arquitectura y guías de despliegue para que el código pueda ser entendido y auditado fácilmente.",
  },
];

const projects = [
  {
    title: "Proyectos profesionales / arquitectura",
    items: [
      {
        name: "Portafolio AWS Serverless",
        description:
          "Portafolio profesional desplegado en AWS con frontend estático en S3 privado, distribución por CloudFront, Origin Access Control y protección a nivel de aplicación mediante WAF. El proyecto evoluciona hacia una arquitectura cloud-native con backend serverless e infraestructura como código.",
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
      },
      {
        name: "Mini ERP Cloud-Native para PyME",
        description:
          "Sistema empresarial demo con login por roles, requisiciones, aprobaciones, inventario, dashboard, API REST, reportes CSV, CI/CD e infraestructura en AWS. Incluye dataset profesional, validacion de datos y 133 tests.",
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
      },
      {
        name: "ERP / Requisiciones / Compras",
        description:
          "Experiencia aplicada en modernización y mejora de módulos ERP orientados a compras, requisiciones, flujos de aprobación, reportería y optimización de consultas SQL.",
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
      },
      {
        name: "Mis Finanzas",
        description:
          "Comenzó como una herramienta muy personal para organizar mis finanzas y evolucionó hasta convertirse en una aplicación Android nativa de nivel profesional. Permite administrar ingresos, gastos, presupuestos, deudas, cuotas y movimientos desde una experiencia local-first, con persistencia en el dispositivo, arquitectura modular, integración mediante API y distribución del APK desde AWS.",
        tags: [
          { name: "Android", color: "blue-text-gradient" },
          { name: "AppNativa", color: "green-text-gradient" },
          { name: "APIREST", color: "pink-text-gradient" },
          { name: "LocalFirst", color: "blue-text-gradient" },
          { name: "AWSS3", color: "green-text-gradient" },
        ],
        image: androidapp,
        image_alt: "Vista previa de la aplicación Android Mis Finanzas",
        source_code_link: "https://github.com/lighsiegfried/Finanzas",
        download_link: import.meta.env.VITE_FINANZAS_APK_URL,
        download_label: "Descargar app para Android",
      },
    ],
  },
  {
    title: "Proyectos iniciales / académicos",
    items: [
      {
        name: "Inventario (Java EE)",
        description:
          "Sistema web para gestión de inventarios de proveedores desarrollado con Java EE, PrimeFaces y MySQL sobre servidor GlassFish.",
        tags: [
          { name: "PrimeFaces", color: "blue-text-gradient" },
          { name: "MySQL", color: "green-text-gradient" },
          { name: "Java EE", color: "pink-text-gradient" },
        ],
        image: inventario,
        source_code_link: "https://github.com/lighsiegfried/JavaWebProyectUnivesity",
      },
      {
        name: "HTML + CSS + JavaScript",
        description:
          "Página web con HTML, CSS y JavaScript nativo. Incluye maquetación y animaciones básicas.",
        tags: [
          { name: "HTML", color: "blue-text-gradient" },
          { name: "CSS", color: "green-text-gradient" },
          { name: "JavaScript", color: "pink-text-gradient" },
        ],
        image: simpleweb,
        source_code_link: "https://github.com/lighsiegfried/html-css",
      },
      {
        name: "Java Base App",
        description:
          "Aplicación Java de escritorio para visualización y modificación de datos desde archivos Excel con estructura de árbol.",
        tags: [
          { name: "Java", color: "blue-text-gradient" },
        ],
        image: java,
        source_code_link: "https://github.com/lighsiegfried/JavaTree",
      },
      {
        name: "CRUD en Node.js",
        description:
          "API REST construida con Node.js, PHP y jQuery para operaciones CRUD con integración frontend-backend.",
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
        name: "Modelado 3D Web",
        description:
          "Aplicación web para modelado y previsualización de productos 3D utilizando Next.js, Three.js, React Three Fiber y Drei.",
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
