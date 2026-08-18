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
      {/* `herobg.png` is a near-black photograph, so light mode swaps it for an
          aurora gradient instead of trying to tint the artwork. */}
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
