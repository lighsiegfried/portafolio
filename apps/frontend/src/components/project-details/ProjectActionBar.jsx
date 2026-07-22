import React from "react";
import { Link } from "react-router-dom";

// Labeled, accessible action area for a project card. Renders real semantic
// elements: a <button> to open the case-study dialog and <a>/<Link> for
// navigation. Every action is data-driven — only actions whose data is present
// are rendered, so a card without a caseStudy simply shows fewer buttons.

const IconArrowRight = (props) => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
    focusable='false'
    {...props}
  >
    <path d='M5 12h14' />
    <path d='m13 6 6 6-6 6' />
  </svg>
);

const IconGithub = (props) => (
  <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true' focusable='false' {...props}>
    <path d='M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.31.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.021C22 6.484 17.523 2 12 2Z' />
  </svg>
);

const IconExternal = (props) => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
    focusable='false'
    {...props}
  >
    <path d='M15 3h6v6' />
    <path d='M10 14 21 3' />
    <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
  </svg>
);

const stop = (e) => e.stopPropagation();

const ProjectActionBar = ({
  name,
  caseStudy,
  sourceCodeLink,
  demoLink,
  onOpenCaseStudy,
}) => {
  const isInternalDemo = typeof demoLink === "string" && demoLink.startsWith("/");

  return (
    <div className='mt-5 flex flex-wrap items-center gap-2.5'>
      {caseStudy && (
        <button
          type='button'
          onClick={(e) => {
            stop(e);
            onOpenCaseStudy();
          }}
          aria-haspopup='dialog'
          className='group inline-flex items-center gap-2 rounded-xl bg-[#915EFF] px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#7d43e0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#915EFF] focus-visible:ring-offset-2 focus-visible:ring-offset-tertiary'
        >
          Ver caso de estudio
          <IconArrowRight className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5' />
        </button>
      )}

      {sourceCodeLink && (
        <a
          href={sourceCodeLink}
          target='_blank'
          rel='noopener noreferrer'
          onClick={stop}
          aria-label={`Ver el repositorio de ${name} en GitHub, se abre en una nueva pestaña`}
          className='inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:border-[#915EFF] hover:bg-[#915EFF]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#915EFF] focus-visible:ring-offset-2 focus-visible:ring-offset-tertiary'
        >
          <IconGithub className='h-4 w-4' />
          GitHub
        </a>
      )}

      {demoLink &&
        (isInternalDemo ? (
          <Link
            to={demoLink}
            onClick={stop}
            aria-label={`Abrir demo de ${name}`}
            className='inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:border-[#915EFF] hover:bg-[#915EFF]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#915EFF] focus-visible:ring-offset-2 focus-visible:ring-offset-tertiary'
          >
            Abrir demo
            <IconArrowRight className='h-4 w-4' />
          </Link>
        ) : (
          <a
            href={demoLink}
            target='_blank'
            rel='noopener noreferrer'
            onClick={stop}
            aria-label={`Abrir demo de ${name}, se abre en una nueva pestaña`}
            className='inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:border-[#915EFF] hover:bg-[#915EFF]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#915EFF] focus-visible:ring-offset-2 focus-visible:ring-offset-tertiary'
          >
            <IconExternal className='h-4 w-4' />
            Abrir demo
          </a>
        ))}
    </div>
  );
};

export default ProjectActionBar;
