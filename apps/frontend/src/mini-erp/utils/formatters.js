/**
 * Locale-aware formatting helpers for the Mini ERP.
 *
 * Only the **locale** follows the active language — the currency code (`MXN`)
 * and every numeric option (rounding, digits) are unchanged, so amounts keep
 * meaning the same thing in both languages.
 *
 * The locale itself is not hardcoded here: it comes from the dictionary
 * (`formats.locale` -> `es-MX` / `en-US`), together with `formats.currency`
 * and `formats.emptyValue` (the `-` placeholder).
 *
 * Resolution order for the language, most specific first:
 *  1. the explicit `language` argument (`'es' | 'en'`, also accepts `'es-MX'`),
 *  2. the module-level language set through {@link setFormatterLanguage}
 *     (drive it from React with {@link useFormatterLanguage}),
 *  3. `document.documentElement.lang`, which `LanguageProvider` keeps in sync,
 *  4. `es`.
 *
 * Because of (1) and (2) every existing call site keeps working untouched.
 */
import { useLanguage } from '../../context/LanguageContext';
import { erpTranslations } from '../i18n/erpTranslations';

const DEFAULT_LANGUAGE = 'es';

/** Explicitly-set language. `null` until a consumer drives the setter. */
let activeLanguage = null;

/**
 * @param {unknown} language
 * @returns {'es' | 'en' | null}
 */
const normalizeLanguage = (language) => {
  if (typeof language !== 'string') return null;
  const lower = language.toLowerCase();
  if (lower.startsWith('en')) return 'en';
  if (lower.startsWith('es')) return 'es';
  return null;
};

/** `<html lang>` is written by `LanguageProvider`; used only as a fallback. */
const ambientLanguage = () => {
  if (typeof document === 'undefined') return null;
  return normalizeLanguage(document.documentElement.lang);
};

/**
 * Module-level setter so plain (non-React) call sites stay ergonomic.
 * @param {string} language
 * @returns {'es' | 'en'}
 */
export function setFormatterLanguage(language) {
  const next = normalizeLanguage(language);
  if (next) activeLanguage = next;
  return activeLanguage || DEFAULT_LANGUAGE;
}

/** @returns {'es' | 'en'} the language the formatters are currently using. */
export function getFormatterLanguage() {
  return activeLanguage || ambientLanguage() || DEFAULT_LANGUAGE;
}

/**
 * Keeps {@link setFormatterLanguage} in sync with `LanguageProvider`.
 * Call it once from a component that is always mounted inside the ERP
 * (e.g. `MiniErpLayout`); the assignment is idempotent, so running it on every
 * render (StrictMode included) is safe.
 * @returns {'es' | 'en'}
 */
export function useFormatterLanguage() {
  const { language } = useLanguage();
  setFormatterLanguage(language);
  return normalizeLanguage(language) || DEFAULT_LANGUAGE;
}

const resolveLanguage = (language) => normalizeLanguage(language) || getFormatterLanguage();

/** @returns {{ locale: string, currency: string, emptyValue: string }} */
const formatsFor = (language) =>
  (erpTranslations[resolveLanguage(language)] || erpTranslations[DEFAULT_LANGUAGE]).formats;

/** BCP-47 tag currently used by the formatters (`es-MX` / `en-US`). */
export function formatterLocale(language) {
  return formatsFor(language).locale;
}

/** The `-` placeholder rendered for missing values. */
export function emptyValue(language) {
  return formatsFor(language).emptyValue;
}

/**
 * @param {string | null | undefined} iso
 * @param {string} [language] — overrides the ambient language.
 */
export function formatDate(iso, language) {
  const { locale, emptyValue: dash } = formatsFor(language);
  if (!iso) return dash;
  try {
    return new Date(iso).toLocaleDateString(locale, {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  } catch { return iso; }
}

/**
 * @param {string | null | undefined} iso
 * @param {string} [language]
 */
export function formatDateTime(iso, language) {
  const { locale, emptyValue: dash } = formatsFor(language);
  if (!iso) return dash;
  try {
    return new Date(iso).toLocaleString(locale, {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return iso; }
}

/**
 * Currency is intentionally NOT translated: the data is in MXN in both languages.
 * @param {number | null | undefined} n
 * @param {string} [language]
 */
export function formatCurrency(n, language) {
  const { locale, currency, emptyValue: dash } = formatsFor(language);
  if (n == null) return dash;
  return new Intl.NumberFormat(locale, {
    style: 'currency', currency,
  }).format(n);
}

/**
 * @param {number | null | undefined} n
 * @param {string} [language]
 */
export function formatNumber(n, language) {
  const { locale, emptyValue: dash } = formatsFor(language);
  if (n == null) return dash;
  return new Intl.NumberFormat(locale).format(n);
}

/**
 * Requisition **and** lead status labels (the two key spaces do not overlap).
 * @param {string} status
 * @param {string} [language]
 */
export function statusLabel(status, language) {
  const dictionary = erpTranslations[resolveLanguage(language)] || erpTranslations[DEFAULT_LANGUAGE];
  return dictionary.status.requisition[status] || dictionary.status.lead[status] || status;
}
