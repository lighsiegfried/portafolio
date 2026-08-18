import React from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { useLanguage } from "../context/LanguageContext";
import useLocalized from "../hooks/useLocalized";

/**
 * One service pill. The icon is purely decorative: the localized `title`
 * sits directly underneath it, so announcing the artwork as well would
 * duplicate the label for screen readers.
 *
 * @param {{ index: number, title: string, icon: string }} props
 */
const ServiceCard = ({ index, title, icon }) => (
  <Tilt tiltMaxAngleX={45} tiltMaxAngleY={45} scale={1} transitionSpeed={450} className='w-full'>
    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      className='w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card'
    >
      <div className='bg-tertiary rounded-[20px] py-6 sm:py-5 px-6 sm:px-12 min-h-[220px] sm:min-h-[280px] flex justify-evenly items-center flex-col'>
        <img
          src={icon}
          alt=''
          aria-hidden='true'
          className='w-14 sm:w-16 h-14 sm:h-16 object-contain'
        />

        <h3 className='text-ink text-[18px] sm:text-[20px] font-bold text-center'>
          {title}
        </h3>
      </div>
    </motion.div>
  </Tilt>
);

const About = () => {
  const { t } = useLanguage();
  // `services` is the module-level constant, so the deep walk is memoized
  // on its reference and only re-runs when the language changes.
  const localizedServices = useLocalized(services);

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>{t.about.badge}</p>
        <h2 className={styles.sectionHeadText}>{t.about.title}</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
      >
        {t.about.bioP1}
      </motion.p>
      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
      >
        {t.about.bioP2}
      </motion.p>

      <div className='mt-10 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
        {localizedServices.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
