# Frontend — 3D Portafolio

## ¿Qué es?

SPA (Single Page Application) construida con **React 18 + Vite 4 + Three.js**, que funciona como portafolio profesional de Wilson Vásquez (Software Engineer). Es el frontend del proyecto `3d_portafolio` y actualmente se despliega como sitio estático en AWS S3 + CloudFront.

## ¿Qué hace?

Presenta de forma visual e interactiva la experiencia, proyectos, stack tecnológico y decisiones de arquitectura del autor. Incluye:

- **Hero** con animación 3D (computadora con modelo Three.js)
- **About** con biografía y tarjetas de servicios (Full-Stack, Cloud & DevOps, ERP/CRM, AI & Automation)
- **ValidatedExperience** — áreas de experiencia técnica validadas (Cloud & DevOps, Sistemas empresariales, Infraestructura & continuidad)
- **Experience** — línea de tiempo laboral (Kratt, Envaseal S.A, Hoosier Manufacturing, Alorica Inc.)
- **Tech** — esferas 3D con tecnologías + categorías por tags
- **Works** — proyectos agrupados en profesionales y académicos
- **TechnicalDecisions** — decisiones de arquitectura documentadas
- **AwsArchitecture** — diagramas de texto de la arquitectura actual y futura
- **Contact** — formulario de contacto con EmailJS + esfera 3D de la Tierra

## ¿Para qué sirve?

1. **Vitrina profesional** — muestra habilidades, experiencia y criterio técnico a reclutadores y clientes.
2. **Laboratorio cloud** — demuestra despliegue serverless en AWS con S3, CloudFront, OAC, WAF y la evolución hacia backend con API Gateway + Lambda + DynamoDB.
3. **Evidencia técnica** — cada sección documenta decisiones reales de arquitectura, no solo listing de tecnologías.

---

## Estructura del proyecto

```
apps/frontend/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── e2e/
│   ├── playwright.config.js
│   └── tests/
│       ├── smoke.spec.js
│       ├── navigation.spec.js
│       ├── responsive.spec.js
│       └── contact.spec.js
├── public/
└── src/
    ├── main.jsx                  # Entry point
    ├── App.jsx                   # Layout raíz (Router + secciones)
    ├── styles.js                 # Constantes de estilos Tailwind
    ├── assets/
    │   ├── index.js              # Barrel export de imágenes
    │   ├── company/              # Logos de empresas
    │   └── tech/                 # Iconos de tecnologías
    ├── components/
    │   ├── index.js              # Barrel export de componentes
    │   ├── Navbar.jsx            # Navegación con scroll a secciones
    │   ├── Hero.jsx              # Portada con animación 3D
    │   ├── About.jsx             # Biografía + ServiceCard
    │   ├── ValidatedExperience.jsx  # Áreas de experiencia técnica
    │   ├── Experience.jsx        # Timeline laboral
    │   ├── Tech.jsx              # Esferas 3D + tags por categoría
    │   ├── Works.jsx             # Proyectos agrupados
    │   ├── TechnicalDecisions.jsx  # Decisiones de arquitectura
    │   ├── AwsArchitecture.jsx   # Diagramas de arquitectura AWS
    │   ├── Contact.jsx           # Formulario + EarthCanvas
    │   └── canvas/               # Componentes Three.js (ComputersCanvas, EarthCanvas, StarsCanvas, BallCanvas)
    ├── constants/
    │   └── index.js              # Datos centralizados (navLinks, services, technologies, experiences, technicalDecisions, projects)
    ├── hoc/
    │   └── SectionWrapper.jsx    # HOC que envuelve secciones con animación stagger + hash anchor
    └── utils/
        └── motion.js             # Variantes Framer Motion (textVariant, fadeIn, zoomIn, slideIn, staggerContainer)
```

## Convenciones del código

- **Animaciones**: Framer Motion via `textVariant`, `fadeIn`, `zoomIn`, `slideIn`, `staggerContainer` desde `utils/motion.js`
- **Wrapper de secciones**: `SectionWrapper(Component, "id")` desde `hoc/SectionWrapper.jsx` — provee `#id` anchor + animación stagger
- **Estilos**: Clases Tailwind + constantes desde `styles.js` (`sectionHeadText`, `sectionSubText`, `padding`, `heroHeadText`, `heroSubText`)
- **Datos**: Mayoritariamente en `constants/index.js`; secciones nuevas con data inline (ValidatedExperience, AwsArchitecture)
- **Paleta**: `bg-primary` (oscuro), `bg-tertiary` (gris), `bg-black-200` (negro), `text-[#915EFF]` (acento púrpura)
- **Three.js**: Componentes canvas en `components/canvas/`, usan `@react-three/fiber` + `@react-three/drei`
- **Routing**: `BrowserRouter` de `react-router-dom` (aunque es SPA de una sola página, se usa para enrutamiento base)

## Estado actual (QA pass — 71/72 tests)

- **Build**: 1579 modules, 0 errores
- **Desktop**: 24/24 tests ✅
- **Tablet**: 24/24 tests ✅
- **Mobile**: 23/24 tests ✅ (navbar link oculto en menú hamburguesa — esperado)
- **Consola**: Sin errores críticos (warnings de findDOMNode/react-tilt y computeBoundingSphere/Three.js filtrados como no-bloqueantes)
