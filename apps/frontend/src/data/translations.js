/**
 * Bilingual UI dictionary (Spanish / English).
 *
 * Division of responsibility:
 *   - THIS FILE owns copy that would otherwise be hardcoded inside a component:
 *     section badges, headings, subtitles, static paragraphs, card copy defined
 *     in the component file, form labels, button labels and aria-labels.
 *   - `src/constants/index.js` owns data-driven content (nav data, services,
 *     experiences, projects + case studies, technicalDecisions). There every
 *     translatable string is a `{ es, en }` leaf resolved with `useLocalized`.
 *
 * Consumed as `const { t } = useLanguage()` then `t.<namespace>.<key>`.
 * Both language trees MUST keep the exact same key set and array lengths.
 *
 * Placeholders: several values embed one or more `{token}`s the component
 * replaces at render time. Never build these strings by concatenation — word
 * order differs between languages. Tokens in use:
 *   - `{title}` — `certifications.badgeAlt`, `about.serviceIconAlt`
 *   - `{name}`  — `projects.downloadAria`, `projects.githubAria`,
 *                 `projects.demoAria`, `projects.demoAriaExternal`,
 *                 `projects.imageAltFallback`
 *   - `{label}` — `projects.downloadAria`, `projects.downloadApkAria`,
 *                 `caseStudy.downloadAria` (the resolved download button label)
 *   - `{count}` — `contact.charsRemaining`, `contact.charsMissing`,
 *                 `contact.charsCounter`
 *   - `{min}` / `{max}` — the `contact.validation*` messages,
 *                 `contact.limitReached`, `contact.charsCounter`
 *   - `{progress}` — `common.loadingPercent`
 */

/**
 * @typedef {Object} NavCopy
 * @property {string} about
 * @property {string} experience
 * @property {string} techStack
 * @property {string} certifications
 * @property {string} projects
 * @property {string} architecture
 * @property {string} contact
 * @property {string} erpDemo
 * @property {string} toggleTheme
 * @property {string} toggleLanguage
 * @property {string} openMenu
 * @property {string} closeMenu
 */

/**
 * @typedef {Object} HeroCopy
 * @property {string} greeting greeting prefix only; `Hero.jsx` renders it followed by
 *   `name` in an accent-coloured span, so it must NOT repeat the name
 * @property {string} name
 * @property {string} title
 * @property {string} subtitle
 * @property {string} scrollHint
 */

/**
 * @typedef {Object} AboutTags
 * @property {string} fullstack
 * @property {string} cloud
 * @property {string} erp
 * @property {string} ai
 */

/**
 * @typedef {Object} AboutCopy
 * @property {string} badge
 * @property {string} title
 * @property {string} bioP1
 * @property {string} bioP2
 * @property {string} serviceIconAlt alt-text template for the ServiceCard icon,
 *   containing a `{title}` placeholder
 * @property {AboutTags} tags
 */

/**
 * @typedef {Object} TechAreaCard
 * @property {TechAreaId} id language-independent React key. MUST be identical
 *   across `es` and `en` for the same card: `ValidatedExperience.jsx` keys the
 *   grid on it, and a key that changes with the language remounts the card
 *   inside a `viewport={{ once: true }}` section, which leaves it stuck on the
 *   `hidden` variant (opacity 0) until a full page reload.
 * @property {string} title
 * @property {string} description
 * @property {string[]} tags
 */

/**
 * @typedef {"cloud-devops" | "enterprise-systems" | "infrastructure-continuity"} TechAreaId
 */

/**
 * @typedef {Object} TechAreasCopy
 * @property {string} badge
 * @property {string} title
 * @property {string} subtitle
 * @property {TechAreaCard[]} areas three cards, same order as ValidatedExperience.jsx
 */

/**
 * @typedef {Object} ExperienceCopy
 * @property {string} badge
 * @property {string} title
 */

/**
 * @typedef {Object} TechStackCategoryTitles
 * @property {string} frontend
 * @property {string} backend
 * @property {string} cloud
 * @property {string} data
 * @property {string} ai
 */

/**
 * @typedef {Object} TechStackSkillLabels
 * @property {string} internalAgents
 * @property {string} documentAutomation
 * @property {string} assistedWorkflows
 */

/**
 * @typedef {Object} TechStackCopy
 * @property {string} badge
 * @property {string} title
 * @property {string} subtitle
 * @property {TechStackCategoryTitles} categoryTitles
 * @property {TechStackSkillLabels} skillLabels
 */

