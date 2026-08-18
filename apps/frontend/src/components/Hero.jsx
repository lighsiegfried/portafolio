import { motion } from "framer-motion";

import { styles } from "../styles";
import { ComputersCanvas } from "./canvas";
import { useLanguage } from "../context/LanguageContext";

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className={`relative w-full h-screen mx-auto sm:min-h-screen min-h-[700px]`}>
      <div
        className={`absolute inset-0 top-[100px] sm:top-[120px] max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5`}
      >
        <div className='flex flex-col justify-center items-center mt-5'>
          <div className='w-5 h-5 rounded-full bg-accentv' />
          <div className='w-1 sm:h-80 h-32 violet-gradient' />
        </div>

        <div className='flex-1 min-w-0'>
          <h1 className={`${styles.heroHeadText}`}>
            {t.hero.greeting} <span className='text-accentv'>{t.hero.name}</span>
          </h1>
          <p className={`${styles.heroSubText} mt-2 max-w-3xl`}>{t.hero.title}</p>
          <p className='mt-3 sm:mt-4 text-secondary text-[14px] max-w-3xl leading-[26px] sm:leading-[30px]'>
            {t.hero.subtitle}
          </p>

          {/* Real anchors rather than buttons with handlers: they are
              keyboard-reachable, middle-clickable and shareable for free, and
              `scroll-behavior: smooth` + `scroll-padding-top: 80px` (both in
              index.css) already give the smooth, navbar-aware scroll.
              The projects section's anchor id is `works` — see
              `SectionWrapper(Works, "works")`; there is no `#projects` id. */}
          <div className='mt-6 sm:mt-8 flex flex-wrap items-center gap-3'>
            <a
              href='#works'
              className='inline-flex cursor-pointer items-center gap-2 rounded-xl bg-accent-solid px-5 py-2.5 text-[14px] font-semibold text-white shadow-md shadow-accentv/20 transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg hover:shadow-accentv/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-accentv focus-visible:ring-offset-2 focus-visible:ring-offset-primary motion-reduce:transform-none motion-reduce:transition-none'
            >
              {t.hero.ctaProjects}
            </a>
            <a
              href='#contact'
              className='inline-flex cursor-pointer items-center gap-2 rounded-xl border border-line/20 bg-line/[0.04] px-5 py-2.5 text-[14px] font-semibold text-ink shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accentv hover:bg-accentv/10 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accentv focus-visible:ring-offset-2 focus-visible:ring-offset-primary motion-reduce:transform-none motion-reduce:transition-none'
            >
              {t.hero.ctaContact}
            </a>
          </div>
        </div>
      </div>

      <ComputersCanvas />

      <div className='absolute xs:bottom-8 bottom-24 w-full flex justify-center items-center'>
        <a href='#about' aria-label={t.hero.scrollHint}>
          <div className='w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2'>
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className='w-3 h-3 rounded-full bg-secondary mb-1'
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
