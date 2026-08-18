import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { translations } from "../data/translations";

/**
 * @typedef {"es" | "en"} Language
 * @typedef {import("../data/translations").TranslationSchema} TranslationSchema
 * @typedef {{
 *   language: Language,
 *   toggleLanguage: () => void,
 *   setLanguage: (lang: Language) => void,
 *   t: TranslationSchema,
 *   localize: <T>(value: T) => unknown,
 * }} LanguageContextValue
 */

const STORAGE_KEY = "app-lang";

/** @type {React.Context<LanguageContextValue | undefined>} */
const LanguageContext = createContext(undefined);

/**
 * English is the default locale. Only a language the visitor explicitly chose
 * (and which was therefore persisted under `app-lang`) switches the site to
 * Spanish; a first-time visitor always lands in English regardless of their
 * browser locale.
 *
 * The identical rule is duplicated in the no-flash bootstrap in `index.html`.
 * The two must agree: if that script sniffed `navigator.language` while this
 * one defaulted to English, a Spanish-locale browser would paint `<html
 * lang="es">` and then render English copy.
 *
 * @returns {Language}
 */
const DEFAULT_LANGUAGE = "en";

/** @returns {Language} */
const readInitialLanguage = () => {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "es" || saved === "en") return saved;
  } catch {
    // Blocked storage: fall through to the default.
  }

  return DEFAULT_LANGUAGE;
};

/**
 * Collapse a bilingual data tree down to a single language.
 *
 * Content in `src/constants` keeps every translatable string as a
 * `{ es, en }` leaf so structural data (images, icons, links, ids, colors)
 * stays written once. This walker resolves those leaves for the active
 * language and leaves everything else untouched.
 *
 * @template T
 * @param {T} value
 * @param {Language} language
 * @returns {unknown}
 */
export const localize = (value, language) => {
  if (Array.isArray(value)) return value.map((item) => localize(item, language));

  // Only walk plain objects. React elements, class instances and imported
  // asset URLs must pass through untouched.
  if (
    value === null ||
    typeof value !== "object" ||
    value.$$typeof !== undefined ||
    (Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null)
  ) {
    return value;
  }

  const keys = Object.keys(value);
  const isTranslationLeaf =
    keys.length === 2 &&
    Object.prototype.hasOwnProperty.call(value, "es") &&
    Object.prototype.hasOwnProperty.call(value, "en");

  if (isTranslationLeaf) return localize(value[language], language);

  const resolved = {};
  for (const key of keys) resolved[key] = localize(value[key], language);
  return resolved;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(readInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;

    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Persisting is best-effort.
    }
  }, [language]);

  const setLanguage = useCallback((next) => {
    if (next === "es" || next === "en") setLanguageState(next);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => (prev === "es" ? "en" : "es"));
  }, []);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t: translations[language],
      localize: (data) => localize(data, language),
    }),
    [language, setLanguage, toggleLanguage]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

/** @returns {LanguageContextValue} */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export default LanguageContext;