/**
 * @typedef {Object} CertificationsCopy
 * @property {string} badge
 * @property {string} title
 * @property {string} subtitle
 * @property {string} filterAll
 * @property {string} catCloud
 * @property {string} catSecurity
 * @property {string} catNetworking
 * @property {string} catDataIot
 * @property {string} emptyCategory
 * @property {string} filterLabel aria-label for the category chip group
 * @property {string} verifyBadge
 * @property {string} viewCredlyHub
 * @property {string} roadmapBadge eyebrow above the roadmap block
 * @property {string} roadmapTitle
 * @property {string} roadmapSubtitle
 * @property {string} statusEarned
 * @property {string} statusPrep
 * @property {string} noCredly shown instead of the verify link when credlyUrl is absent
 * @property {string} curriculumTarget card footer prefix
 * @property {string} badgeAlt alt-text template containing a `{title}` placeholder
 * @property {string} inspectBadge accessible name/tooltip for the badge zoom trigger,
 *   containing a `{title}` placeholder
 * @property {string} detailBadge eyebrow above the badge-detail dialog title
 * @property {string} closeDetail aria-label for the badge-detail dialog close button
 */

/**
 * @typedef {Object} ProjectsCopy
 * @property {string} badge
 * @property {string} title
 * @property {string} subtitle
 * @property {string} viewCaseStudy
 * @property {string} liveDemo
 * @property {string} githubRepo
 * @property {string} downloadApp
 * @property {string} downloadUnavailable long "temporarily unavailable" copy used
 *   by the standalone APK CTA in `Works.jsx`
 * @property {string} downloadHint
 * @property {string} demoTitle title attribute of the floating demo icon
 * @property {string} downloadUnavailableShort compact disabled label used by
 *   `ProjectActionBar.jsx`
 * @property {string} openDemo action-bar label for the demo action
 * @property {string} downloadAria aria-label template, `{label}` + `{name}`
 * @property {string} downloadApkAria aria-label template for the standalone APK
 *   CTA in `Works.jsx`, `{label}`
 * @property {string} githubAria aria-label template, `{name}`
 * @property {string} demoAria aria-label template for an internal demo, `{name}`
 * @property {string} demoAriaExternal aria-label template for an external demo,
 *   `{name}`
 * @property {string} imageAltFallback alt text used when a project has no
 *   `image_alt`, `{name}`
 * @property {string} sourceCodeIconAlt alt text of the floating GitHub icon
 */

/**
 * @typedef {Object} DecisionsCopy
 * @property {string} badge
 * @property {string} title
 * @property {string} subtitle
 */

/**
 * @typedef {Object} ArchitectureCard
 * @property {string} title
 * @property {string} description
 * @property {string[]} tags may be empty
 */

/**
 * @typedef {Object} ArchitectureNodeLabels
 * Labels for the diagram nodes rendered inside each architecture card. The icon
 * components stay in `AwsArchitecture.jsx`; only the label is looked up here, by
 * key, so node order can change without touching the dictionary.
 * @property {string} user
 * @property {string} cloudfront
 * @property {string} s3Private
 * @property {string} waf
 * @property {string} spa
 * @property {string} s3
 * @property {string} apiGateway
 * @property {string} lambda
 * @property {string} dynamodb
 * @property {string} cloudwatch
 * @property {string} githubActions
 * @property {string} terraform
 * @property {string} frontend
 * @property {string} backend
 * @property {string} cloud
 * @property {string} security
 * @property {string} cicd
 * @property {string} iac
 */

/**
 * @typedef {Object} ArchitectureCopy
 * @property {string} badge
 * @property {string} title
 * @property {string} subtitle
 * @property {ArchitectureCard[]} cards three cards, same order as AwsArchitecture.jsx
 * @property {ArchitectureNodeLabels} nodeLabels
 * @property {string} flowArrowAlt accessible description of the connector arrow
 *   drawn between two diagram nodes
 */

/**
 * @typedef {Object} CaseStudyCopy
 * @property {string} overview
 * @property {string} problem
 * @property {string} solution
 * @property {string} architecture
 * @property {string} capabilities
 * @property {string} decisions
 * @property {string} metrics
 * @property {string} stack
 * @property {string} results
 * @property {string} links
 * @property {string} close
 * @property {string} role
 * @property {string} status
 * @property {string} integrations
 * @property {string} flows
 * @property {string} security legacy-body heading
 * @property {string} quality legacy-body heading
 * @property {string} limitations legacy-body heading
 * @property {string} reason inline label prefix, keeps its trailing space
 * @property {string} tradeoff inline label prefix, keeps its trailing space
 * @property {string} downloadAndroid default download button label
 * @property {string} downloadAria aria-label template, `{label}`
 * @property {string} downloadUnavailable disabled download fallback
 * @property {string} viewGithub
 * @property {string} viewGithubAria
 * @property {string} openMiniErp internal-demo label
 * @property {string} openDemo external-demo label
 */

