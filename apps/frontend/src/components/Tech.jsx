import React from "react";
import { motion } from "framer-motion";

import { SiReact, SiJavascript, SiTypescript, SiTailwindcss, SiThreedotjs, SiNodedotjs, SiDocker, SiGithubactions, SiPhp } from "react-icons/si";
import { FaAws, FaLinux, FaJava, FaLaravel } from "react-icons/fa";
import { TbBrandVite, TbBrandOpenai } from "react-icons/tb";
import { FiServer, FiDatabase, FiCloud, FiShield, FiMonitor, FiFileText, FiGitBranch, FiZap, FiBarChart2, FiLayers } from "react-icons/fi";

import { styles } from "../styles";
import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

/**
 * Neutral chip tint. Byte-identical to the old hard-coded `#aaa6c3` in dark
 * mode, but resolves to the light-mode slate (#475569) once `.dark` is off —
 * those entries never carried a real brand color, they used the dark-theme
 * `--c-secondary` value as a "no brand color" placeholder.
 */
const NEUTRAL = "rgb(var(--c-secondary))";

/**
 * Three.js ships a brand BLACK mark. A literal `#000000` is invisible on the
 * dark surface and would be a harsh, off-palette blob on the light one, so the
 * mark follows `--c-ink` instead: near-black (#0b1220) on light, white on dark
 * — the usual way a black wordmark is inverted for a dark UI.
 */
const BRAND_BLACK = "rgb(var(--c-ink))";

/**
 * @typedef {Object} TechItem
 * @property {string} [label] literal label for proper nouns / technical terms
 *   that are identical in every language (React, AWS, SQL…)
 * @property {string} [labelKey] key into `t.techStack.skillLabels` for the
 *   handful of labels that are real prose and must be translated
 * @property {import("react-icons").IconType} icon
 * @property {string} color CSS color for the DARK chip — a brand hex, or a
 *   theme token (`rgb(var(--c-*))`) where the mark never had a brand color
 * @property {string} [lightColor] override for the LIGHT chip. Present only
 *   where the brand hex drops under 3:1 on `#e9eef4` (WCAG 1.4.11 for a
 *   meaningful non-text mark) — e.g. `#FCC624` Linux yellow scores 1.36:1
 *   there. Absent means the one hex reads on both grounds.
 */

/**
 * @typedef {Object} TechCategory
 * @property {string} titleKey key into `t.techStack.categoryTitles`
 * @property {React.ReactNode} icon
 * @property {TechItem[]} items
 */

/**
 * Icons and brand colors are data, not copy, so they stay local. Every string a
 * reader actually sees is addressed by key and resolved from the dictionary at
 * render time.
 *
 * @type {TechCategory[]}
 */
