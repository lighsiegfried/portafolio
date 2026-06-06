import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { technicalDecisions } from "../constants";

const TechnicalCard = ({ index, title, description }) => (
  <motion.div
    variants={fadeIn("", "spring", index * 0.5, 0.75)}
    className='bg-black-200 p-6 sm:p-10 rounded-3xl xs:w-[320px] w-full'
  >
    <p className='text-white font-black text-[48px] font-mono'>{`</>`}</p>

    <div className='mt-1'>
      <p className='text-white font-bold text-[18px]'>{title}</p>
      <p className='mt-4 text-secondary text-[14px] leading-[24px]'>
        {description}
      </p>
    </div>
  </motion.div>
);

const TechnicalDecisions = () => {
  return (
    <div className={`mt-8 sm:mt-12 bg-black-100 rounded-[20px]`}>
      <div
        className={`bg-tertiary rounded-2xl ${styles.padding} min-h-[200px] sm:min-h-[300px]`}
      >
        <motion.div variants={textVariant()}>
          <p className={styles.sectionSubText}>Criterio técnico</p>
          <h2 className={styles.sectionHeadText}>Decisiones técnicas</h2>
        </motion.div>

        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
        >
          Más que mostrar solo tecnologías, este portafolio documenta decisiones de arquitectura, despliegue y mantenimiento tomadas para construir soluciones más estables, seguras y fáciles de evolucionar.
        </motion.p>
      </div>

      <div className={`-mt-10 sm:-mt-20 pb-10 sm:pb-14 ${styles.paddingX} flex flex-wrap gap-5 sm:gap-7`}>
        {technicalDecisions.map((decision, index) => (
          <TechnicalCard key={decision.title} index={index} {...decision} />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(TechnicalDecisions, "decisions");
