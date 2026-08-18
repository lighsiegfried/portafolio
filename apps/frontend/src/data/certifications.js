import practitionerImg from "../assets/practitioner.png";
import serverlessImg from "../assets/serverless.png";
import networkingImg from "../assets/networking.png";
import lakehouseImg from "../assets/lakehouse.png";
import ciscoCyberImg from "../assets/itcy.png";
import ciscoIotImg from "../assets/Intro2IoT.png";
import vmwareImg from "../assets/cvc.png";

/**
 * @typedef {"CLOUD" | "SECURITY" | "NETWORKING" | "DATA_IOT"} CertCategoryKey
 * @typedef {"ALL" | CertCategoryKey} CertFilterKey
 *
 * @typedef {Object} Certification
 * @property {string} id
 * @property {{ es: string, en: string }} title
 * @property {string} issuer
 * @property {string | null} badgeImage local badge artwork, or null to render the icon fallback
 * @property {string} [credlyUrl] public verification link
 * @property {CertCategoryKey} categoryKey language-agnostic; the visible label is looked up in the dictionary
 * @property {"Earned" | "In-Progress"} status
 * @property {{ es: string, en: string }} description
 */

/** Public Credly badge wallet. */
export const CREDLY_PROFILE_URL = "https://www.credly.com/users/wilson-vasquez.09eff1d9/badges";

/**
 * Category label lookup, keyed by `categoryKey`.
 *
 * Filter identity and display text are deliberately decoupled: the key is a
 * stable, language-agnostic constant, and the label is resolved through
 * `t.certifications[labelKey]` at render time. Comparing localized labels
 * instead would make the filter silently match nothing the moment the UI is
 * switched to Spanish.
 *
 * @type {Record<CertCategoryKey, string>}
 */
export const CATEGORY_LABEL_KEYS = {
  CLOUD: "catCloud",
  SECURITY: "catSecurity",
  NETWORKING: "catNetworking",
  DATA_IOT: "catDataIot",
};

/**
 * Filter chips rendered above the grid, in display order.
 * @type {ReadonlyArray<{ key: CertFilterKey, labelKey: string }>}
 */
export const CERTIFICATION_CATEGORIES = [
  { key: "ALL", labelKey: "filterAll" },
  { key: "CLOUD", labelKey: "catCloud" },
  { key: "SECURITY", labelKey: "catSecurity" },
  { key: "NETWORKING", labelKey: "catNetworking" },
  { key: "DATA_IOT", labelKey: "catDataIot" },
];