/**
 * @typedef {Object} ContactCopy
 * @property {string} badge
 * @property {string} title
 * @property {string} nameLabel
 * @property {string} namePlaceholder
 * @property {string} emailLabel
 * @property {string} emailPlaceholder
 * @property {string} messageLabel
 * @property {string} messagePlaceholder
 * @property {string} charsRemaining template containing a `{count}` placeholder
 * @property {string} sendButton
 * @property {string} sending
 * @property {string} successMessage
 * @property {string} errorMessage generic send-failure banner
 * @property {string} validationRequired generic fallback, kept for compatibility
 * @property {string} validationEmail generic fallback, kept for compatibility
 * @property {string} validationNameRequired
 * @property {string} validationNameMin `{min}`
 * @property {string} validationNameMax `{max}`
 * @property {string} validationEmailRequired
 * @property {string} validationEmailInvalid
 * @property {string} validationEmailMax `{max}`
 * @property {string} validationMessageRequired
 * @property {string} validationMessageMin `{min}`
 * @property {string} validationMessageMax `{max}`
 * @property {string} charsMissing `{count}` — chars still needed to reach MIN_MESSAGE
 * @property {string} charsCounter `{count}` + `{max}` — the "n / max" readout
 * @property {string} limitReached `{max}` — shown once the textarea hits MAX_MESSAGE
 */

/**
 * @typedef {Object} FooterCopy
 * @property {string} tagline
 * @property {string} quickLinks
 * @property {string} connect heading above the external-profile column
 * @property {string} credly
 * @property {string} github
 * @property {string} linkedin
 * @property {string} rights
 * @property {string} builtWith
 */

/**
 * @typedef {Object} CommonCopy
 * @property {string} loading
 * @property {string} error
 * @property {string} retry
 * @property {string} openInNewTab
 * @property {string} language
 * @property {string} theme
 * @property {string} light
 * @property {string} dark
 * @property {string} loadingScene aria-label for the Three.js canvas loader
 * @property {string} loadingPercent `{progress}` — the loader percentage readout
 * @property {string} sceneUnavailable ErrorBoundary fallback copy for a canvas
 *   that failed to mount
 */

/**
 * @typedef {Object} ErpCopy
 * @property {string} backToPortfolio
 * @property {string} demoBanner
 * @property {string} language
 * @property {string} theme
 */

/**
 * The full copy tree for a single language. `useLanguage().t` is one of these.
 *
 * @typedef {Object} TranslationSchema
 * @property {NavCopy} nav
 * @property {HeroCopy} hero
 * @property {AboutCopy} about
 * @property {TechAreasCopy} techAreas
 * @property {ExperienceCopy} experience
 * @property {TechStackCopy} techStack
 * @property {CertificationsCopy} certifications
 * @property {ProjectsCopy} projects
 * @property {DecisionsCopy} decisions
 * @property {ArchitectureCopy} architecture
 * @property {CaseStudyCopy} caseStudy
 * @property {ContactCopy} contact
 * @property {FooterCopy} footer
 * @property {CommonCopy} common
 * @property {ErpCopy} erp
 */

