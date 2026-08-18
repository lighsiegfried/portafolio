// Shared typography/spacing recipes for the portfolio sections.
//
// Colors here are theme tokens (see `tailwind.config.cjs` + `src/index.css`):
//   text-ink      -> #ffffff in dark, #0b1220 in light
//   text-secondary-> #aaa6c3 in dark, #475569 in light
//   --c-hero-sub  -> #dfd9ff in dark, #334155 in light
// so a single `.dark` class on <html> repaints every section that uses them.
const styles = {
  paddingX: "sm:px-16 px-5",
  paddingY: "sm:py-20 py-8",
  padding: "sm:px-16 px-5 sm:py-20 py-8",

  heroHeadText:
    "font-black text-ink lg:text-[80px] sm:text-[60px] xs:text-[44px] text-[34px] lg:leading-[98px] mt-2",
  heroSubText:
    "text-[rgb(var(--c-hero-sub))] font-medium lg:text-[30px] sm:text-[26px] xs:text-[20px] text-[16px] lg:leading-[40px]",
  // Hero paragraph. Uses `--c-hero-body` instead of `text-secondary`: the hero
  // is the one place body copy sits on artwork rather than a flat surface, and
  // #475569 measured 2.6:1 over the light background's violet nodes. The dark
  // value is the same #aaa6c3 it always was.
  heroBodyText:
    "text-[rgb(var(--c-hero-body))] text-[14px] leading-[26px] sm:leading-[30px]",

  sectionHeadText:
    "text-ink font-black md:text-[60px] sm:text-[50px] xs:text-[36px] text-[28px]",
  sectionSubText:
    "md:text-[18px] sm:text-[16px] text-[13px] text-secondary uppercase tracking-wider",
};

export { styles };
