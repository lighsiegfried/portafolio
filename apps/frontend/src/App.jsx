import { BrowserRouter, Routes, Route } from "react-router-dom";

import { About, AwsArchitecture, Contact, Experience, Hero, Navbar, Tech, TechnicalDecisions, ValidatedExperience, Works, StarsCanvas } from "./components";
import BackgroundDecor from "./components/BackgroundDecor";
import MiniErpApp from "./mini-erp/MiniErpApp";

const Portfolio = () => (
  <div className='relative z-0 bg-primary'>
    <BackgroundDecor />
    <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center relative z-0'>
      <Navbar />
      <Hero />
    </div>
    <About />
    <ValidatedExperience />
    <Experience />
    <Tech />
    <Works />
    <TechnicalDecisions />
    <AwsArchitecture />
    <div className='relative z-0'>
      <Contact />
      <StarsCanvas />
    </div>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/mini-erp/*" element={<MiniErpApp />} />
        <Route path="*" element={<Portfolio />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
