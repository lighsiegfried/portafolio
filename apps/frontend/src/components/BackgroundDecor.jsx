

const GridPattern = () => (
  <div
    className="absolute inset-0 pointer-events-none z-0"
    style={{
      backgroundImage: `
        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
      `,
      backgroundSize: "60px 60px",
    }}
  />
);

const NoiseOverlay = () => (
  <div
    className="absolute inset-0 pointer-events-none z-0 opacity-[0.015]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat",
      backgroundSize: "128px 128px",
    }}
  />
);

const AccentGlows = () => (
  <>
    <div
      className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
      style={{
        background: "radial-gradient(circle, rgba(128,77,238,0.08) 0%, transparent 70%)",
      }}
    />
    <div
      className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
      style={{
        background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)",
      }}
    />
    <div
      className="absolute top-3/4 left-1/3 w-[400px] h-[400px] rounded-full pointer-events-none z-0"
      style={{
        background: "radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%)",
      }}
    />
  </>
);

const AbstractLines = () => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
    <svg
      className="absolute top-0 right-0 w-[600px] h-[600px]"
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M600 0L400 200L450 400L300 600"
        stroke="url(#gradient1)"
        strokeWidth="0.5"
        opacity="0.3"
      />
      <path
        d="M600 100L350 300L500 500"
        stroke="url(#gradient1)"
        strokeWidth="0.3"
        opacity="0.2"
      />
      <path
        d="M500 0L250 250L400 450L200 600"
        stroke="url(#gradient1)"
        strokeWidth="0.4"
        opacity="0.15"
      />
      <defs>
        <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#804dee" stopOpacity="0" />
          <stop offset="50%" stopColor="#804dee" />
          <stop offset="100%" stopColor="#804dee" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
    <svg
      className="absolute bottom-0 left-0 w-[500px] h-[500px]"
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 500L150 350L100 200L250 0"
        stroke="url(#gradient2)"
        strokeWidth="0.5"
        opacity="0.25"
      />
      <path
        d="M0 400L200 250L100 100L300 0"
        stroke="url(#gradient2)"
        strokeWidth="0.3"
        opacity="0.15"
      />
      <defs>
        <linearGradient id="gradient2" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

const SectionGlow = ({ position, size, color }) => (
  <div
    className="absolute pointer-events-none z-0"
    style={{
      top: position.top,
      left: position.left,
      width: size,
      height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      transform: "translate(-50%, -50%)",
    }}
  />
);

const BackgroundDecor = ({ variant = "default" }) => {
  return (
    // pointer-events-none: this decorative, aria-hidden layer must never become
    // a hit target. Without it, the wrapper (default pointer-events: auto) can
    // repaint over card content once each card's Framer Motion / Tilt stacking
    // context collapses at rest, intermittently swallowing hover/click on the
    // card action buttons. Every child layer already opts out of pointer events;
    // the wrapper must too.
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      <GridPattern />
      <NoiseOverlay />
      <AbstractLines />

      {variant === "hero" && (
        <>
          <SectionGlow
            position={{ top: "50%", left: "50%" }}
            size="800px"
            color="rgba(128,77,238,0.1)"
          />
        </>
      )}

      {variant === "tech" && (
        <>
          <SectionGlow
            position={{ top: "30%", left: "20%" }}
            size="600px"
            color="rgba(128,77,238,0.08)"
          />
          <SectionGlow
            position={{ top: "70%", left: "80%" }}
            size="500px"
            color="rgba(6,182,212,0.06)"
          />
        </>
      )}

      {variant === "architecture" && (
        <>
          <SectionGlow
            position={{ top: "40%", left: "50%" }}
            size="700px"
            color="rgba(128,77,238,0.1)"
          />
          <SectionGlow
            position={{ top: "60%", left: "30%" }}
            size="400px"
            color="rgba(6,182,212,0.08)"
          />
        </>
      )}

      {variant === "contact" && (
        <SectionGlow
          position={{ top: "50%", left: "50%" }}
          size="600px"
          color="rgba(128,77,238,0.08)"
        />
      )}

      {variant === "default" && <AccentGlows />}
    </div>
  );
};

export default BackgroundDecor;
