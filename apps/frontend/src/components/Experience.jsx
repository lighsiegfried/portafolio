import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";

import "react-vertical-timeline-component/style.min.css";

import { styles } from "../styles";
import { experiences } from "../constants";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";
import { useLanguage } from "../context/LanguageContext";
import useLocalized from "../hooks/useLocalized";

/**
 * `react-vertical-timeline-component` paints its card and arrow through inline
 * style props, so Tailwind tokens cannot reach them. These objects hold the CSS
 * variables declared in `src/index.css` instead of literals, so the timeline
 * repaints with the rest of the page when `.dark` flips on <html>.
 *
 * `--timeline-arrow` doubles as the card hairline: #e2e8f0 draws a real edge on
 * the white light-mode card (which would otherwise dissolve into the near-white
 * page), while #232631 stays invisible against the dark #1d1836 card, leaving
 * the dark theme looking exactly as it did before.
 */
const CONTENT_STYLE = {
  background: "var(--timeline-card)",
  color: "rgb(var(--c-ink))",
  border: "1px solid var(--timeline-arrow)",
};

const CONTENT_ARROW_STYLE = { borderRight: "7px solid var(--timeline-arrow)" };

/**
 * One timeline row.
 *
 * @param {{ experience: {
 *   title: string,
 *   company_name: string,
 *   icon: string,
 *   iconBg: string,
 *   date: string,
 *   points: string[],
 * } }} props `experience` is already resolved to the active language.
 */
const ExperienceCard = ({ experience }) => {
  return (
    <VerticalTimelineElement
      contentStyle={CONTENT_STYLE}
      contentArrowStyle={CONTENT_ARROW_STYLE}
      date={experience.date}
      iconStyle={{ background: experience.iconBg }}
      icon={
        <div className='flex justify-center items-center w-full h-full'>
          <img
            src={experience.icon}
            alt={experience.company_name}
            className='w-[60%] h-[60%] object-contain'
          />
        </div>
      }
    >
      <div>
        <h3 className='text-ink text-[24px] font-bold'>{experience.title}</h3>
        <p
          className='text-secondary text-[16px] font-semibold'
          style={{ margin: 0 }}
        >
          {experience.company_name}
        </p>
      </div>

      <ul className='mt-5 list-disc ml-5 space-y-2'>
        {experience.points.map((point, index) => (
          <li
            key={`experience-point-${index}`}
            className='text-white-100 text-[14px] pl-1 tracking-wider'
          >
            {point}
          </li>
        ))}
      </ul>
    </VerticalTimelineElement>
  );
};

const Experience = () => {
  const { t } = useLanguage();
  // `useLocalized` memoizes on the source reference, so the imported
  // module-level constant is passed straight through (never a `.map()` result).
  const localizedExperiences = useLocalized(experiences);

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>
          {t.experience.badge}
        </p>
        <h2 className={`${styles.sectionHeadText} text-center`}>
          {t.experience.title}
        </h2>
      </motion.div>

      <div className='mt-8 sm:mt-20 flex flex-col'>
        <VerticalTimeline>
          {localizedExperiences.map((experience, index) => (
            <ExperienceCard
              key={`experience-${index}`}
              experience={experience}
            />
          ))}
        </VerticalTimeline>
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "work");
