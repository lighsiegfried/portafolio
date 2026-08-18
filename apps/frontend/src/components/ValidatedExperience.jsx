import React from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../data/translations";

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

  // `translations` is a static import, so in practice both languages are always
  // populated. This fallback exists so that a future edit which drops or renames
  // `areas` under one language degrades to English copy instead of silently
  // rendering an empty grid.
  const areas = copy?.areas ?? translations.en.techAreas.areas;

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
        {/* Key on `area.id`, never on `area.title`. The title is translated, so a
            title-based key changes identity when the visitor switches language
            and React remounts the card. SectionWrapper drives these cards with
            `whileInView='show'` + `viewport={{ once: true }}`: once that has
            fired, framer-motion has stopped observing the section, so a freshly
            mounted child inherits the `hidden` variant (opacity 0, y 100) and
            never receives another in-view event to move it to `show`. The card
            then stays invisible until a full page reload. `area.id` is identical
            in both dictionaries, so the cards update their text in place and are
            never remounted. */}
        {areas.map((area, index) => (
          <AreaCard key={area.id} index={index} {...area} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(ValidatedExperience, "validated");
