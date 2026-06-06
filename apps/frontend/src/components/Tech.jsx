import React from "react";
import { motion } from "framer-motion";

import { SiReact, SiJavascript, SiTypescript, SiTailwindcss, SiThreedotjs, SiNodedotjs, SiDocker, SiGithubactions } from "react-icons/si";
import { FaAws, FaLinux, FaJava, FaLaravel } from "react-icons/fa";
import { TbBrandVite, TbBrandOpenai } from "react-icons/tb";
import { FiServer, FiDatabase, FiCloud, FiShield, FiMonitor, FiFileText, FiGitBranch, FiZap, FiBarChart2, FiLayers } from "react-icons/fi";

import { styles } from "../styles";
import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

const techCategories = [
  {
    name: "Frontend",
    icon: <SiReact className="text-[#61DAFB]" />,
    items: [
      { label: "React", icon: SiReact, color: "#61DAFB" },
      { label: "Vite", icon: TbBrandVite, color: "#646CFF" },
      { label: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { label: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { label: "Tailwind", icon: SiTailwindcss, color: "#06B6D4" },
      { label: "Three.js", icon: SiThreedotjs, color: "#000000" },
    ],
  },
  {
    name: "Backend & APIs",
    icon: <FiServer className="text-cyan-400" />,
    items: [
      { label: "Node.js", icon: SiNodedotjs, color: "#339933" },
      { label: "Laravel", icon: FaLaravel, color: "#FF2D20" },
      { label: "PHP", icon: SiJavascript, color: "#777BB4" },
      { label: "Java/ Java Sprint", icon: FaJava, color: "#ED8B00" },
      { label: "REST APIs", icon: FiServer, color: "#aaa6c3" },
      { label: "SQL/PostgreSql", icon: FiDatabase, color: "#336791" },
    ],
  },
  {
    name: "Cloud & DevOps",
    icon: <FiCloud className="text-orange-400" />,
    items: [
      { label: "AWS", icon: FaAws, color: "#FF9900" },
      { label: "Docker", icon: SiDocker, color: "#2496ED" },
      { label: "GitHub Actions", icon: SiGithubactions, color: "#2088FF" },
      { label: "Linux", icon: FaLinux, color: "#FCC624" },
      { label: "IAM", icon: FiShield, color: "#FF9900" },
      { label: "CloudFront", icon: FiCloud, color: "#aaa6c3" },
    ],
  },
  {
    name: "Data & BI",
    icon: <FiBarChart2 className="text-yellow-400" />,
    items: [
      { label: "SQL", icon: FiDatabase, color: "#336791" },
      { label: "Power BI", icon: FiBarChart2, color: "#F2C811" },
      { label: "ETL", icon: FiLayers, color: "#aaa6c3" },
      { label: "Stored Procedures", icon: FiFileText, color: "#aaa6c3" },
      { label: "Reporting", icon: FiBarChart2, color: "#aaa6c3" },
    ],
  },
  {
    name: "AI & Automation",
    icon: <FiZap className="text-purple-400" />,
    items: [
      { label: "LLMs", icon: TbBrandOpenai, color: "#412991" },
      { label: "Agentes internos", icon: FiMonitor, color: "#aaa6c3" },
      { label: "Automatización documental", icon: FiFileText, color: "#aaa6c3" },
      { label: "Flujos asistidos", icon: FiGitBranch, color: "#aaa6c3" },
    ],
  },
];

const TechIcon = ({ Icon, label, color }) => (
  <div className="group flex items-center gap-2 bg-black-200/60 hover:bg-black-200 border border-white/5 hover:border-white/10 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg transition-all duration-200">
    <Icon className="text-lg shrink-0" style={{ color }} />
    <span className="text-[13px] text-secondary group-hover:text-white transition-colors">
      {label}
    </span>
  </div>
);

const Tech = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Stack tecnológico</p>
        <h2 className={styles.sectionHeadText}>Tecnologías</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-3 sm:mt-4 text-secondary text-[15px] sm:text-[17px] max-w-3xl leading-[24px] sm:leading-[30px]'
      >
        Tecnologías con las que he trabajado en producción, proyectos personales y laboratorio técnico.
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
            key={category.name}
            variants={fadeIn("up", "spring", 0.1 * catIndex, 0.5)}
            className='bg-tertiary/40 backdrop-blur-sm border border-white/5 rounded-xl p-4 sm:p-5'
          >
            <div className='flex items-center gap-2 mb-3'>
              <span className="text-xl">{category.icon}</span>
              <h3 className='text-white font-bold text-[15px]'>
                {category.name}
              </h3>
            </div>
            <div className='flex flex-col gap-1.5'>
              {category.items.map((item) => (
                <TechIcon
                  key={item.label}
                  Icon={item.icon}
                  label={item.label}
                  color={item.color}
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