/** @type {{ es: TranslationSchema, en: TranslationSchema }} */
export const translations = {
  es: {
    nav: {
      about: "Sobre mí",
      experience: "Experiencia",
      techStack: "Tecnologías",
      certifications: "Certificaciones",
      projects: "Proyectos",
      architecture: "Arquitectura",
      contact: "Contacto",
      erpDemo: "ERP Demo",
      toggleTheme: "Cambiar tema",
      toggleLanguage: "Cambiar idioma",
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
    },

    hero: {
      greeting: "Hola, soy",
      name: "Wilson Vasquez",
      title: "Software Engineer enfocado en sistemas empresariales, cloud e IA",
      subtitle:
        "Construyo soluciones full-stack, automatizaciones y arquitecturas cloud pensadas para operación real.",
      scrollHint: "Desplázate para explorar",
    },

    about: {
      badge: "Información",
      title: "Sobre mí",
      bioP1:
        "Soy estudiante de último año de Ingeniería en Sistemas y Ciencias de la Computación, con experiencia desarrollando y modernizando sistemas empresariales, módulos ERP/CRM y soluciones internas para operación. He trabajado en entornos donde el software debe ser estable, documentado y útil para áreas como compras, inventario, reportería, infraestructura y soporte operativo.",
      bioP2:
        "Mi enfoque combina desarrollo full-stack, optimización SQL, administración de servidores Linux, contenedores Docker, automatización con IA y despliegues en AWS. Me interesa construir soluciones claras, mantenibles y bien documentadas, especialmente cuando conectan software, infraestructura y procesos de negocio.",
      serviceIconAlt: "Icono de {title}",
      tags: {
        fullstack: "Full-Stack Developer",
        cloud: "Cloud & DevOps",
        erp: "Sistemas ERP / CRM",
        ai: "IA & Automatización",
      },
    },

    techAreas: {
      badge: "Áreas de experiencia",
      title: "Experiencia técnica validada",
      subtitle:
        "Estas áreas resumen el tipo de problemas técnicos en los que he trabajado: modernización de sistemas, infraestructura cloud, automatización, continuidad operativa y desarrollo de soluciones empresariales.",
      areas: [
        {
          id: "cloud-devops",
          title: "Cloud & DevOps",
          description:
            "Despliegue y administración de soluciones en AWS, contenedores Docker, CI/CD con GitHub Actions, gestión IAM, CloudFront, ECS/ECR, EC2 y prácticas de mínimo privilegio.",
          tags: ["AWS", "Docker", "GitHub Actions", "IAM", "CloudFront", "ECS", "ECR", "EC2"],
        },
        {
          id: "enterprise-systems",
          title: "Sistemas empresariales",
          description:
            "Diseño y desarrollo de módulos ERP/CRM orientados a compras, requisiciones, inventario, reportería, aprobaciones y operación administrativa.",
          tags: ["ERP", "CRM", "SQL", "APIs REST", "Requisiciones", "Inventario", "Reportes"],
        },
        {
          id: "infrastructure-continuity",
          title: "Infraestructura & continuidad",
          description:
            "Administración de servidores Linux, respaldo de información, documentación técnica, bases de conocimiento, estrategias BCP/DRP y soporte a operación crítica.",
          tags: ["Linux", "BCP/DRP", "Backups 3-2-1", "NAS", "Documentación", "Power BI"],
        },
      ],
    },

    experience: {
      badge: "Logros y responsabilidades",
      title: "Experiencia",
    },

    techStack: {
      badge: "Stack tecnológico",
      title: "Tecnologías",
      subtitle:
        "Tecnologías con las que he trabajado en producción, proyectos personales y laboratorio técnico.",
      categoryTitles: {
        frontend: "Frontend",
        backend: "Backend & APIs",
        cloud: "Cloud & DevOps",
        data: "Data & BI",
        ai: "AI & Automation",
      },
      skillLabels: {
        internalAgents: "Agentes internos",
        documentAutomation: "Automatización documental",
        assistedWorkflows: "Flujos asistidos",
      },
    },

    certifications: {
      badge: "Credenciales & Validaciones",
      title: "Certificaciones Profesionales",
      subtitle:
        "Validaciones técnicas oficiales emitidas por organizaciones líderes de la industria tecnológica.",
      filterAll: "Todas",
      catCloud: "Cloud",
      catSecurity: "Seguridad",
      catNetworking: "Redes",
      catDataIot: "Datos e IoT",
      emptyCategory: "No hay certificaciones en esta categoría.",
      filterLabel: "Filtrar certificaciones por categoría",
      verifyBadge: "Verificar en Credly",
      viewCredlyHub: "Ver Cartera de Insignias en Credly",
      roadmapBadge: "Hoja de ruta",
      roadmapTitle: "Próximas Certificaciones & Seguridad",
      roadmapSubtitle:
        "Hoja de ruta activa orientada al diseño de arquitecturas cloud resilientes y gobernanza de ciberseguridad.",
      statusEarned: "Obtenida",
      statusPrep: "En Preparación",
      noCredly: "Credencial emitida por el instituto",
      curriculumTarget: "Objetivo curricular:",
      badgeAlt: "Insignia de {title}",
      inspectBadge: "Ampliar la credencial {title}",
      detailBadge: "Detalle de la credencial",
      closeDetail: "Cerrar el detalle de la credencial",
    },

    projects: {
      badge: "Evidencia técnica",
      title: "Casos de estudio y proyectos",
      subtitle:
        "Estos proyectos muestran diferentes etapas de mi experiencia: desde sistemas empresariales y arquitectura cloud hasta proyectos iniciales que forman parte de mi base técnica.",
      viewCaseStudy: "Ver caso de estudio",
      liveDemo: "Abrir demo",
      githubRepo: "GitHub",
      downloadApp: "Descargar app",
      downloadUnavailable: "Descarga temporalmente no disponible",
      downloadHint: "APK oficial · descarga directa",
      demoTitle: "Ver demo",
      downloadUnavailableShort: "Descarga no disponible",
      openDemo: "Abrir demo",
      downloadAria: "{label} de {name}, se abre en una nueva pestaña",
      downloadApkAria: "{label}, APK oficial, se abre en una nueva pestaña",
      githubAria: "Ver el repositorio de {name} en GitHub, se abre en una nueva pestaña",
      demoAria: "Abrir demo de {name}",
      demoAriaExternal: "Abrir demo de {name}, se abre en una nueva pestaña",
      imageAltFallback: "Vista previa del proyecto {name}",
      sourceCodeIconAlt: "Código fuente",
    },

    decisions: {
      badge: "Criterio técnico",
      title: "Decisiones técnicas",
      subtitle:
        "Más que mostrar solo tecnologías, este portafolio documenta decisiones de arquitectura, despliegue y mantenimiento tomadas para construir soluciones más estables, seguras y fáciles de evolucionar.",
    },

    architecture: {
      badge: "Cloud architecture",
      title: "Arquitectura AWS",
      subtitle:
        "Este portafolio no solo funciona como presentación profesional; también evoluciona como laboratorio cloud para demostrar despliegue, seguridad, automatización e infraestructura como código.",
      cards: [
        {
          title: "Arquitectura actual",
          description:
            "Frontend React/Vite desplegado como sitio estático, distribuido mediante Amazon CloudFront desde un origen S3 privado con Origin Access Control. La capa de seguridad puede complementarse con AWS WAF para protección a nivel de aplicación.",
          tags: ["S3", "CloudFront", "OAC", "WAF", "React", "Vite"],
        },
        {
          title: "Evolución serverless",
          description:
            "La siguiente fase agregará una API serverless para un Mini ERP/CRM Lite, usando API Gateway, Lambda, DynamoDB, CloudWatch, IAM y despliegue automatizado con GitHub Actions OIDC.",
          tags: [
            "API Gateway",
            "Lambda",
            "DynamoDB",
            "IAM",
            "CloudWatch",
            "Terraform",
            "GitHub Actions",
          ],
        },
        {
          title: "Objetivo técnico",
          description:
            "Demostrar una solución pequeña, documentada y mantenible que valide conocimientos de frontend, backend, cloud, seguridad, CI/CD, infraestructura como código y arquitectura empresarial.",
          tags: [],
        },
      ],
      nodeLabels: {
        user: "Usuario",
        cloudfront: "CloudFront",
        s3Private: "S3 privado + OAC",
        waf: "WAF",
        spa: "React/Vite SPA",
        s3: "S3",
        apiGateway: "API Gateway",
        lambda: "Lambda",
        dynamodb: "DynamoDB",
        cloudwatch: "CloudWatch",
        githubActions: "GitHub Actions",
        terraform: "Terraform",
        frontend: "Frontend",
        backend: "Backend",
        cloud: "Cloud",
        security: "Seguridad",
        cicd: "CI/CD",
        iac: "IaC",
      },
      flowArrowAlt: "conecta con",
    },

    caseStudy: {
      overview: "Resumen",
      problem: "Problema",
      solution: "Solución",
      architecture: "Arquitectura",
      capabilities: "Capacidades de negocio",
      decisions: "Decisiones técnicas",
      metrics: "Métricas",
      stack: "Stack técnico",
      results: "Resultados",
      links: "Enlaces",
      close: "Cerrar caso de estudio",
      role: "Rol",
      status: "Estado",
      integrations: "Integraciones",
      flows: "Flujos",
      security: "Seguridad y fiabilidad",
      quality: "Calidad y DevOps",
      limitations: "Limitaciones y evolución",
      reason: "Motivo: ",
      tradeoff: "Compensación: ",
      downloadAndroid: "Descargar app para Android",
      downloadAria: "{label}, se abre en una nueva pestaña",
      downloadUnavailable: "Descarga temporalmente no disponible",
      viewGithub: "Ver código en GitHub",
      viewGithubAria: "Ver código en GitHub, se abre en una nueva pestaña",
      openMiniErp: "Abrir Mini ERP",
      openDemo: "Abrir demo",
    },

    contact: {
      badge: "Ponte en contacto",
      title: "Contacto",
      nameLabel: "Tu nombre",
      namePlaceholder: "¿Cuál es tu nombre?",
      emailLabel: "Tu e-mail",
      emailPlaceholder: "¿Cuál es tu correo electrónico?",
      messageLabel: "Tu mensaje",
      messagePlaceholder: "¿En qué puedo ayudarte?",
      charsRemaining: "{count} caracteres restantes.",
      sendButton: "Enviar",
      sending: "Enviando...",
      successMessage: "Gracias, tu mensaje fue recibido correctamente.",
      errorMessage:
        "No pudimos enviar el mensaje en este momento. Intenta nuevamente más tarde.",
      validationRequired: "Este campo es requerido.",
      validationEmail: "Ingresa un correo electrónico válido.",
      validationNameRequired: "El nombre es requerido.",
      validationNameMin: "Tu nombre debe tener al menos {min} caracteres.",
      validationNameMax: "Tu nombre no puede superar {max} caracteres.",
      validationEmailRequired: "El correo electrónico es requerido.",
      validationEmailInvalid: "Ingresa un correo electrónico válido.",
      validationEmailMax: "El correo no puede superar {max} caracteres.",
      validationMessageRequired: "El mensaje es requerido.",
      validationMessageMin: "Tu mensaje debe tener al menos {min} caracteres.",
      validationMessageMax: "Tu mensaje no puede superar {max} caracteres.",
      charsMissing: "Faltan {count} caracteres para poder enviar.",
      charsCounter: "{count} / {max}",
      limitReached: "Tu mensaje llegó al límite de {max} caracteres.",
    },

    footer: {
      tagline: "Software Engineer enfocado en sistemas empresariales, cloud e IA.",
      quickLinks: "Enlaces rápidos",
      connect: "Conecta",
      credly: "Credly",
      github: "GitHub",
      linkedin: "LinkedIn",
      rights: "Todos los derechos reservados.",
      builtWith: "Construido con React, Vite, Three.js y AWS.",
    },

    common: {
      loading: "Cargando...",
      error: "Ocurrió un error.",
      retry: "Reintentar",
      openInNewTab: "Se abre en una nueva pestaña",
      language: "Idioma",
      theme: "Tema",
      light: "Claro",
      dark: "Oscuro",
      loadingScene: "Cargando escena 3D",
      loadingPercent: "{progress}%",
      sceneUnavailable: "No se pudo cargar el contenido 3D.",
    },

    erp: {
      backToPortfolio: "Volver al portafolio",
      demoBanner: "Entorno de demostración · los datos se reinician periódicamente.",
      language: "Idioma",
      theme: "Tema",
    },
  },

  en: {
    nav: {
      about: "About",
      experience: "Experience",
      techStack: "Tech Stack",
      certifications: "Certifications",
      projects: "Projects",
      architecture: "Architecture",
      contact: "Contact",
      erpDemo: "ERP Demo",
      toggleTheme: "Toggle theme",
      toggleLanguage: "Toggle language",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },

    hero: {
      greeting: "Hello, I'm",
      name: "Wilson Vasquez",
      title: "Software Engineer focused on Enterprise Systems, Cloud & AI",
      subtitle:
        "Building full-stack solutions, business automations, and cloud architectures engineered for real-world operations.",
      scrollHint: "Scroll to explore",
    },

    about: {
      badge: "Information",
      title: "About Me",
      bioP1:
        "I am a final-year Systems Engineering and Computer Science student with practical experience developing and modernizing enterprise platforms, ERP/CRM modules, and mission-critical internal operations. I have worked in environments where software must be stable, well-documented, and essential for procurement, inventory, reporting, infrastructure, and technical support.",
      bioP2:
        "My approach combines full-stack development, SQL optimization, Linux server management, Docker containers, AI automation, and AWS cloud deployments. I focus on building maintainable and well-documented systems connecting software, infrastructure, and business processes.",
      serviceIconAlt: "{title} icon",
      tags: {
        fullstack: "Full-Stack Developer",
        cloud: "Cloud & DevOps",
        erp: "ERP / CRM Systems",
        ai: "AI & Automation",
      },
    },

    techAreas: {
      badge: "Areas of Expertise",
      title: "Validated Technical Experience",
      subtitle:
        "Key technical domains: systems modernization, cloud infrastructure, business workflow automation, operational continuity, and enterprise software.",
      areas: [
        {
          id: "cloud-devops",
          title: "Cloud & DevOps",
          description:
            "Deployment and administration on AWS, Docker containers, GitHub Actions CI/CD, IAM governance, CloudFront, ECS/ECR, EC2, and least-privilege security practices.",
          tags: ["AWS", "Docker", "GitHub Actions", "IAM", "CloudFront", "ECS", "ECR", "EC2"],
        },
        {
          id: "enterprise-systems",
          title: "Enterprise Systems",
          description:
            "Design and engineering of custom ERP/CRM modules for purchasing, requisitions, inventory tracking, analytics reporting, and automated approval workflows.",
          tags: ["ERP", "CRM", "SQL", "REST APIs", "Requisitions", "Inventory", "Reports"],
        },
        {
          id: "infrastructure-continuity",
          title: "Infrastructure & Continuity",
          description:
            "Linux server administration, 3-2-1 backup strategies, technical knowledge base development, BCP/DRP planning, and mission-critical support.",
          tags: ["Linux", "BCP/DRP", "3-2-1 Backups", "NAS", "Documentation", "Power BI"],
        },
      ],
    },

    experience: {
      badge: "Track Record & Roles",
      title: "Experience",
    },

    techStack: {
      badge: "Tech Stack",
      title: "Technologies",
      subtitle:
        "Technologies utilized across production environments, personal projects, and cloud technical labs.",
      categoryTitles: {
        frontend: "Frontend",
        backend: "Backend & APIs",
        cloud: "Cloud & DevOps",
        data: "Data & BI",
        ai: "AI & Automation",
      },
      skillLabels: {
        internalAgents: "Internal Agents",
        documentAutomation: "Document Automation",
        assistedWorkflows: "Assisted Workflows",
      },
    },

    certifications: {
      badge: "Credentials & Badges",
      title: "Professional Certifications",
      subtitle:
        "Official industry credentials validating cloud engineering, cybersecurity, networking, and data architecture expertise.",
      filterAll: "All",
      catCloud: "Cloud",
      catSecurity: "Security",
      catNetworking: "Networking",
      catDataIot: "Data & IoT",
      emptyCategory: "No certifications in this category yet.",
      filterLabel: "Filter certifications by category",
      verifyBadge: "Verify on Credly",
      viewCredlyHub: "View Credly Badge Center",
      roadmapBadge: "Roadmap",
      roadmapTitle: "Upcoming Certifications & Security Roadmap",
      roadmapSubtitle:
        "Current development targets focused on resilient cloud architecture and enterprise cybersecurity audits.",
      statusEarned: "Verified",
      statusPrep: "In Progress",
      noCredly: "Credential issued by the institute",
      curriculumTarget: "Curriculum target:",
      badgeAlt: "{title} badge",
      inspectBadge: "Enlarge the {title} credential",
      detailBadge: "Credential detail",
      closeDetail: "Close credential detail",
    },

    projects: {
      badge: "Technical Evidence",
      title: "Case Studies and Projects",
      subtitle:
        "Key projects demonstrating full-stack engineering, cloud architecture, and enterprise business solutions.",
      viewCaseStudy: "View case study",
      liveDemo: "Live demo",
      githubRepo: "GitHub",
      downloadApp: "Download app",
      downloadUnavailable: "Download temporarily unavailable",
      downloadHint: "Official APK · direct download",
      demoTitle: "View demo",
      downloadUnavailableShort: "Download unavailable",
      openDemo: "Open demo",
      downloadAria: "{label} for {name}, opens in a new tab",
      downloadApkAria: "{label}, official APK, opens in a new tab",
      githubAria: "View the {name} repository on GitHub, opens in a new tab",
      demoAria: "Open the {name} demo",
      demoAriaExternal: "Open the {name} demo, opens in a new tab",
      imageAltFallback: "Preview of the {name} project",
      sourceCodeIconAlt: "Source code",
    },

    decisions: {
      badge: "Technical Judgement",
      title: "Technical Decisions",
      subtitle:
        "Beyond showcasing technologies, this portfolio documents the architecture, deployment, and maintenance decisions made to build solutions that are more stable, secure, and easier to evolve.",
    },

    architecture: {
      badge: "Cloud Architecture",
      title: "AWS Architecture",
      subtitle:
        "This portfolio serves as a live cloud engineering testbed demonstrating edge security, serverless compute, and Infrastructure as Code.",
      cards: [
        {
          title: "Current architecture",
          description:
            "React/Vite frontend deployed as a static site and distributed through Amazon CloudFront from a private S3 origin secured with Origin Access Control. The security layer can be extended with AWS WAF for application-level protection.",
          tags: ["S3", "CloudFront", "OAC", "WAF", "React", "Vite"],
        },
        {
          title: "Serverless evolution",
          description:
            "The next phase adds a serverless API for a Mini ERP/CRM Lite built on API Gateway, Lambda, DynamoDB, CloudWatch, IAM, and automated deployments through GitHub Actions OIDC.",
          tags: [
            "API Gateway",
            "Lambda",
            "DynamoDB",
            "IAM",
            "CloudWatch",
            "Terraform",
            "GitHub Actions",
          ],
        },
        {
          title: "Technical goal",
          description:
            "Demonstrate a small, documented, and maintainable solution that validates frontend, backend, cloud, security, CI/CD, infrastructure as code, and enterprise architecture skills.",
          tags: [],
        },
      ],
      nodeLabels: {
        user: "User",
        cloudfront: "CloudFront",
        s3Private: "Private S3 + OAC",
        waf: "WAF",
        spa: "React/Vite SPA",
        s3: "S3",
        apiGateway: "API Gateway",
        lambda: "Lambda",
        dynamodb: "DynamoDB",
        cloudwatch: "CloudWatch",
        githubActions: "GitHub Actions",
        terraform: "Terraform",
        frontend: "Frontend",
        backend: "Backend",
        cloud: "Cloud",
        security: "Security",
        cicd: "CI/CD",
        iac: "IaC",
      },
      flowArrowAlt: "connects to",
    },

    caseStudy: {
      overview: "Overview",
      problem: "Problem",
      solution: "Solution",
      architecture: "Architecture",
      capabilities: "Business capabilities",
      decisions: "Technical decisions",
      metrics: "Metrics",
      stack: "Tech stack",
      results: "Results",
      links: "Links",
      close: "Close case study",
      role: "Role",
      status: "Status",
      integrations: "Integrations",
      flows: "Flows",
      security: "Security and reliability",
      quality: "Quality and DevOps",
      limitations: "Limitations and roadmap",
      reason: "Reason: ",
      tradeoff: "Trade-off: ",
      downloadAndroid: "Download the Android app",
      downloadAria: "{label}, opens in a new tab",
      downloadUnavailable: "Download temporarily unavailable",
      viewGithub: "View code on GitHub",
      viewGithubAria: "View code on GitHub, opens in a new tab",
      openMiniErp: "Open Mini ERP",
      openDemo: "Open demo",
    },

    contact: {
      badge: "Get in touch",
      title: "Contact",
      nameLabel: "Your name",
      namePlaceholder: "What is your name?",
      emailLabel: "Your e-mail",
      emailPlaceholder: "What is your email address?",
      messageLabel: "Your message",
      messagePlaceholder: "How can I help you?",
      charsRemaining: "{count} characters remaining.",
      sendButton: "Send",
      sending: "Sending...",
      successMessage: "Thank you, your message was received successfully.",
      errorMessage: "We could not send your message right now. Please try again later.",
      validationRequired: "This field is required.",
      validationEmail: "Enter a valid email address.",
      validationNameRequired: "Your name is required.",
      validationNameMin: "Your name must be at least {min} characters long.",
      validationNameMax: "Your name cannot exceed {max} characters.",
      validationEmailRequired: "Your email address is required.",
      validationEmailInvalid: "Enter a valid email address.",
      validationEmailMax: "Your email cannot exceed {max} characters.",
      validationMessageRequired: "Your message is required.",
      validationMessageMin: "Your message must be at least {min} characters long.",
      validationMessageMax: "Your message cannot exceed {max} characters.",
      charsMissing: "{count} more characters needed before you can send.",
      charsCounter: "{count} / {max}",
      limitReached: "Your message reached the {max} character limit.",
    },

    footer: {
      tagline: "Software Engineer focused on enterprise systems, cloud and AI.",
      quickLinks: "Quick links",
      connect: "Connect",
      credly: "Credly",
      github: "GitHub",
      linkedin: "LinkedIn",
      rights: "All rights reserved.",
      builtWith: "Built with React, Vite, Three.js and AWS.",
    },

    common: {
      loading: "Loading...",
      error: "Something went wrong.",
      retry: "Retry",
      openInNewTab: "Opens in a new tab",
      language: "Language",
      theme: "Theme",
      light: "Light",
      dark: "Dark",
      loadingScene: "Loading 3D scene",
      loadingPercent: "{progress}%",
      sceneUnavailable: "The 3D content could not be loaded.",
    },

    erp: {
      backToPortfolio: "Back to portfolio",
      demoBanner: "Demo environment · data is reset periodically.",
      language: "Language",
      theme: "Theme",
    },
  },
};

export default translations;
