import React from "react";
import Tilt from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const ServiceCard = ({ index, title, icon }) => (
  <Tilt className='xs:w-[250px] w-full'>
    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      className='w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card'
    >
      <div
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className='bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col'
      >
        <img
          src={icon}
          alt='web-development'
          className='w-16 h-16 object-contain'
        />

        <h3 className='text-white text-[20px] font-bold text-center'>
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
        <p className={styles.sectionSubText}>Infomación</p>
        <h2 className={styles.sectionHeadText}>Sobre mi: </h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
      >Estudiante de último año de Ingeniería en Tecnologías de la Información con experiencia en administración de servidores y
        contenedores Docker bajo entornos modulares. Amplio conocimiento en marcos de trabajo como SCRUM y UML, así como
        en soporte técnico integral (hardware, impresoras y mantenimiento de computadoras). 
      </motion.p> 
      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
      >Especialista en mantenimiento de
        servidores, respaldo de bases de datos en ambientes productivos y en la conceptualización y diagramación de
        infraestructuras de software. Habilidad para evaluar la viabilidad e impacto de nuevos módulos dentro de un ERP,
        implementando mejoras que optimizan tiempos de carga y usabilidad. Experto en diseño y normalización de bases de
        datos, optimización de consultas SQL y automatización de pruebas, garantizando calidad y eficiencia en el desarrollo de
        software.
      </motion.p>
      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-4 text-secondary text-[24px] max-w-3xl leading-[30px]'
      ></motion.p>

      <div className='mt-20 flex flex-wrap gap-10'>
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
