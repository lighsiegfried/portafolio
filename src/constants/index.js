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
  alorica,
  indiana,
  inventario,
  simpleweb,
  java,
  threejs, 
  dani, 
  gabriela, 
  ricardo
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
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
    title: "Content Creator",
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
    title: "Ayudante de operador",
    company_name: "Polyproductos S.A",
    icon: Polyproductos,
    iconBg: "#9BA4B5",
    date: "Nov 2014 - Mayo 2016",
    points: [
      "Implementacion de corte final a tela para Relajacion de la misma por los procesos de costura",
      "Ordenar e inventariar la cantidad trabajada por los operarios",
    ],
  },
  {
    title: "Bilingual Agent Customer Service",
    company_name: "Alorica",
    icon: alorica,
    iconBg: "#FFFFFF",
    date: "Mayo 2018 - Marzo 2019",
    points: [
      "Implementing solutions to customers.",
      "Participating in reviews to improve services en the company",
      "Dar soporte remoto a clientes con problemas de pagos/servicios/compras/garantias",
      "de igual forma con embargos y promociones",
    ],
  },
  {
    title: "Data Entry",
    company_name: "Hoosier Manufacturing",
    icon: indiana,
    iconBg: "#A6D0DD",
    date: "Febrero 2021 - Actualmente laborando",
    points: [
      "Digitar la entrada y salida de producto a bodega y plantas externas.",
      "Direccion y coordinacion acorde a programacion de W.O para entrar en accion ante problemas de faltante de tela.",
      "Creacion de dashboards y formulas anidadas en excel",
    ],
  },
];

const testimonials = [
  {
    testimonial:
      "I thought it was impossible to make a website as beautiful as our product, but Wilson proved me wrong.",
    name: "Sara L.",
    designation: "CFO",
    company: "Acme Co",
    image: gabriela,
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Wilson does.",
    name: "Daniel N.",
    designation: "Hoosier",
    company: "Data Entry",
    image: dani,
  },
  {
    testimonial:
      "After Wilson optimized our website, our traffic increased by 50%. This is something really good",
    name: "Ricardo G.",
    designation: "Digital Solutions",
    company: "456 Enterprises",
    image: ricardo,
    //"https://randomuser.me/api/portraits/women/6.jpg" links de prueba
  },
];

const projects = [
  {
    name: "Inventario",
    description:
      "Web-based platform that allows users to search, information and manage data from various providers, Pagina Web en JavaEE con Primeface montada con Glassfish para manejar inventarios de proveedores.",
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
    name: "HTML + CSS + JavaScript",
    description:
      "I created a simple web site with HTML + CSS and JavaScript also we can see some animations, Una pagina con tematicas simples de HTML + CSS y JavaScript nativo ademas podremos ver algunas animaciones",
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
    name: "Java Base App",
    description:
      "A comprehensive App to use excel and view data on this one, Una app java base para visualizar Data de un excel y poder modificarlo ademas de ver el codigo de alumno mediante un arbol",
    tags: [
      {
        name: "JavaBase",
        color: "blue-text-gradient",
      },
    ],
    image: java,
    source_code_link: "https://github.com/lighsiegfried/JavaTree",
  },
];

export { services, technologies, experiences, testimonials, projects };
