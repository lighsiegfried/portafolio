import React from "react";
import { motion } from "framer-motion";
import { SiGithubactions, SiTerraform, SiReact } from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { FiCloud, FiServer, FiShield, FiUsers, FiLock, FiDatabase, FiActivity } from "react-icons/fi";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const architectures = [
  {
    title: "Arquitectura actual",
    description:
      "Frontend React/Vite desplegado como sitio estático, distribuido mediante Amazon CloudFront desde un origen S3 privado con Origin Access Control. La capa de seguridad puede complementarse con AWS WAF para protección a nivel de aplicación.",
    nodes: [
      { icon: FiUsers, label: "Usuario", color: "#aaa6c3" },
      { icon: FiCloud, label: "CloudFront", color: "#FF9900" },
      { icon: FaAws, label: "S3 privado + OAC", color: "#FF9900" },
      { icon: FiLock, label: "WAF", color: "#FF9900" },
      { icon: SiReact, label: "React/Vite SPA", color: "#61DAFB" },
    ],
    tags: ["S3", "CloudFront", "OAC", "WAF", "React", "Vite"],
  },
  {
    title: "Evolución serverless",
    description:
      "La siguiente fase agregará una API serverless para un Mini ERP/CRM Lite, usando API Gateway, Lambda, DynamoDB, CloudWatch, IAM y despliegue automatizado con GitHub Actions OIDC.",
    nodes: [
      { icon: FiUsers, label: "Usuario", color: "#aaa6c3" },
      { icon: FiCloud, label: "CloudFront", color: "#FF9900" },
      { icon: FaAws, label: "S3", color: "#FF9900" },
      { icon: FiServer, label: "API Gateway", color: "#FF9900" },
      { icon: FaAws, label: "Lambda", color: "#FF9900" },
      { icon: FiDatabase, label: "DynamoDB", color: "#FF9900" },
      { icon: FiActivity, label: "CloudWatch", color: "#FF9900" },
      { icon: SiGithubactions, label: "GitHub Actions", color: "#2088FF" },
      { icon: SiTerraform, label: "Terraform", color: "#7B42BC" },
    ],
    tags: ["API Gateway", "Lambda", "DynamoDB", "IAM", "CloudWatch", "Terraform", "GitHub Actions"],
  },
  {
    title: "Objetivo técnico",
    description:
      "Demostrar una solución pequeña, documentada y mantenible que valide conocimientos de frontend, backend, cloud, seguridad, CI/CD, infraestructura como código y arquitectura empresarial.",
    nodes: [
      { icon: SiReact, label: "Frontend", color: "#61DAFB" },
      { icon: FiServer, label: "Backend", color: "#339933" },
      { icon: FaAws, label: "Cloud", color: "#FF9900" },
      { icon: FiShield, label: "Seguridad", color: "#804dee" },
      { icon: SiGithubactions, label: "CI/CD", color: "#2088FF" },
      { icon: SiTerraform, label: "IaC", color: "#7B42BC" },
    ],
    tags: [],
  },
];

const NodeIcon = ({ icon: Icon, label, color, index }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
    className="flex flex-col items-center gap-1.5"
  >
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl border backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:shadow-lg"
      style={{
        borderColor: `${color}30`,
        backgroundColor: `${color}08`,
        color: color,
      }}
    >
      <Icon />
    </div>
    <span className="text-[10px] text-secondary text-center leading-tight max-w-[80px]">
      {label}
    </span>
  </motion.div>
);

const ArchitectureCard = ({ index, title, description, nodes, tags }) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <div className='bg-tertiary/40 backdrop-blur-sm border border-white/5 p-5 sm:p-6 rounded-2xl sm:xs:w-[380px] w-full flex flex-col h-full'>
        <h3 className='text-white font-bold text-[22px]'>{title}</h3>
        <p className='mt-3 text-secondary text-[14px] leading-[24px]'>
          {description}
        </p>

        {nodes.length > 0 && (
          <div className='mt-5 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-1.5 p-4 bg-black-100/50 rounded-xl border border-white/5'>
            {nodes.map((node, i) => (
              <React.Fragment key={node.label}>
                {i > 0 && (
                  <div className="flex items-center justify-center sm:rotate-0 rotate-90 shrink-0" style={{ width: 16, height: 16 }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 8H13" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M10 5L13 8L10 11" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
                <NodeIcon icon={node.icon} label={node.label} color={node.color} index={i} />
              </React.Fragment>
            ))}
          </div>
        )}

        {tags.length > 0 && (
          <div className='mt-auto pt-4 flex flex-wrap gap-2'>
            {tags.map((tag) => (
              <span
                key={tag}
                className='text-[11px] bg-black-200/80 text-secondary px-2.5 py-1 rounded-full border border-white/5'
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const AwsArchitecture = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Cloud architecture</p>
        <h2 className={styles.sectionHeadText}>Arquitectura AWS</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
      >
        Este portafolio no solo funciona como presentación profesional; también evoluciona como laboratorio cloud para demostrar despliegue, seguridad, automatización e infraestructura como código.
      </motion.p>

      <div className='mt-10 sm:mt-20 flex flex-col sm:flex-row flex-wrap gap-5 sm:gap-7 justify-center'>
        {architectures.map((arch, index) => (
          <ArchitectureCard key={arch.title} index={index} {...arch} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(AwsArchitecture, "architecture");
