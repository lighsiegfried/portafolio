import { logo } from "../assets";
import { styles } from "../styles";
import { useLanguage } from "../context/LanguageContext";
import { CREDLY_PROFILE_URL } from "../data/certifications";

/**
 * Anchor ids the footer can jump to, paired with the `t.nav` key that labels
 * each one. Every `id` is rendered by a section that registers the matching
 * `hash-span` through `SectionWrapper(Component, id)`, so these stay in sync
 * with the scroll targets the navbar uses.
 *
 * The anchor id and the dictionary key are deliberately kept as separate
 * fields: the ids are historical (`work`, `works`, `tech`) while `t.nav` is
 * keyed semantically (`experience`, `projects`, `techStack`). Mapping here
 * avoids duplicating those labels in the dictionary under a second name.
 *
 * @type {ReadonlyArray<{ id: string, key: string }>}
 */
const QUICK_LINKS = [
  { id: "about", key: "about" },
  { id: "work", key: "experience" },
  { id: "tech", key: "techStack" },
  { id: "certifications", key: "certifications" },
  { id: "works", key: "projects" },
  { id: "architecture", key: "architecture" },
  { id: "contact", key: "contact" },
];

/**
 * External profiles. Labels are proper nouns, so they are intentionally NOT
 * translated; only the surrounding heading comes from the dictionary.
 *
 * LinkedIn is deliberately absent: no LinkedIn URL exists anywhere in the
 * repository, and inventing one would ship a dead link.
 *
 * @type {ReadonlyArray<{ label: string, href: string }>}
 */
const EXTERNAL_LINKS = [
  { label: "Credly", href: CREDLY_PROFILE_URL },
  { label: "GitHub", href: "https://github.com/lighsiegfried" },
];

const Footer = () => {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className={`${styles.paddingX} w-full bg-primary border-t border-line/10 py-10`}>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-8'>
          {/* Brand */}
          <div>
            <div className='flex items-center gap-2'>
              <img src={logo} alt='' aria-hidden='true' className='w-9 h-9 object-contain' />
              <span className='text-ink text-[18px] font-bold'>Wilson Vasquez</span>
            </div>
            <p className='mt-3 text-secondary text-[14px] leading-[22px] max-w-[280px]'>
              {t.footer.tagline}
            </p>
          </div>

          {/* In-page navigation */}
          <nav aria-label={t.footer.quickLinks}>
            <h2 className='text-ink text-[15px] font-semibold tracking-wide'>
              {t.footer.quickLinks}
            </h2>
            <ul className='mt-3 grid grid-cols-2 gap-x-4 gap-y-2 list-none'>
              {QUICK_LINKS.map(({ id, key }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className='text-secondary hover:text-accentv text-[14px] transition-colors'
                  >
                    {t.nav[key]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* External profiles */}
          <div>
            <h2 className='text-ink text-[15px] font-semibold tracking-wide'>
              {t.footer.connect}
            </h2>
            <ul className='mt-3 flex flex-col gap-2 list-none'>
              {EXTERNAL_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label={`Wilson Vasquez — ${label}`}
                    className='text-secondary hover:text-accentv text-[14px] transition-colors'
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className='mt-8 pt-5 border-t border-line/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
          <p className='text-secondary text-[13px]'>
            {`© ${year} Wilson Vasquez. ${t.footer.rights}`}
          </p>
          <p className='text-secondary text-[13px]'>{t.footer.builtWith}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
