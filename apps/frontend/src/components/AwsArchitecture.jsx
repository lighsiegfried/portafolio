import React from "react";
import { motion } from "framer-motion";
import { SiGithubactions, SiTerraform, SiReact } from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { FiCloud, FiServer, FiShield, FiUsers, FiLock, FiDatabase, FiActivity } from "react-icons/fi";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

/**
 * Diagram skeleton only — icon components and brand colors.
 *
 * All copy (card `title` / `description` / `tags`, plus every node label)
 * lives in `translations.architecture`: `cards[i]` matches this array by
 * index, and `labelKey` looks the node caption up in `nodeLabels`.
 *
 * A node with no `color` is a neutral, non-branded actor: it follows the
 * `secondary` theme token instead of a hard-coded hex, so it stays #aaa6c3
 * in dark mode and darkens to #475569 on the light surface, where the
 * original lavender was unreadable.
 *
 * `color` is the DARK-theme brand hex; `lightColor` overrides it on the light
 * card for the marks that drop under 3:1 there (AWS `#FF9900` scored 1.98:1,
 * React `#61DAFB` 1.50:1, GitHub `#2088FF` 2.99:1). Marks with no override
 * read on both grounds already.
 *
 * @typedef {{ icon: import("react-icons").IconType, labelKey: string, color?: string, lightColor?: string }} ArchNode
 * @type {{ nodes: ArchNode[] }[]}
 */
const architectures = [
  {
    nodes: [
      { icon: FiUsers, labelKey: "user" },
      { icon: FiCloud, labelKey: "cloudfront", color: "#FF9900", lightColor: "#9a5b00" },
      { icon: FaAws, labelKey: "s3Private", color: "#FF9900", lightColor: "#9a5b00" },
      { icon: FiLock, labelKey: "waf", color: "#FF9900", lightColor: "#9a5b00" },
      { icon: SiReact, labelKey: "spa", color: "#61DAFB", lightColor: "#0b7285" },
    ],
  },
  {
    nodes: [
      { icon: FiUsers, labelKey: "user" },
      { icon: FiCloud, labelKey: "cloudfront", color: "#FF9900", lightColor: "#9a5b00" },
      { icon: FaAws, labelKey: "s3", color: "#FF9900", lightColor: "#9a5b00" },
      { icon: FiServer, labelKey: "apiGateway", color: "#FF9900", lightColor: "#9a5b00" },
      { icon: FaAws, labelKey: "lambda", color: "#FF9900", lightColor: "#9a5b00" },
      { icon: FiDatabase, labelKey: "dynamodb", color: "#FF9900", lightColor: "#9a5b00" },
      { icon: FiActivity, labelKey: "cloudwatch", color: "#FF9900", lightColor: "#9a5b00" },
      { icon: SiGithubactions, labelKey: "githubActions", color: "#2088FF", lightColor: "#0b5ed7" },
      { icon: SiTerraform, labelKey: "terraform", color: "#7B42BC" },
    ],
  },
  {
    nodes: [
      { icon: SiReact, labelKey: "frontend", color: "#61DAFB", lightColor: "#0b7285" },
      { icon: FiServer, labelKey: "backend", color: "#339933" },
      { icon: FaAws, labelKey: "cloud", color: "#FF9900", lightColor: "#9a5b00" },
      { icon: FiShield, labelKey: "security", color: "#804dee" },
      { icon: SiGithubactions, labelKey: "cicd", color: "#2088FF", lightColor: "#0b5ed7" },
      { icon: SiTerraform, labelKey: "iac", color: "#7B42BC" },
    ],
  },
];

/**
 * @param {{ icon: import("react-icons").IconType, label: string, color?: string, lightColor?: string, index: number }} props
 */
const NodeIcon = ({ icon: Icon, label, color, lightColor, index }) => {
  // The brand hex feeds an inline style (plus two derived alpha tints), so it
  // cannot flip through a CSS token — the active theme picks the variant.
  const { isDark } = useTheme();
  const brand = isDark ? color : lightColor || color;
  const isBranded = Boolean(brand);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
      className="flex flex-col items-center gap-1.5"
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl border backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:shadow-lg${
          // 0x30 = 0.188 alpha, 0x08 = 0.031 alpha — the token path reproduces
          // the branded path's opacities so dark mode is pixel-identical.
          isBranded ? "" : " text-secondary border-secondary/[0.19] bg-secondary/[0.03]"
        }`}
        style={
          isBranded
            ? {
                borderColor: `${brand}30`,
                backgroundColor: `${brand}08`,
                color: brand,
              }
            : undefined
        }
      >
        <Icon />
      </div>
      <span className="text-[10px] text-secondary text-center leading-tight max-w-[80px]">
        {label}
      </span>
    </motion.div>
  );
};

/**
 * @param {{ index: number, title: string, description: string, nodes: ArchNode[], tags: string[] }} props
 */
const ArchitectureCard = ({ index, title, description, nodes, tags }) => {
  const { t } = useLanguage();
  const nodeLabels = t.architecture.nodeLabels;

  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <div className='bg-tertiary/40 backdrop-blur-sm border border-line/5 p-5 sm:p-6 rounded-2xl sm:xs:w-[380px] w-full flex flex-col h-full'>
        <h3 className='text-ink font-bold text-[22px]'>{title}</h3>
        <p className='mt-3 text-secondary text-[14px] leading-[24px]'>
          {description}
        </p>

        {nodes.length > 0 && (
          <div className='mt-5 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-1.5 p-4 bg-black-100/50 rounded-xl border border-line/5'>
            {nodes.map((node, i) => (
              <React.Fragment key={node.labelKey}>
                {i > 0 && (
                  // `text-line/[0.15]` reproduces the old rgba(255,255,255,0.15)
                  // stroke in dark mode and inverts to a dark hairline on the
                  // light surface, where pure white was invisible.
                  <div
                    className="flex items-center justify-center sm:rotate-0 rotate-90 shrink-0 text-line/[0.15]"
                    style={{ width: 16, height: 16 }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      role="img"
                      aria-label={t.architecture.flowArrowAlt}
                    >
                      <path d="M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M10 5L13 8L10 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
                <NodeIcon
                  icon={node.icon}
                  label={nodeLabels[node.labelKey]}
                  color={node.color}
                  lightColor={node.lightColor}
                  index={i}
                />
              </React.Fragment>
            ))}
          </div>
        )}

        {tags.length > 0 && (
          <div className='mt-auto pt-4 flex flex-wrap gap-2'>
            {tags.map((tag) => (
              <span
                key={tag}
                className='text-[11px] bg-black-200/80 text-secondary px-2.5 py-1 rounded-full border border-line/5'
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const AwsArchitecture = () => {
  const { t } = useLanguage();
  const cards = t.architecture.cards;

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>{t.architecture.badge}</p>
        <h2 className={styles.sectionHeadText}>{t.architecture.title}</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
      >
        {t.architecture.subtitle}
      </motion.p>

      <div className='mt-10 sm:mt-20 flex flex-col sm:flex-row flex-wrap gap-5 sm:gap-7 justify-center'>
        {/* `cards[index]` is the copy for `architectures[index]`; both arrays
            are static and never reordered, so an index key keeps the cards
            mounted when the language flips. */}
        {architectures.map((arch, index) => {
          const copy = cards[index] || {};

          return (
            <ArchitectureCard
              key={index}
              index={index}
              title={copy.title}
              description={copy.description}
              nodes={arch.nodes}
              tags={copy.tags || []}
            />
          );
        })}
      </div>
    </>
  );
};

export default SectionWrapper(AwsArchitecture, "architecture");
