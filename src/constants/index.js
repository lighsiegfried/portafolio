import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  meta,
  Polyproductos,
  Envaseal,
  alorica,
  indiana,
  inventario,
  simpleweb,
  java,
  crudnode,
  threejs, 
  dani, 
  gabriela, 
  ricardo
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "Sobre Mi",
  },
  {
    id: "work",
    title: "Experiencia",
  },
  {
    id: "contact",
    title: "Contacto",
  },
];

const services = [
  {
    title: "Web Developer",
    icon: web,
  },
  {
    title: "React Native Developer",
    icon: mobile,
  },
  {
    title: "Backend Developer",
    icon: backend,
  },
  {
    title: "Especialista en ERP",
    icon: creator,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "figma",
    icon: figma,
  },
  {
    name: "docker",
    icon: docker,
  },
];

const experiences = [
  {
    title: "Encargado de IT / Desarrollador de software",
    company_name: "Envaseal S.A",
    icon: Envaseal,
    iconBg: "#FFFFFF",
    date: "Enero 2024 - Actualmente",
    points: [
      "Administrar servidores Linux (Red Hat) y contenedores Docker en modulación.",
      "Soporte técnico, mantenimiento a impresoras y reparación de hardware de computadoras",
      "Mantenimiento de servidores y realización de copias de seguridad de bases de datos de producción",
      "Conceptualización, diagramación de bases de datos y estructuración de la infraestructura del software",
      "Evaluar factibilidad de implementación de nuevos módulos optimizando tiempos de producción",
      "Implementar nuevos y migrar antiguos módulos a ERP mejorando carga y usabilidad",
      "Creación de tablas, normalización y mejora de la infraestructura actual de la base de datos",
      "Optimización y tuning de consultas SQL para reducir tiempos de carga en módulos críticos",
      "Desarrollo full-stack en ERP bajo arquitectura MVC (PHP, Java, JS, jQuery)",
      "Uso de Git y GitHub para control de versiones y trabajo colaborativo",
      "Configuración y evaluación de nuevos puertos de red según requerimientos técnicos",
      "Automatización de pruebas y control de calidad de software",
      "Gestión de tareas bajo metodologías ágiles (SCRUM/UML) usando Trello y Jira",
    ],
  },
  {
    title: "Analista de datos / Data Entry",
    company_name: "Hoosier Manufacturing",
    icon: indiana,
    iconBg: "#A6D0DD",
    date: "Febrero 2021 - Diciembre 2023",
    points: [
      "Soporte técnico",
      "Conceptualizar bases de datos SQL y POWER BI",
      "Uso de Git y GitHub para control de versiones y trabajo colaborativo",
      "Gestión de tareas bajo metodologías ágiles (SCRUM/UML) usando Trello",
    ],
  },

];

const testimonials = [
  {
    testimonial:
      "Pensé que era imposible crear un sitio web tan hermoso como este producto, pero Wilson demostró que estabamos equivocados.",
    name: "Sara L.",
    designation: "CFO",
    company: "Acme Co",
    image: gabriela,
  },
  {
    testimonial:
      "Nunca he conocido a un desarrollador web que realmente se preocupe por el éxito de sus clientes como lo hace Wilson.",
    name: "Daniel N.",
    designation: "Hoosier",
    company: "Data Entry",
    image: dani,
  },
  {
    testimonial:
      "Después de que Wilson optimizó nuestro sitio web, nuestro tráfico aumentó en un 50%. esto es algo realmente bueno",
    name: "Ricardo G.",
    designation: "Digital Solutions",
    company: "456 Enterprises",
    image: ricardo,
    //"https://randomuser.me/api/portraits/women/6.jpg" links de prueba
  },
];

const projects = [
  {
    name: "Inventario (legacy)",
    description:
      "Pagina Web en JavaEE con Primeface montada con Glassfish para manejar inventarios de proveedores.",
    tags: [
      {
        name: "PrimeFace",
        color: "blue-text-gradient",
      },
      {
        name: "MySQL",
        color: "green-text-gradient",
      },
      {
        name: "JavaEE",
        color: "pink-text-gradient",
      },
    ],
    image: inventario,
    source_code_link: "https://github.com/lighsiegfried/JavaWebProyectUnivesity",
  },
  {
    name: "HTML + CSS + JavaScript (simple)",
    description:
      "Una pagina con tematicas simples de HTML + CSS y JavaScript nativo ademas podremos ver algunas animaciones",
    tags: [
      {
        name: "HTML",
        color: "blue-text-gradient",
      },
      {
        name: "CSS",
        color: "green-text-gradient",
      },
      {
        name: "JavaScript",
        color: "pink-text-gradient",
      },
    ],
    image: simpleweb,
    source_code_link: "https://github.com/lighsiegfried/html-css",
  },
  {
    name: "Java Base App (legacy)",
    description:
      "Una app java base para visualizar Data de un excel y poder modificarlo ademas de ver el codigo de alumno mediante un arbol",
    tags: [
      {
        name: "JavaBase",
        color: "blue-text-gradient",
      },
    ],
    image: java,
    source_code_link: "https://github.com/lighsiegfried/JavaTree",
  },
  {
    name: "CRUD en Node.JS",
    description:
      "Una app crud que se utilizo PHP, jquery, boostrap y Node.js para crear API y consumirla, consulta,crea, elimina y actualiza",
    tags: [
      {
        name: "PHP",
        color: "pink-text-gradient",
      },
      {
        name: "JQUERY",
        color: "green-text-gradient",
      },
      {
        name: "Boostrap",
        color: "pink-text-gradient",
      },
      {
        name: "Node.js",
        color: "blue-text-gradient",
      },
    ],
    image: crudnode,
    source_code_link: "https://github.com/lighsiegfried/JavaTree",
  },
];

export { services, technologies, experiences, testimonials, projects };
