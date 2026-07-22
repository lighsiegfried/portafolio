import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Link } from "react-router-dom";

// Portfolio-level case-study dialog built directly on the installed
// @radix-ui/react-dialog primitives. It is intentionally decoupled from the
// Mini ERP sub-application's own dialog component. Radix provides focus trap,
// Escape-to-close, focus return to the trigger, aria-modal, aria-labelledby
// (wired from Dialog.Title) and background scroll-lock out of the box.
//
// Rendering is data-driven and backward compatible:
//   - Legacy case studies use flat named fields (problem, solution,
//     architecture, capabilities, decisions, security, quality, limitations)
//     rendered in a fixed order.
//   - Richer case studies provide an ordered `sections` array of typed blocks
//     (prose | split | list | definitions | flows | groups | decisions | chips)
//     rendered in the given order after the header + metrics.
// The APK download action is env-driven: the URL is passed in as a prop
// (never hardcoded here); a missing value renders a disabled fallback.

const IconArrowRight = (props) => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true' focusable='false' {...props}>
    <path d='M5 12h14' />
    <path d='m13 6 6 6-6 6' />
  </svg>
);

const IconChevron = (props) => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true' focusable='false' {...props}>
    <path d='m9 6 6 6-6 6' />
  </svg>
);

const IconGithub = (props) => (
  <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true' focusable='false' {...props}>
    <path d='M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.31.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.021C22 6.484 17.523 2 12 2Z' />
  </svg>
);

const IconExternal = (props) => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true' focusable='false' {...props}>
    <path d='M15 3h6v6' />
    <path d='M10 14 21 3' />
    <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
  </svg>
);

const IconDownload = (props) => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true' focusable='false' {...props}>
    <path d='M12 3v12' />
    <path d='m7 10 5 5 5-5' />
    <path d='M5 21h14' />
  </svg>
);

const IconClose = (props) => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true' focusable='false' {...props}>
    <path d='M18 6 6 18' />
    <path d='m6 6 12 12' />
  </svg>
);

const Badge = ({ children }) => (
  <span className='inline-flex items-center rounded-full border border-[#915EFF]/40 bg-[#915EFF]/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-[#b18cff]'>
    {children}
  </span>
);

const SectionHeading = ({ title, badge }) => (
  <div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
    <h3 className='text-white font-bold text-[18px] sm:text-[20px]'>{title}</h3>
    {badge && <Badge>{badge}</Badge>}
  </div>
);

