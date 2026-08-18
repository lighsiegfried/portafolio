import { Html, useProgress } from "@react-three/drei";

/**
 * Suspense fallback rendered *inside* a `<Canvas>`.
 *
 * React Three Fiber renders this through its own reconciler, so the component
 * cannot call `useLanguage()` itself. The two strings are therefore passed in
 * as props by the DOM-level canvas wrapper (Ball/Computers/Earth), which is
 * where the hook is legal. Both are optional: without them the loader falls
 * back to the bare, language-neutral numeral it always showed.
 *
 * @param {object} props
 * @param {string} [props.label] Accessible name for the loading state
 *   (`t.common.loadingScene`).
 * @param {string} [props.percentLabel] `t.common.loadingPercent`, a template
 *   carrying the literal `{progress}` placeholder.
 */
const CanvasLoader = ({ label, percentLabel }) => {
  const { progress } = useProgress();
  const value = progress.toFixed(2);
  const text = percentLabel ? percentLabel.replace("{progress}", value) : `${value}%`;

  return (
    <Html
      as='div'
      center
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {/* The spinner is the live region: it is visually the loading indicator
          and carries no text of its own, so the accessible name lands here.
          The numeral below is decorative for assistive tech — announcing a
          percentage on every progress tick is noise. */}
      <span className='canvas-loader' role='status' aria-label={label}></span>
      <p
        aria-hidden='true'
        style={{
          fontSize: 14,
          // Was a hardcoded near-white literal, invisible on a light page.
          color: "rgb(var(--c-ink))",
          fontWeight: 800,
          marginTop: 40,
        }}
      >
        {text}
      </p>
    </Html>
  );
};

export default CanvasLoader;
