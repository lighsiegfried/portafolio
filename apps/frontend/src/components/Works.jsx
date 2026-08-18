import React, { useState } from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { ProjectActionBar, ProjectCaseStudyDialog } from "./project-details";
import useTiltEnabled from "../hooks/useTiltEnabled";
import useLocalized from "../hooks/useLocalized";
import { useLanguage } from "../context/LanguageContext";

/**
 * Fill the `{token}` placeholders of a dictionary sentence.
 * Every sentence is authored end to end per language, so localized strings are
 * never built by concatenating fragments across languages.
 *
 * @param {string | undefined} template sentence containing `{token}` markers
 * @param {Record<string, string>} values token -> replacement value
 * @returns {string}
 */
const fillTemplate = (template, values) => {
  if (typeof template !== "string") return "";

  return Object.keys(values).reduce(
    (text, token) => text.split(`{${token}}`).join(values[token]),
    template
  );
};

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  image_alt,
  image_fit,
  image_background,
  source_code_link,
  demo_link,
  download_link,
  download_label,
  download_description,
  caseStudy,
  tiltEnabled,
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const copy = t.projects;
  const [caseStudyOpen, setCaseStudyOpen] = useState(false);
  const imageObjectClass =
    image_fit === "contain"
      ? "object-contain object-center"
      : "object-cover object-top";
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.3, 0.75)}>
      {/* Subtle premium tilt only. Angles reduced ~90% (45 -> 4.5), no glare,
          no gyroscope, no window tracking; disabled entirely on coarse
          pointers and when the OS requests reduced motion. */}
      <Tilt
        tiltEnable={tiltEnabled}
        tiltMaxAngleX={4.5}
        tiltMaxAngleY={4.5}
        scale={1}
        transitionSpeed={800}
        perspective={1400}
        glareEnable={false}
        gyroscope={false}
        trackOnWindow={false}
        reset={true}
        className='project-card-tilt bg-tertiary p-4 sm:p-5 rounded-2xl sm:w-[360px] w-full'
      >
        <div
          className={`relative w-full h-[180px] sm:h-[230px] rounded-2xl overflow-hidden ${
            image_background || "bg-black-200"
          }`}
        >
          <img
            src={image}
            alt={image_alt || fillTemplate(copy.imageAltFallback, { name })}
            className={`w-full h-full ${imageObjectClass} rounded-2xl`}
          />

          {/* Floating icon overlay is kept for cards without a labeled action
              bar. When a project has a caseStudy, its labeled ProjectActionBar
              (rendered below the tags) replaces these icons to avoid a
              duplicate GitHub action. */}
          {!caseStudy && (
            <div className='absolute inset-0 flex justify-end m-3 card-img_hover gap-2'>
              {source_code_link && (
                <div
                  onClick={() => window.open(source_code_link, "_blank")}
                  className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
                >
                  <img
                    src={github}
                    alt={copy.sourceCodeIconAlt}
                    className='w-1/2 h-1/2 object-contain'
                  />
                </div>
              )}
              {demo_link && (
                <div
                  onClick={() => navigate(demo_link)}
                  className='violet-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
                  title={copy.demoTitle}
                >
                  {/* Sits on the fixed violet gradient fill in both themes. */}
                  <span className='text-white text-xs font-bold'>&#9654;</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className='mt-5'>
          <h3 className='text-ink font-bold text-[24px]'>{name}</h3>
          <p className='mt-2 text-secondary text-[14px]'>{description}</p>
        </div>

        <div className='mt-4 flex flex-wrap gap-2'>
          {tags.map((tag) => (
            <p
              key={`${name}-${tag.name}`}
              className={`text-[14px] ${tag.color}`}
            >
              #{tag.name}
            </p>
          ))}
        </div>

        {/* Standalone APK CTA is only used by cards WITHOUT a case study. When a
            card has a caseStudy (e.g. Mis Finanzas), the download moves into the
            shared ProjectActionBar to avoid a duplicate download action. */}
        {download_label && !caseStudy && (
          <div className='mt-5'>
            {download_link ? (
              <a
                href={download_link}
                target='_blank'
                rel='noopener noreferrer'
                onClick={(e) => e.stopPropagation()}
                aria-label={fillTemplate(copy.downloadApkAria, {
                  label: download_label,
                })}
                className='group inline-flex w-fit max-w-full items-center gap-3 rounded-xl border border-accentv/40 bg-accentv/10 px-4 py-3 transition-all duration-300 hover:border-accentv hover:bg-accentv/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accentv focus-visible:ring-offset-2 focus-visible:ring-offset-tertiary'
              >
                <svg
                  aria-hidden='true'
                  focusable='false'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='w-[22px] h-[22px] shrink-0 text-accent-copy transition-transform duration-300 group-hover:translate-y-0.5'
                >
                  <path d='M12 3v12' />
                  <path d='m7 10 5 5 5-5' />
                  <path d='M5 21h14' />
                </svg>

                <span className='flex flex-col items-start min-w-0'>
                  <span className='font-semibold text-[14px] text-accent-copy underline decoration-accent-copy underline-offset-4 transition-colors group-hover:text-ink'>
                    {download_label}
                  </span>
                  <span className='mt-1 text-[12px] font-normal text-secondary transition-colors group-hover:text-gray-600 dark:group-hover:text-gray-300'>
                    {download_description || copy.downloadHint}
                  </span>
                </span>
              </a>
            ) : (
              <span
                aria-disabled='true'
                className='inline-flex items-center gap-2 text-[14px] text-secondary opacity-60 cursor-not-allowed select-none'
              >
                <svg
                  aria-hidden='true'
                  focusable='false'
                  viewBox='0 0 24 24'
                  className='w-4 h-4 fill-current shrink-0'
                >
                  <path d='M12 3a1 1 0 0 1 1 1v9.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L11 13.586V4a1 1 0 0 1 1-1Zm-7 14a1 1 0 0 1 1 1v1h12v-1a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z' />
                </svg>
                {copy.downloadUnavailable}
              </span>
            )}
          </div>
        )}

        {caseStudy && (
          <>
            <ProjectActionBar
              name={name}
              caseStudy={caseStudy}
              sourceCodeLink={source_code_link}
              demoLink={demo_link}
              onOpenCaseStudy={() => setCaseStudyOpen(true)}
              showDownload={Boolean(caseStudy.links && caseStudy.links.download)}
              downloadLink={download_link}
            />
            <ProjectCaseStudyDialog
              caseStudy={caseStudy}
              open={caseStudyOpen}
              onOpenChange={setCaseStudyOpen}
              downloadLink={download_link}
            />
          </>
        )}
      </Tilt>
    </motion.div>
  );
};

const Works = () => {
  const tiltEnabled = useTiltEnabled();
  const { t } = useLanguage();
  // Resolved once per language change for the whole section: every `{ es, en }`
  // leaf of `projects` (group titles, names, descriptions, alt text, download
  // copy and the nested caseStudy trees) collapses to the active language here,
  // so ProjectCard and its children receive plain strings.
  const localizedProjects = useLocalized(projects);

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText}`}>{t.projects.badge}</p>
        <h2 className={`${styles.sectionHeadText}`}>{t.projects.title}</h2>
      </motion.div>

      <div className='w-full flex'>
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='mt-2 sm:mt-3 text-secondary text-[15px] sm:text-[17px] max-w-3xl leading-[24px] sm:leading-[30px]'
        >
          {t.projects.subtitle}
        </motion.p>
      </div>

      {localizedProjects.map((group, groupIndex) => (
        <div key={`group-${groupIndex}`} className='mt-4 sm:mt-10 lg:mt-20'>
          <h3 className='text-ink font-bold text-[18px] sm:text-[20px] mb-2 sm:mb-4 lg:mb-8'>
            {group.title}
          </h3>
          <div className='flex flex-wrap gap-4 sm:gap-6 lg:gap-7'>
            {group.items.map((project, projectIndex) => (
              <ProjectCard
                key={`project-${groupIndex}-${projectIndex}`}
                index={projectIndex}
                tiltEnabled={tiltEnabled}
                {...project}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default SectionWrapper(Works, "works");