/** @type {Certification[]} */
export const CERTIFICATIONS_LIST = [
  {
    id: "aws-cloud-practitioner",
    title: {
      es: "AWS Certified Cloud Practitioner",
      en: "AWS Certified Cloud Practitioner",
    },
    issuer: "Amazon Web Services (AWS)",
    badgeImage: practitionerImg,
    credlyUrl: "https://www.credly.com/badges/1762d7d7-b7c4-4b6d-b330-ee26ba2fd677",
    categoryKey: "CLOUD",
    status: "Earned",
    description: {
      es: "Validación de conceptos fundamentales de computación en la nube AWS, seguridad, arquitectura y modelo de precios.",
      en: "Validation of fundamental AWS cloud concepts, security, architecture, compliance, and billing models.",
    },
  },
  {
    id: "aws-serverless",
    title: {
      es: "AWS Serverless Demonstrated",
      en: "AWS Serverless Demonstrated",
    },
    issuer: "Amazon Web Services (AWS)",
    badgeImage: serverlessImg,
    credlyUrl: "https://www.credly.com/badges/4002953e-db22-4343-b14d-e94701e62948",
    categoryKey: "CLOUD",
    status: "Earned",
    description: {
      es: "Diseño e implementación de microservicios y soluciones serverless utilizando AWS Lambda, API Gateway y DynamoDB.",
      en: "Design and deployment of serverless microservices leveraging AWS Lambda, API Gateway, and DynamoDB.",
    },
  },
  {
    id: "aws-networking",
    title: {
      es: "AWS Application Networking Demonstrated",
      en: "AWS Application Networking Demonstrated",
    },
    issuer: "Amazon Web Services (AWS)",
    badgeImage: networkingImg,
    credlyUrl: "https://www.credly.com/badges/112a7984-6276-47d5-8146-bc34a3f8384d",
    categoryKey: "NETWORKING",
    status: "Earned",
    description: {
      es: "Configuración de conectividad de red segura para aplicaciones en la nube, VPCs, subnets, routing y políticas de aislamiento.",
      en: "Configuration of secure application networking on AWS, VPC topologies, subnets, routing, and isolation policies.",
    },
  },
  {
    id: "aws-lakehouse",
    title: {
      es: "AWS Data Lakehouse Demonstrated",
      en: "AWS Data Lakehouse Demonstrated",
    },
    issuer: "Amazon Web Services (AWS)",
    badgeImage: lakehouseImg,
    credlyUrl: "https://www.credly.com/badges/977d8d4b-f2e8-436e-9768-7224981099f3",
    categoryKey: "DATA_IOT",
    status: "Earned",
    description: {
      es: "Arquitecturas modernas de datos, almacenamiento escalable en S3, procesamiento analítico y gobernanza de información.",
      en: "Modern data lakehouse architectures, scalable S3 analytical storage, ETL processing, and data governance.",
    },
  },
  {
    id: "cisco-cybersecurity",
    title: {
      es: "Introduction to Cybersecurity",
      en: "Introduction to Cybersecurity",
    },
    issuer: "Cisco Networking Academy",
    badgeImage: ciscoCyberImg,
    credlyUrl: "https://www.credly.com/badges/389a5425-91c1-49b2-b944-1dcb5a6fc8cc",
    categoryKey: "SECURITY",
    status: "Earned",
    description: {
      es: "Fundamentos de seguridad informática, vectores de amenaza, mitigación de vulnerabilidades y defensa en profundidad.",
      en: "Cybersecurity fundamentals, threat vectors, vulnerability mitigation, and defense-in-depth methodologies.",
    },
  },
  {
    id: "cisco-iot",
    title: {
      es: "Introduction to IoT",
      en: "Introduction to IoT",
    },
    issuer: "Cisco Networking Academy",
    badgeImage: ciscoIotImg,
    credlyUrl: "https://www.credly.com/badges/a3a40138-88cb-4100-afc8-b029695bbff5",
    categoryKey: "DATA_IOT",
    status: "Earned",
    description: {
      es: "Interconexión de dispositivos inteligentes, protocolos de sensores, automatización y recolección de telemetría.",
      en: "Smart device interconnection, sensor protocols, telemetry ingestion, and IoT automation pipelines.",
    },
  },
  {
    id: "vmware-cloud",
    title: {
      es: "IT Academy: Cloud & Virtualization Concepts",
      en: "IT Academy: Cloud & Virtualization Concepts",
    },
    issuer: "VMware / IT Academy",
    badgeImage: vmwareImg,
    credlyUrl: "https://www.credly.com/badges/cb6bb6df-c275-4dd0-90b1-a2d1452ad37b",
    categoryKey: "CLOUD",
    status: "Earned",
    description: {
      es: "Conceptos clave de hipervisores, centros de datos definidos por software (SDDC), almacenamiento y redes virtuales.",
      en: "Core hypervisor virtualization concepts, Software-Defined Data Centers (SDDC), and virtual storage/networking.",
    },
  },
  {
    // No Fortinet badge artwork ships with the repo. Rather than reuse the
    // Cisco Cybersecurity badge (which would misrepresent the issuer), this
    // entry renders the neutral shield fallback in Certifications.jsx.
    id: "fortinet-nse",
    title: {
      es: "Fortinet NSE 1 & NSE 2 Network Security Associate",
      en: "Fortinet NSE 1 & NSE 2 Network Security Associate",
    },
    issuer: "Fortinet Training Institute",
    badgeImage: null,
    categoryKey: "SECURITY",
    status: "Earned",
    description: {
      es: "Panorama de amenazas de red, arquitectura de firewalls de próxima generación (NGFW) y seguridad perimetral.",
      en: "Threat landscape awareness, next-generation firewall (NGFW) capabilities, and network perimeter protection.",
    },
  },
];

/**
 * @typedef {Object} UpcomingCertification
 * @property {string} id
 * @property {{ es: string, en: string }} title
 * @property {string} issuer
 * @property {{ es: string, en: string }} focus
 * @property {string} target curriculum target year shown on the card footer
 */

/** @type {UpcomingCertification[]} */
export const UPCOMING_CERTIFICATIONS = [
  {
    id: "aws-saa",
    title: {
      es: "AWS Certified Solutions Architect – Associate (SAA-C03)",
      en: "AWS Certified Solutions Architect – Associate (SAA-C03)",
    },
    issuer: "Amazon Web Services",
    focus: {
      es: "Diseño de arquitecturas cloud resilientes, alta disponibilidad, tolerancia a fallos y optimización de costos en AWS.",
      en: "Designing resilient, high-performing, secure, and cost-optimized distributed AWS architectures.",
    },
    target: "2026",
  },
  {
    id: "iso-27001",
    title: {
      es: "ISO/IEC 27001 Seguridad de la Información & Auditoría IT",
      en: "ISO/IEC 27001 Information Security & IT Audit",
    },
    issuer: "ISO / IT Governance Institute",
    focus: {
      es: "Sistemas de Gestión de Seguridad de la Información (SGSI), análisis de riesgos, controles del Anexo A y auditoría de sistemas.",
      en: "Information Security Management Systems (ISMS), risk assessment frameworks, Annex A controls, and IT audit readiness.",
    },
    target: "2026",
  },
];
