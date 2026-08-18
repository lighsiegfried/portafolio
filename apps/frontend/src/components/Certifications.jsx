import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Award, CheckCircle2, Clock, ExternalLink, ShieldCheck, Target } from "lucide-react";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { useLanguage } from "../context/LanguageContext";
import {
  CATEGORY_LABEL_KEYS,
  CERTIFICATIONS_LIST,
  CERTIFICATION_CATEGORIES,
  CREDLY_PROFILE_URL,
  UPCOMING_CERTIFICATIONS,
} from "../data/certifications";

/**
 * @typedef {import("../data/certifications").Certification} Certification
 * @typedef {import("../data/certifications").UpcomingCertification} UpcomingCertification
 */

/**
 * Fill the `{title}` placeholder coming from the dictionary.
 * The alt text is authored as a full sentence per language
 * (e.g. "Insignia de {title}") so it is never built by concatenation.
 *
 * @param {string | undefined} template
 * @param {string} title
 * @returns {string}
 */
const formatBadgeAlt = (template, title) => (template || "{title}").replace("{title}", title);

/** Neutral 96px badge frame — also the fallback slot when no artwork ships. */
const BadgeFrame = ({ image, alt }) => (
  <div className='w-24 h-24 mx-auto rounded-2xl bg-black-200 border border-line/5 flex items-center justify-center p-2.5'>
    {image ? (
      <img src={image} alt={alt} loading='lazy' className='w-full h-full object-contain' />
    ) : (
      // No artwork for this issuer: render a neutral shield rather than
      // borrowing another issuer's badge, which would misrepresent the credential.
      <ShieldCheck className='w-10 h-10 text-accentv' aria-hidden='true' />
    )}
  </div>
);

/**
 * @param {{ index: number, cert: Certification, language: "es" | "en", copy: Record<string, string> }} props
 */
const CertificationCard = ({ index, cert, language, copy }) => {
  const title = cert.title[language];

  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.1, 0.75)}
      className='bg-tertiary border border-line/5 rounded-2xl p-5 flex flex-col h-full shadow-card'
    >
      <BadgeFrame image={cert.badgeImage} alt={formatBadgeAlt(copy.badgeAlt, title)} />

      <div className='mt-4 flex items-center justify-between gap-2'>
        <p className='text-[11px] uppercase tracking-wider text-secondary truncate'>{cert.issuer}</p>
        <span className='inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400'>
          <CheckCircle2 className='w-3 h-3' aria-hidden='true' />
          {copy.statusEarned}
        </span>
      </div>
      <h3 className='mt-1 text-ink font-bold text-[16px] leading-[22px]'>{title}</h3>
      <p className='mt-3 text-secondary text-[13px] leading-[22px] flex-1'>
        {cert.description[language]}
      </p>

      <div className='mt-4 pt-4 border-t border-line/5 flex items-center justify-between gap-3'>
        <span className='text-[11px] bg-black-200 text-secondary px-2.5 py-1 rounded-full'>
          {copy[CATEGORY_LABEL_KEYS[cert.categoryKey]] || cert.categoryKey}
        </span>

        {cert.credlyUrl ? (
          <a
            href={cert.credlyUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-1.5 text-[12px] text-accentv hover:underline'
          >
            {copy.verifyBadge}
            <ExternalLink className='w-3.5 h-3.5' aria-hidden='true' />
          </a>
        ) : (
          <span className='text-[12px] text-secondary/70'>{copy.noCredly}</span>
        )}
      </div>
    </motion.div>
  );
};

/**
 * @param {{ index: number, item: UpcomingCertification, language: "es" | "en", copy: Record<string, string> }} props
 */
