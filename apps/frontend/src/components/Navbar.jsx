import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { styles } from "../styles";
import { navLinks } from "../constants";
import { logo, menu, close } from "../assets";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

const SunIcon = (props) => (
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
    <circle cx='12' cy='12' r='4' />
    <path d='M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41' />
  </svg>
);

const MoonIcon = (props) => (
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
    <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z' />
  </svg>
);

const GlobeIcon = (props) => (
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
    <circle cx='12' cy='12' r='9' />
    <path d='M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18' />
  </svg>
);

/** Shared chrome for the two control pills so they stay visually identical. */
const controlClass =
  "inline-flex items-center gap-1.5 rounded-lg border border-line/[0.15] bg-line/[0.04] px-2.5 py-1.5 text-[13px] font-bold text-secondary transition-colors hover:border-accentv hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accentv focus-visible:ring-offset-2 focus-visible:ring-offset-primary";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { language, toggleLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 100) {
         setScrolled(true);
      } else {
         setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const themeLabel = isDark ? t.common.light : t.common.dark;
  const nextLanguage = language === "es" ? "EN" : "ES";

  return (
    <nav
      className={`${
        styles.paddingX
      } w-full flex items-center py-5 fixed top-0 z-[9999] transition-all duration-300 ${
        scrolled
          ? "bg-primary/80 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_20px_rgba(0,0,0,0.3)]"
          : "bg-transparent"
      }`}
    >
      <div className='w-full flex justify-between items-center max-w-7xl mx-auto'>
        <Link
          to='/'
          className='flex items-center gap-2'
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <img src={logo} alt='' aria-hidden='true' className='w-9 h-9 object-contain' />
          <p className='text-ink text-[18px] font-bold cursor-pointer flex '>
            Wilson &nbsp;
            <span className='sm:block hidden'> | Software Engineer</span>
          </p>
        </Link>

        <div className='hidden lg:flex flex-row items-center gap-5 xl:gap-7'>
          <ul className='list-none flex flex-row gap-5 xl:gap-6'>
            {navLinks.map((nav) => (
              <li
                key={nav.id}
                className={`${
                  active === nav.id ? "text-ink" : "text-secondary"
                } hover:text-ink text-[16px] font-medium cursor-pointer transition-colors`}
                onClick={() => setActive(nav.id)}
              >
                <a href={`/#${nav.id}`}>{t.nav[nav.key]}</a>
              </li>
            ))}
            <li className="text-secondary hover:text-ink text-[16px] font-medium cursor-pointer transition-colors">
              <Link to="/mini-erp/login">{t.nav.erpDemo}</Link>
            </li>
          </ul>

          <div className='flex items-center gap-2'>
            <button
              type='button'
              onClick={toggleLanguage}
              aria-label={`${t.nav.toggleLanguage} (${nextLanguage})`}
              title={t.nav.toggleLanguage}
              className={controlClass}
            >
              <GlobeIcon className='w-3.5 h-3.5 text-accentv' />
              <span>{language.toUpperCase()}</span>
            </button>

            <button
              type='button'
              onClick={toggleTheme}
              aria-label={`${t.nav.toggleTheme} (${themeLabel})`}
              title={t.nav.toggleTheme}
              className={controlClass}
            >
              {isDark ? (
                <SunIcon className='w-4 h-4 text-amber-400' />
              ) : (
                <MoonIcon className='w-4 h-4 text-accentv' />
              )}
            </button>
          </div>
        </div>

        <div className='lg:hidden flex flex-1 justify-end items-center gap-2'>
          <button
            type='button'
            onClick={toggleLanguage}
            aria-label={`${t.nav.toggleLanguage} (${nextLanguage})`}
            className={controlClass}
          >
            {language.toUpperCase()}
          </button>
          <button
            type='button'
            onClick={toggleTheme}
            aria-label={`${t.nav.toggleTheme} (${themeLabel})`}
            className={`${controlClass} px-2`}
          >
            {isDark ? (
              <SunIcon className='w-4 h-4 text-amber-400' />
            ) : (
              <MoonIcon className='w-4 h-4 text-accentv' />
            )}
          </button>

          <button
            type='button'
            onClick={() => setToggle(!toggle)}
            aria-label={toggle ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={toggle}
            className='p-0 border-none bg-transparent'
          >
            <img
              src={toggle ? close : menu}
              alt=''
              aria-hidden='true'
              className='w-[28px] h-[28px] object-contain dark:invert-0 invert'
            />
          </button>

          <div
            className={`${
              !toggle ? "hidden" : "flex"
            } p-6 bg-primary/90 backdrop-blur-lg border border-line/10 absolute top-20 right-0 mx-4 my-2 min-w-[180px] z-[10000] rounded-xl shadow-2xl`}
          >
            <ul className='list-none flex justify-end items-start flex-1 flex-col gap-4'>
              {navLinks.map((nav) => (
                <li
                  key={nav.id}
                  className={`font-poppins font-medium cursor-pointer text-[16px] ${
                    active === nav.id ? "text-ink" : "text-secondary"
                  }`}
                  onClick={() => {
                    setToggle(!toggle);
                    setActive(nav.id);
                  }}
                >
                  <a href={`/#${nav.id}`}>{t.nav[nav.key]}</a>
                </li>
              ))}
              <li className="font-poppins font-medium cursor-pointer text-[16px] text-secondary">
                <Link to="/mini-erp/login" onClick={() => setToggle(!toggle)}>{t.nav.erpDemo}</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
