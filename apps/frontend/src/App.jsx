import { BrowserRouter, Routes, Route } from "react-router-dom";

import {
  About,
  AwsArchitecture,
  Certifications,
  Contact,
  Experience,
  Footer,
  Hero,
  Navbar,
  Tech,
  TechnicalDecisions,
  ValidatedExperience,
  Works,
  StarsCanvas,
} from "./components";
import BackgroundDecor from "./components/BackgroundDecor";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import MiniErpApp from "./mini-erp/MiniErpApp";

const Portfolio = () => {
  const { isDark } = useTheme();

  return (
    <div className='relative z-0 bg-primary'>
      <Navbar />
      <BackgroundDecor />
      {/* One backdrop per theme, swapped on the wrapper rather than inside
          <Hero /> so the <section> keeps its own stacking context and the
          ComputersCanvas layer is untouched. `herobg.png` is a near-black
          photograph that cannot be tinted for light mode, so light gets its
          own artwork (`fondo2.png`, see `.hero-backdrop-light` in index.css)
          rather than a filtered version of the dark one. Only the active
          theme's image is ever downloaded. */}
      <div
        className={`${
          isDark ? "bg-hero-pattern bg-cover bg-no-repeat bg-center" : "hero-backdrop-light"
        } relative z-0`}
      >
        <Hero />
      </div>
      <About />
      <ValidatedExperience />
      <Experience />
      <Tech />
      {/* Certifications sits between the tech stack and the case studies. */}
      <Certifications />
      <Works />
      <TechnicalDecisions />
      <AwsArchitecture />
      <div className='relative z-0'>
        <Contact />
        <StarsCanvas />
      </div>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/mini-erp/*" element={<MiniErpApp />} />
            <Route path="*" element={<Portfolio />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