const RoadmapCard = ({ index, item, language, copy }) => (
  <motion.div
    variants={fadeIn("up", "spring", index * 0.2, 0.75)}
    className='bg-tertiary border border-line/5 rounded-2xl p-6 flex flex-col h-full'
  >
    <div className='flex items-start justify-between gap-3'>
      <p className='text-[11px] uppercase tracking-wider text-secondary'>{item.issuer}</p>
      <span className='inline-flex items-center gap-1.5 shrink-0 text-[11px] text-accent-copy bg-accentv/10 border border-accentv/30 px-3 py-1 rounded-full'>
        <Clock className='w-3 h-3' aria-hidden='true' />
        {copy.statusPrep}
      </span>
    </div>

    <h4 className='mt-2 text-ink font-bold text-[18px] leading-[26px]'>{item.title[language]}</h4>
    <p className='mt-3 text-secondary text-[14px] leading-[24px] flex-1'>{item.focus[language]}</p>

    <p className='mt-4 pt-4 border-t border-line/5 inline-flex items-center gap-2 text-[12px] text-secondary'>
      <Target className='w-3.5 h-3.5' aria-hidden='true' />
      {`${copy.curriculumTarget} ${item.target}`}
    </p>
  </motion.div>
);

const Certifications = () => {
  const { language, t } = useLanguage();
  // Deliberately unguarded: a missing key must blow up in development rather
  // than silently rendering an empty heading, which is how three broken keys
  // shipped past the build during this section's first pass.
  const copy = t.certifications;

  const [activeCategory, setActiveCategory] = useState("ALL");

  const visibleCertifications = useMemo(
    () =>
      activeCategory === "ALL"
        ? CERTIFICATIONS_LIST
        : CERTIFICATIONS_LIST.filter((cert) => cert.categoryKey === activeCategory),
    [activeCategory]
  );

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

      <motion.div
        variants={fadeIn("", "", 0.2, 1)}
        className='mt-8 flex flex-wrap gap-2.5'
        role='group'
        aria-label={copy.filterLabel}
      >
        {CERTIFICATION_CATEGORIES.map(({ key, labelKey }) => {
          const isActive = key === activeCategory;

          return (
            <button
              key={key}
              type='button'
              aria-pressed={isActive}
              onClick={() => setActiveCategory(key)}
              className={`px-4 py-2 rounded-full text-[13px] border transition-colors duration-200 ${
                isActive
                  ? "bg-accentv/[0.15] border-accentv/40 text-accent-copy"
                  : "bg-black-200 border-line/5 text-secondary hover:text-ink"
              }`}
            >
              {copy[labelKey]}
            </button>
          );
        })}
      </motion.div>

      {visibleCertifications.length > 0 ? (
        <div
          data-testid='certifications-grid'
          className='mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
        >
          {visibleCertifications.map((cert, index) => (
            <CertificationCard
              key={cert.id}
              index={index}
              cert={cert}
              language={language}
              copy={copy}
            />
          ))}
        </div>
      ) : (
        // Defensive: every shipped category currently has at least one badge, but
        // an empty result must read as an explicit state rather than a blank gap.
        <p
          data-testid='certifications-empty'
          className='mt-10 text-secondary text-[15px]'
        >
          {copy.emptyCategory}
        </p>
      )}

      <motion.div variants={fadeIn("up", "spring", 0.3, 0.75)} className='mt-10 flex justify-center'>
        <a
          href={CREDLY_PROFILE_URL}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-2.5 bg-accent-solid text-white text-[15px] font-medium px-6 py-3 rounded-xl shadow-card hover:opacity-90 transition-opacity duration-200'
        >
          <Award className='w-[18px] h-[18px]' aria-hidden='true' />
          {copy.viewCredlyHub}
          <ExternalLink className='w-4 h-4' aria-hidden='true' />
        </a>
      </motion.div>

      <motion.div variants={fadeIn("up", "spring", 0.2, 0.75)} className='mt-16 sm:mt-20'>
        <p className={styles.sectionSubText}>{copy.roadmapBadge}</p>
        <h3 className='mt-2 text-ink font-bold md:text-[32px] sm:text-[28px] text-[24px]'>
          {copy.roadmapTitle}
        </h3>
        <p className='mt-3 text-secondary text-[15px] max-w-3xl leading-[28px]'>
          {copy.roadmapSubtitle}
        </p>
      </motion.div>

      <div className='mt-8 grid grid-cols-1 md:grid-cols-2 gap-6'>
        {UPCOMING_CERTIFICATIONS.map((item, index) => (
          <RoadmapCard key={item.id} index={index} item={item} language={language} copy={copy} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Certifications, "certifications");