const techCategories = [
  {
    titleKey: "frontend",
    icon: <SiReact className="text-[#087ea4] dark:text-[#61DAFB]" />,
    items: [
      { label: "React", icon: SiReact, color: "#61DAFB", lightColor: "#0b7285" },
      { label: "Vite", icon: TbBrandVite, color: "#646CFF" },
      { label: "JavaScript", icon: SiJavascript, color: "#F7DF1E", lightColor: "#7a6600" },
      { label: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { label: "Tailwind", icon: SiTailwindcss, color: "#06B6D4", lightColor: "#0e7490" },
      { label: "Three.js", icon: SiThreedotjs, color: BRAND_BLACK },
    ],
  },
  {
    titleKey: "backend",
    icon: <FiServer className="text-cyan-600 dark:text-cyan-400" />,
    items: [
      { label: "Node.js", icon: SiNodedotjs, color: "#339933" },
      { label: "Laravel", icon: FaLaravel, color: "#FF2D20" },
      { label: "PHP", icon: SiPhp, color: "#777BB4" },
      { label: "Java/ Java Sprint", icon: FaJava, color: "#ED8B00", lightColor: "#9a5b00" },
      { label: "REST APIs", icon: FiServer, color: NEUTRAL },
      { label: "SQL/PostgreSql", icon: FiDatabase, color: "#336791" },
    ],
  },
  {
    titleKey: "cloud",
    icon: <FiCloud className="text-orange-600 dark:text-orange-400" />,
    items: [
      { label: "AWS", icon: FaAws, color: "#FF9900", lightColor: "#9a5b00" },
      { label: "Docker", icon: SiDocker, color: "#2496ED", lightColor: "#1064a8" },
      { label: "GitHub Actions", icon: SiGithubactions, color: "#2088FF", lightColor: "#0b5ed7" },
      { label: "Linux", icon: FaLinux, color: "#FCC624", lightColor: "#7a6000" },
      { label: "IAM", icon: FiShield, color: "#FF9900", lightColor: "#9a5b00" },
      { label: "CloudFront", icon: FiCloud, color: NEUTRAL },
    ],
  },
  {
    titleKey: "data",
    icon: <FiBarChart2 className="text-yellow-600 dark:text-yellow-400" />,
    items: [
      { label: "SQL", icon: FiDatabase, color: "#336791" },
      { label: "Power BI", icon: FiBarChart2, color: "#F2C811", lightColor: "#7a6400" },
      { label: "ETL", icon: FiLayers, color: NEUTRAL },
      { label: "Stored Procedures", icon: FiFileText, color: NEUTRAL },
      { label: "Reporting", icon: FiBarChart2, color: NEUTRAL },
    ],
  },
  {
    titleKey: "ai",
    icon: <FiZap className="text-purple-600 dark:text-purple-400" />,
    items: [
      { label: "LLMs", icon: TbBrandOpenai, color: "#8f7ae5", lightColor: "#412991" },
      { labelKey: "internalAgents", icon: FiMonitor, color: NEUTRAL },
      { labelKey: "documentAutomation", icon: FiFileText, color: NEUTRAL },
      { labelKey: "assistedWorkflows", icon: FiGitBranch, color: NEUTRAL },
    ],
  },
];

/**
 * @param {{ Icon: import("react-icons").IconType, label: string, color: string, lightColor?: string }} props
 */
const TechIcon = ({ Icon, label, color, lightColor }) => {
  // Brand hexes are baked into an inline style, so they cannot flip through a
  // CSS token — the active theme picks the readable variant instead.
  const { isDark } = useTheme();
  const resolved = isDark ? color : lightColor || color;

  return (
    <div className="group flex items-center gap-2 bg-black-200/60 hover:bg-black-200 border border-line/5 hover:border-line/10 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg transition-all duration-200">
      <Icon className="text-lg shrink-0" style={{ color: resolved }} />
      <span className="text-[13px] text-secondary group-hover:text-ink transition-colors">
        {label}
      </span>
    </div>
  );
};

const Tech = () => {
  const { t } = useLanguage();
  const copy = t.techStack;

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>{copy.badge}</p>
        <h2 className={styles.sectionHeadText}>{copy.title}</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-3 sm:mt-4 text-secondary text-[15px] sm:text-[17px] max-w-3xl leading-[24px] sm:leading-[30px]'
      >
        {copy.subtitle}
      </motion.p>

      <div className='flex flex-row flex-wrap justify-center gap-6 sm:gap-10 mt-8 sm:mt-12'>
        {technologies.map((technology) => (
          <div className='w-20 h-20 sm:w-28 sm:h-28' key={technology.name}>
            <BallCanvas icon={technology.icon} />
          </div>
        ))}
      </div>

      <div className='mt-6 sm:mt-12 lg:mt-16 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6'>
        {techCategories.map((category, catIndex) => (
          <motion.div
            key={category.titleKey}
            variants={fadeIn("up", "spring", 0.1 * catIndex, 0.5)}
            className='bg-tertiary/40 backdrop-blur-sm border border-line/5 rounded-xl p-4 sm:p-5'
          >
            <div className='flex items-center gap-2 mb-3'>
              <span className="text-xl">{category.icon}</span>
              <h3 className='text-ink font-bold text-[15px]'>
                {copy.categoryTitles[category.titleKey]}
              </h3>
            </div>
            <div className='flex flex-col gap-1.5'>
              {category.items.map((item) => (
                <TechIcon
                  key={item.labelKey || item.label}
                  Icon={item.icon}
                  label={item.labelKey ? copy.skillLabels[item.labelKey] : item.label}
                  color={item.color}
                  lightColor={item.lightColor}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Tech, "tech");
