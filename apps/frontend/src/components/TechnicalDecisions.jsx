import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { technicalDecisions } from "../constants";
import { useLanguage } from "../context/LanguageContext";
import useLocalized from "../hooks/useLocalized";

/**
 * @param {{ index: number, title: string, description: string }} props
 */
const TechnicalCard = ({ index, title, description }) => (
  <motion.div
    variants={fadeIn("", "spring", index * 0.5, 0.75)}
    className='bg-black-200 p-6 sm:p-10 rounded-3xl xs:w-[320px] w-full'
  >
    {/* Decorative glyph, not copy — hidden from assistive tech. */}
    <p className='text-ink font-black text-[48px] font-mono' aria-hidden='true'>{`</>`}</p>

    <div className='mt-1'>
      <p className='text-ink font-bold text-[18px]'>{title}</p>
      <p className='mt-4 text-secondary text-[14px] leading-[24px]'>
        {description}
      </p>
    </div>
  </motion.div>
);

const TechnicalDecisions = () => {
  const { t } = useLanguage();
  // Pass the imported module-level constant so `useLocalized` memoizes on a
  // stable reference and never re-walks the tree on unrelated re-renders.
  const localizedDecisions = useLocalized(technicalDecisions);

  return (
    <div className={`mt-8 sm:mt-12 bg-black-100 rounded-[20px]`}>
      <div
        className={`bg-tertiary rounded-2xl ${styles.padding} min-h-[200px] sm:min-h-[300px]`}
      >
        <motion.div variants={textVariant()}>
          <p className={styles.sectionSubText}>{t.decisions.badge}</p>
          <h2 className={styles.sectionHeadText}>{t.decisions.title}</h2>
        </motion.div>

        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
        >
          {t.decisions.subtitle}
        </motion.p>
      </div>

      <div className={`-mt-10 sm:-mt-20 pb-10 sm:pb-14 ${styles.paddingX} flex flex-wrap gap-5 sm:gap-7`}>
        {/* Keyed by position, not by title: the list is static and never
            reordered, so an index key keeps the cards mounted (and their
            spring animation from replaying) when the language flips. */}
        {localizedDecisions.map((decision, index) => (
          <TechnicalCard key={index} index={index} {...decision} />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(TechnicalDecisions, "decisions");