const BulletList = ({ items, columns }) => (
  <ul className={`mt-3 gap-x-6 ${columns === 2 ? "sm:columns-2" : ""}`}>
    {items.map((item, i) => (
      <li key={i} className='mb-2 flex break-inside-avoid gap-2 text-secondary text-[14px] leading-[22px]'>
        <span aria-hidden='true' className='mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#915EFF]' />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const Paragraphs = ({ body }) => {
  const parts = Array.isArray(body) ? body : [body];
  return (
    <>
      {parts.map((p, i) => (
        <p key={i} className={`text-secondary text-[14px] leading-[22px] ${i > 0 ? "mt-3" : "mt-3"}`}>
          {p}
        </p>
      ))}
    </>
  );
};

const Flow = ({ flow }) => (
  <div>
    {flow.label && (
      <p className='text-[13px] font-semibold uppercase tracking-wider text-[#b18cff]'>{flow.label}</p>
    )}
    <div className='mt-3 flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-stretch'>
      {flow.nodes.map((node, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <div className='flex items-center justify-center text-[#915EFF]'>
              <IconChevron className='h-5 w-5 rotate-90 sm:rotate-0' />
            </div>
          )}
          <div className='flex flex-1 items-center justify-center rounded-xl border border-[#915EFF]/25 bg-[#915EFF]/10 px-3 py-3 text-center text-[13px] font-medium text-white'>
            {node}
          </div>
        </React.Fragment>
      ))}
    </div>
  </div>
);

// Generic, typed section dispatcher for rich case studies.
const CaseStudySection = ({ section }) => {
  const { type, title, badge } = section;

  switch (type) {
    case "prose":
      return (
        <section className='mt-8'>
          <SectionHeading title={title} badge={badge} />
          <Paragraphs body={section.body} />
        </section>
      );

    case "split":
      return (
        <section className='mt-8'>
          {title && <SectionHeading title={title} badge={badge} />}
          <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 ${title ? "mt-3" : ""}`}>
            {section.columns.map((col, i) => (
              <div key={i}>
                <h4 className='text-white font-bold text-[16px] sm:text-[18px]'>{col.title}</h4>
                <Paragraphs body={col.body} />
              </div>
            ))}
          </div>
        </section>
      );

    case "list":
      return (
        <section className='mt-8'>
          <SectionHeading title={title} badge={badge} />
          <BulletList items={section.items} columns={section.columns} />
        </section>
      );

    case "definitions":
      return (
        <section className='mt-8'>
          <SectionHeading title={title} badge={badge} />
          <dl className='mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2'>
            {section.items.map((item, i) => (
              <div key={i} className='rounded-xl border border-white/10 bg-white/[0.03] p-3.5'>
                <dt className='text-white font-semibold text-[13px]'>{item.term}</dt>
                <dd className='mt-1 text-secondary text-[13px] leading-[20px]'>{item.desc}</dd>
              </div>
            ))}
          </dl>
        </section>
      );

    case "flows":
      return (
        <section className='mt-8'>
          <SectionHeading title={title} badge={badge} />
          <div className='mt-4 space-y-5'>
            {section.flows.map((flow, i) => (
              <Flow key={i} flow={flow} />
            ))}
          </div>
          {section.note && <p className='mt-4 text-secondary text-[13px] leading-[21px]'>{section.note}</p>}
        </section>
      );

    case "groups":
      return (
        <section className='mt-8'>
          <SectionHeading title={title} badge={badge} />
          <div className='mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2'>
            {section.groups.map((group, i) => (
              <div key={i} className='rounded-xl border border-white/10 bg-white/[0.03] p-4'>
                <p className='text-[12px] font-semibold uppercase tracking-wider text-[#b18cff]'>{group.category}</p>
                <ul className='mt-2 space-y-1'>
                  {group.items.map((it, j) => (
                    <li key={j} className='flex gap-2 text-secondary text-[13px] leading-[20px]'>
                      <span aria-hidden='true' className='mt-[8px] h-1 w-1 shrink-0 rounded-full bg-[#915EFF]' />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      );

    case "decisions":
      return (
        <section className='mt-8'>
          <SectionHeading title={title} badge={badge} />
          <div className='mt-3 space-y-3'>
            {section.items.map((d, i) => (
              <div key={i} className='rounded-xl border border-white/10 bg-white/[0.03] p-4'>
                <p className='text-white font-semibold text-[14px]'>{d.title}</p>
                <p className='mt-1 text-secondary text-[13px] leading-[21px]'>
                  <span className='text-[#b18cff]'>Motivo: </span>
                  {d.reason}
                </p>
                {d.tradeoff && (
                  <p className='mt-1 text-secondary text-[13px] leading-[21px]'>
                    <span className='text-[#b18cff]'>Compensación: </span>
                    {d.tradeoff}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      );

    case "chips":
      return (
        <section className='mt-8'>
          <SectionHeading title={title} badge={badge} />
          <div className='mt-3 flex flex-wrap gap-2'>
            {section.items.map((chip, i) => (
              <span key={i} className='rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-secondary text-[12px]'>
                {chip}
              </span>
            ))}
          </div>
        </section>
      );

    case "cards": {
      const cols = section.columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";
      return (
        <section className='mt-8'>
          <SectionHeading title={title} badge={badge} />
          <div className={`mt-3 grid grid-cols-1 gap-3 ${cols}`}>
            {section.items.map((card, i) => (
              <div key={i} className='rounded-xl border border-white/10 bg-white/[0.03] p-4'>
                <div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
                  <p className='text-white font-semibold text-[14px]'>{card.title}</p>
                  {card.badge && <Badge>{card.badge}</Badge>}
                </div>
                {card.desc && (
                  <p className='mt-1.5 text-secondary text-[13px] leading-[20px]'>{card.desc}</p>
                )}
                {card.items && card.items.length > 0 && (
                  <ul className='mt-2 space-y-1'>
                    {card.items.map((it, j) => (
                      <li key={j} className='flex gap-2 text-secondary text-[13px] leading-[20px]'>
                        <span aria-hidden='true' className='mt-[8px] h-1 w-1 shrink-0 rounded-full bg-[#915EFF]' />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "callout":
      return (
        <section className='mt-8'>
          <div className='rounded-xl border border-[#915EFF]/40 bg-[#915EFF]/10 p-4 sm:p-5'>
            {(title || badge) && (
              <div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
                {title && <h3 className='text-white font-bold text-[16px] sm:text-[18px]'>{title}</h3>}
                {badge && <Badge>{badge}</Badge>}
              </div>
            )}
            <Paragraphs body={section.body} />
          </div>
        </section>
      );

    default:
      return null;
  }
};

// Legacy fixed layout (kept for case studies that use flat named fields).
const LegacyBody = ({ problem, solution, architecture, capabilities, decisions, security, quality, limitations }) => (
  <>
    <div className='mt-8 grid grid-cols-1 gap-6 md:grid-cols-2'>
      {problem && (
        <section>
          <SectionHeading title='Problema' />
          <Paragraphs body={problem} />
        </section>
      )}
      {solution && (
        <section>
          <SectionHeading title='Solución' />
          <Paragraphs body={solution} />
        </section>
      )}
    </div>

    {(architecture.flows?.length || architecture.integrations?.length) && (
      <section className='mt-8'>
        <SectionHeading title='Arquitectura' />
        <div className='mt-4 space-y-5'>
          {(architecture.flows || []).map((flow, i) => (
            <Flow key={i} flow={flow} />
          ))}
        </div>
        {architecture.integrations?.length > 0 && (
          <div className='mt-5'>
            <p className='text-[13px] font-semibold uppercase tracking-wider text-[#b18cff]'>Integraciones</p>
            <BulletList items={architecture.integrations} />
          </div>
        )}
      </section>
    )}

    {capabilities.length > 0 && (
      <section className='mt-8'>
        <SectionHeading title='Capacidades de negocio' />
        <div className='mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2'>
          {capabilities.map((cap, i) => (
            <div key={i} className='rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-secondary text-[13px] leading-[20px]'>
              {cap}
            </div>
          ))}
        </div>
      </section>
    )}

    {decisions.length > 0 && (
      <section className='mt-8'>
        <SectionHeading title='Decisiones técnicas' />
        <div className='mt-3 space-y-3'>
          {decisions.map((d, i) => (
            <div key={i} className='rounded-xl border border-white/10 bg-white/[0.03] p-4'>
              <p className='text-white font-semibold text-[14px]'>{d.title}</p>
              <p className='mt-1 text-secondary text-[13px] leading-[21px]'>
                <span className='text-[#b18cff]'>Motivo: </span>
                {d.reason}
              </p>
            </div>
          ))}
        </div>
      </section>
    )}

    <div className='mt-8 grid grid-cols-1 gap-6 md:grid-cols-2'>
      {security.length > 0 && (
        <section>
          <SectionHeading title='Seguridad y fiabilidad' />
          <BulletList items={security} />
        </section>
      )}
      {quality.length > 0 && (
        <section>
          <SectionHeading title='Calidad y DevOps' />
          <BulletList items={quality} />
        </section>
      )}
    </div>

    {limitations.length > 0 && (
      <section className='mt-8'>
        <SectionHeading title='Limitaciones y evolución' />
        <BulletList items={limitations} />
      </section>
    )}
  </>
);

const ProjectCaseStudyDialog = ({
  caseStudy,
  open,
  onOpenChange,
  downloadLink,
  downloadLabel,
}) => {
  if (!caseStudy) return null;

  const {
    eyebrow,
    title,
    status,
    role,
    platform,
    hardware,
    scope,
    locale,
    badges = [],
    summary,
    problem,
    solution,
    metrics = [],
    architecture = {},
    capabilities = [],
    decisions = [],
    security = [],
    quality = [],
    limitations = [],
    sections,
    links = {},
  } = caseStudy;

  const useGeneric = Array.isArray(sections) && sections.length > 0;
  const demoHref = links.demo;
  const githubHref = links.github;
  const wantsDownload = Boolean(links.download);
  const isInternalDemo = typeof demoHref === "string" && demoHref.startsWith("/");
  const metaLine = [platform, hardware, scope, locale].filter(Boolean).join(" · ");
  const primaryBtn =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-[#915EFF] px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#7d43e0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#915EFF] focus-visible:ring-offset-2 focus-visible:ring-offset-tertiary";
  const secondaryBtn =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-[#915EFF]/40 bg-transparent px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:border-[#915EFF] hover:bg-[#915EFF]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#915EFF] focus-visible:ring-offset-2 focus-visible:ring-offset-tertiary";
  const dlLabel = downloadLabel || "Descargar app para Android";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 z-[10001] bg-black/70 backdrop-blur-sm' />
        <Dialog.Content className='fixed left-1/2 top-1/2 z-[10002] flex max-h-[90dvh] w-[95vw] max-w-5xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-[#915EFF]/30 bg-tertiary shadow-2xl focus:outline-none'>
          {/* Header (fixed; close button always reachable) */}
          <div className='relative border-b border-white/10 px-5 py-5 pr-14 sm:px-8'>
            <p className='text-[12px] font-semibold uppercase tracking-wider text-[#b18cff]'>{eyebrow}</p>
            <Dialog.Title className='mt-1 text-white font-bold text-[22px] sm:text-[28px] leading-tight'>
              {title}
            </Dialog.Title>
            <div className='mt-3 flex flex-wrap items-center gap-x-3 gap-y-2'>
              {status && (
                <span className='inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[12px] text-white'>
                  <span aria-hidden='true' className='h-2 w-2 rounded-full bg-emerald-400' />
                  {status}
                </span>
              )}
              {role && <span className='text-secondary text-[13px]'>{role}</span>}
            </div>
            {metaLine && <p className='mt-2 text-secondary text-[12px]'>{metaLine}</p>}
            {badges.length > 0 && (
              <div className='mt-3 flex flex-wrap gap-2'>
                {badges.map((b, i) => (
                  <Badge key={i}>{b}</Badge>
                ))}
              </div>
            )}

            <Dialog.Close
              className='absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black-200 text-secondary transition-colors hover:bg-[#915EFF]/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#915EFF] focus-visible:ring-offset-2 focus-visible:ring-offset-tertiary'
              aria-label='Cerrar caso de estudio'
            >
              <IconClose className='h-4 w-4' />
            </Dialog.Close>
          </div>

          {/* Body (scrollable) */}
          <div className='min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8'>
            <Dialog.Description className='text-secondary text-[15px] leading-[26px]'>
              {summary}
            </Dialog.Description>

            {metrics.length > 0 && (
              <div className='mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4'>
                {metrics.map((m, i) => (
                  <div key={i} className='rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center'>
                    <div className='text-[#915EFF] font-black text-[26px] sm:text-[30px] leading-none'>{m.value}</div>
                    <div className='mt-1.5 text-secondary text-[12px]'>{m.label}</div>
                  </div>
                ))}
              </div>
            )}

            {useGeneric ? (
              sections.map((section, i) => <CaseStudySection key={i} section={section} />)
            ) : (
              <LegacyBody
                problem={problem}
                solution={solution}
                architecture={architecture}
                capabilities={capabilities}
                decisions={decisions}
                security={security}
                quality={quality}
                limitations={limitations}
              />
            )}
          </div>

          {/* Footer (fixed) */}
          {(wantsDownload || demoHref || githubHref || links.note) && (
            <div className='flex flex-col gap-3 border-t border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-8'>
              {links.note && (
                <p className='text-secondary text-[12px] sm:mr-auto'>{links.note}</p>
              )}
              {wantsDownload &&
                (downloadLink ? (
                  <a
                    href={downloadLink}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label={`${dlLabel}, se abre en una nueva pestaña`}
                    className={primaryBtn}
                  >
                    <IconDownload className='h-4 w-4' />
                    {dlLabel}
                  </a>
                ) : (
                  <span
                    aria-disabled='true'
                    className='inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-[14px] font-semibold text-secondary opacity-60'
                  >
                    Descarga temporalmente no disponible
                  </span>
                ))}

              {demoHref &&
                (isInternalDemo ? (
                  <Link to={demoHref} onClick={() => onOpenChange(false)} className={primaryBtn}>
                    Abrir Mini ERP
                    <IconArrowRight className='h-4 w-4' />
                  </Link>
                ) : (
                  <a href={demoHref} target='_blank' rel='noopener noreferrer' className={primaryBtn}>
                    Abrir demo
                    <IconExternal className='h-4 w-4' />
                  </a>
                ))}

              {githubHref && (
                <a
                  href={githubHref}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label='Ver código en GitHub, se abre en una nueva pestaña'
                  className={secondaryBtn}
                >
                  <IconGithub className='h-4 w-4' />
                  Ver código en GitHub
                </a>
              )}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ProjectCaseStudyDialog;
