import React from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const ServiceCard = ({ index, title, icon }) => (
  <Tilt tiltMaxAngleX={45} tiltMaxAngleY={45} scale={1} transitionSpeed={450} className='w-full'>
    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      className='w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card'
    >
      <div className='bg-tertiary rounded-[20px] py-6 sm:py-5 px-6 sm:px-12 min-h-[220px] sm:min-h-[280px] flex justify-evenly items-center flex-col'>
        <img
          src={icon}
          alt='web-development'
          className='w-14 sm:w-16 h-14 sm:h-16 object-contain'
        />

        <h3 className='text-white text-[18px] sm:text-[20px] font-bold text-center'>
          {title}
        </h3>
      </div>
    </motion.div>
  </Tilt>
);

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Información</p>
        <h2 className={styles.sectionHeadText}>Sobre mí</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
      >
        Soy estudiante de último año de Ingeniería en Sistemas y Ciencias de la Computación, con experiencia desarrollando y
        modernizando sistemas empresariales, módulos ERP/CRM y soluciones internas para operación. He trabajado en entornos
        donde el software debe ser estable, documentado y útil para áreas como compras, inventario, reportería, infraestructura
        y soporte operativo.
      </motion.p>
      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
      >
        Mi enfoque combina desarrollo full-stack, optimización SQL, administración de servidores Linux, contenedores Docker,
        automatización con IA y despliegues en AWS. Me interesa construir soluciones claras, mantenibles y bien documentadas,
        especialmente cuando conectan software, infraestructura y procesos de negocio.
      </motion.p>

      <div className='mt-10 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
