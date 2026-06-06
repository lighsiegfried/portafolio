import React from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

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
  source_code_link,
}) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.3, 0.75)}>
      <Tilt
        tiltMaxAngleX={45}
        tiltMaxAngleY={45}
        scale={1}
        transitionSpeed={450}
        className='bg-tertiary p-4 sm:p-5 rounded-2xl sm:w-[360px] w-full'
      >
        <div className='relative w-full h-[180px] sm:h-[230px]'>
          <img
            src={image}
            alt='project_image'
            className='w-full h-full object-cover rounded-2xl'
          />

          {source_code_link && (
            <div className='absolute inset-0 flex justify-end m-3 card-img_hover'>
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
            </div>
          )}
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
