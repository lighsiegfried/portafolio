import { useMemo } from "react";

import { localize, useLanguage } from "../context/LanguageContext";

/**
 * Memoized wrapper around `localize()` for bilingual data trees coming from
 * `src/constants`. Recomputes only when the active language or the source
 * reference changes, so the deep walk never runs on unrelated re-renders.
 *
 * @template T
 * @param {T} data bilingual tree whose translatable leaves are `{ es, en }`
 * @returns {unknown} the same shape with every leaf resolved to one string
 */
const useLocalized = (data) => {
  const { language } = useLanguage();
  return useMemo(() => localize(data, language), [data, language]);
};

export default useLocalized;
