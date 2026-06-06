import React from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const areas = [
  {
    title: "Cloud & DevOps",
    description:
      "Despliegue y administración de soluciones en AWS, contenedores Docker, CI/CD con GitHub Actions, gestión IAM, CloudFront, ECS/ECR, EC2 y prácticas de mínimo privilegio.",
    tags: ["AWS", "Docker", "GitHub Actions", "IAM", "CloudFront", "ECS", "ECR", "EC2"],
  },
  {
    title: "Sistemas empresariales",
    description:
      "Diseño y desarrollo de módulos ERP/CRM orientados a compras, requisiciones, inventario, reportería, aprobaciones y operación administrativa.",
    tags: ["ERP", "CRM", "SQL", "APIs REST", "Requisiciones", "Inventario", "Reportes"],
  },
  {
    title: "Infraestructura & continuidad",
    description:
      "Administración de servidores Linux, respaldo de información, documentación técnica, bases de conocimiento, estrategias BCP/DRP y soporte a operación crítica.",
    tags: ["Linux", "BCP/DRP", "Backups 3-2-1", "NAS", "Documentación", "Power BI"],
  },
];

const AreaCard = ({ index, title, description, tags }) => (
  <Tilt tiltMaxAngleX={45} tiltMaxAngleY={45} scale={1} transitionSpeed={450} className='xs:w-[320px] w-full'>
    <motion.div
      variants={fadeIn("up", "spring", index * 0.5, 0.75)}
      className='w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card'
    >
      <div className='bg-tertiary rounded-[20px] py-6 sm:py-8 px-5 sm:px-6 min-h-[200px] sm:min-h-[300px] flex flex-col'>
        <h3 className='text-white font-bold text-[24px]'>{title}</h3>
        <p className='mt-4 text-secondary text-[14px] leading-[24px]'>
          {description}
        </p>
        <div className='mt-6 flex flex-wrap gap-2'>
          {tags.map((tag) => (
            <span
              key={tag}
              className='text-[12px] bg-black-200 text-secondary px-3 py-1 rounded-full'
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  </Tilt>
);

const ValidatedExperience = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Áreas de experiencia</p>
        <h2 className={styles.sectionHeadText}>Experiencia técnica validada</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
      >
        Estas áreas resumen el tipo de problemas técnicos en los que he trabajado: modernización de sistemas, infraestructura cloud, automatización, continuidad operativa y desarrollo de soluciones empresariales.
      </motion.p>

      <div className='mt-10 sm:mt-20 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-7'>
        {areas.map((area, index) => (
          <AreaCard key={area.title} index={index} {...area} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(ValidatedExperience, "validated");
