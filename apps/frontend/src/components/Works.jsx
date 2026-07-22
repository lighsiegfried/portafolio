import React from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

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
}) => {
  const navigate = useNavigate();
  const imageObjectClass =
    image_fit === "contain"
      ? "object-contain object-center"
      : "object-cover object-top";
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.3, 0.75)}>
      <Tilt
        tiltMaxAngleX={45}
        tiltMaxAngleY={45}
        scale={1}
        transitionSpeed={450}
        className='bg-tertiary p-4 sm:p-5 rounded-2xl sm:w-[360px] w-full'
      >
        <div
          className={`relative w-full h-[180px] sm:h-[230px] rounded-2xl overflow-hidden ${
            image_background || "bg-black-200"
          }`}
        >
          <img
            src={image}
            alt={image_alt || "project_image"}
            className={`w-full h-full ${imageObjectClass} rounded-2xl`}
          />

          <div className='absolute inset-0 flex justify-end m-3 card-img_hover gap-2'>
            {source_code_link && (
              <div
                onClick={() => window.open(source_code_link, "_blank")}
                className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
              >
                <img
                  src={github}
                  alt='source code'
                  className='w-1/2 h-1/2 object-contain'
                />
              </div>
            )}
            {demo_link && (
              <div
                onClick={() => navigate(demo_link)}
                className='violet-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
                title="Ver demo"
              >
                <span className='text-white text-xs font-bold'>&#9654;</span>
              </div>
            )}
          </div>
        </div>

        <div className='mt-5'>
          <h3 className='text-white font-bold text-[24px]'>{name}</h3>
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

        {download_label && (
          <div className='mt-5'>
            {download_link ? (
              <a
                href={download_link}
                target='_blank'
                rel='noopener noreferrer'
                onClick={(e) => e.stopPropagation()}
                aria-label={`${download_label}, APK oficial, se abre en una nueva pestaña`}
                className='group inline-flex w-fit max-w-full items-center gap-3 rounded-xl border border-[#915EFF]/40 bg-[#915EFF]/10 px-4 py-3 transition-all duration-300 hover:border-[#915EFF] hover:bg-[#915EFF]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#915EFF] focus-visible:ring-offset-2 focus-visible:ring-offset-tertiary'
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
                  className='w-[22px] h-[22px] shrink-0 text-[#b18cff] transition-transform duration-300 group-hover:translate-y-0.5'
                >
                  <path d='M12 3v12' />
                  <path d='m7 10 5 5 5-5' />
                  <path d='M5 21h14' />
                </svg>

                <span className='flex flex-col items-start min-w-0'>
                  <span className='font-semibold text-[14px] text-[#b18cff] underline decoration-[#915EFF] underline-offset-4 transition-colors group-hover:text-white'>
                    {download_label}
                  </span>
                  <span className='mt-1 text-[12px] font-normal text-secondary transition-colors group-hover:text-gray-300'>
                    {download_description || "APK oficial · descarga directa"}
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
                Descarga temporalmente no disponible
              </span>
            )}
          </div>
        )}
      </Tilt>
    </motion.div>
  );
};

const Works = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText}`}>Evidencia técnica</p>
        <h2 className={`${styles.sectionHeadText}`}>Casos de estudio y proyectos</h2>
      </motion.div>

      <div className='w-full flex'>
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='mt-2 sm:mt-3 text-secondary text-[15px] sm:text-[17px] max-w-3xl leading-[24px] sm:leading-[30px]'
        >
          Estos proyectos muestran diferentes etapas de mi experiencia: desde sistemas empresariales y arquitectura cloud hasta proyectos iniciales que forman parte de mi base técnica.
        </motion.p>
      </div>

      {projects.map((group, groupIndex) => (
        <div key={`group-${groupIndex}`} className='mt-4 sm:mt-10 lg:mt-20'>
          <h3 className='text-white font-bold text-[18px] sm:text-[20px] mb-2 sm:mb-4 lg:mb-8'>
            {group.title}
          </h3>
          <div className='flex flex-wrap gap-4 sm:gap-6 lg:gap-7'>
            {group.items.map((project, projectIndex) => (
              <ProjectCard
                key={`project-${groupIndex}-${projectIndex}`}
                index={projectIndex}
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
