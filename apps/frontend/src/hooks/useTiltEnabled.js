import { useEffect, useState } from "react";

// Returns true only when the interactive 3D tilt should run:
// - the primary pointer is fine (mouse/trackpad), NOT coarse (touch), and
// - the user has NOT requested reduced motion at the OS level.
//
// This deliberately does not use viewport width, because a large touch screen
// (tablet/touch laptop) must still be treated as a stable, tilt-free surface.
// The value updates live if the user plugs in a mouse or flips the OS
// reduced-motion preference.

const COARSE_POINTER = "(pointer: coarse)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const computeEnabled = () => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return true;
  }
  const isCoarse = window.matchMedia(COARSE_POINTER).matches;
  const prefersReduced = window.matchMedia(REDUCED_MOTION).matches;
  return !isCoarse && !prefersReduced;
};

export default function useTiltEnabled() {
  const [enabled, setEnabled] = useState(computeEnabled);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }
    const coarse = window.matchMedia(COARSE_POINTER);
    const reduced = window.matchMedia(REDUCED_MOTION);
    const update = () => setEnabled(!coarse.matches && !reduced.matches);

    update();
    coarse.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      coarse.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  return enabled;
}
