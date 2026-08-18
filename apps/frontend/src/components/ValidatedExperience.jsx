import React from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { useLanguage } from "../context/LanguageContext";

/**
 * @param {{ index: number, title: string, description: string, tags: string[] }} props
 */
const AreaCard = ({ index, title, description, tags }) => (
  <Tilt tiltMaxAngleX={45} tiltMaxAngleY={45} scale={1} transitionSpeed={450} className='xs:w-[320px] w-full'>
    <motion.div
      variants={fadeIn("up", "spring", index * 0.5, 0.75)}
      className='w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card'
    >
      <div className='bg-tertiary rounded-[20px] py-6 sm:py-8 px-5 sm:px-6 min-h-[200px] sm:min-h-[300px] flex flex-col'>
        <h3 className='text-ink font-bold text-[24px]'>{title}</h3>
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
  const { t } = useLanguage();
  const copy = t.techAreas;

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>{copy.badge}</p>
        <h2 className={styles.sectionHeadText}>{copy.title}</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
      >
        {copy.subtitle}
      </motion.p>

      <div className='mt-10 sm:mt-20 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-7'>
        {copy.areas.map((area, index) => (
          <AreaCard key={area.title} index={index} {...area} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(ValidatedExperience, "validated");
