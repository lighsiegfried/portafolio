import { useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { erpTranslations } from './erpTranslations';

/**
 * Mini ERP translation accessor.
 *
 * The dictionary is named `te` ("translate ERP") on purpose so it never collides
 * with the portfolio's `t` from `useLanguage()`. Components that need both can do
 * `const { t } = useLanguage(); const { te } = useErpTranslation();`.
 *
 * @returns {{ te: typeof erpTranslations.es, language: 'es' | 'en' }}
 */
const useErpTranslation = () => {
  const { language } = useLanguage();

  return useMemo(
    () => ({
      te: erpTranslations[language] || erpTranslations.es,
      language,
    }),
    [language]
  );
};

export default useErpTranslation;
