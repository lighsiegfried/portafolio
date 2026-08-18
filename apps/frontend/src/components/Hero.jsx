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

          {/* The two hero CTAs ("Ver Casos de Estudio" / "Contactar") were
              removed deliberately: they sat on top of the <ComputersCanvas />
              drawing surface and swallowed the pointer events the 3D desktop
              needs to orbit, so the model could not be interacted with in the
              area they covered. The same destinations remain reachable from the
              navbar (#works, #contact) and from the scroll hint below. */}
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
