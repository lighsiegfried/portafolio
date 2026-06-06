import { motion } from "framer-motion";

import { styles } from "../styles";
import { staggerContainer } from "../utils/motion";
import BackgroundDecor from "../components/BackgroundDecor";

const variantMap = {
  about: "default",
  validated: "default",
  work: "default",
  tech: "tech",
  decisions: "default",
  architecture: "architecture",
  contact: "contact",
};

const StarWrapper = (Component, idName) =>
  function HOC() {
    return (
      <motion.section
        variants={staggerContainer()}
        initial='hidden'
        whileInView='show'
        viewport={{ once: true, amount: 0.1 }}
        className={`${styles.padding} max-w-7xl mx-auto relative z-0`}
      >
        <span className='hash-span' id={idName}>
          &nbsp;
        </span>

        <BackgroundDecor variant={variantMap[idName] || "default"} />

        <Component />
      </motion.section>
    );
  };

export default StarWrapper;
