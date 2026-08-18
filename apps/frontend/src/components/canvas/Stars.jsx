import { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import ErrorBoundary from "../ErrorBoundary";
import { useTheme } from "../../context/ThemeContext";

// WebGL materials cannot read CSS custom properties, so the two theme values
// are mirrored here as literals. They track `--c-accent-violet`:
//   dark  -> the original #f272c8 night-sky pink on #050816
//   light -> #6d3dd6, the light-mode accent violet, dimmed so 5000 points read
//            as a faint drifting particle field on #f4f6fb instead of dust.
const STAR_COLOR_DARK = "#f272c8";
const STAR_COLOR_LIGHT = "#6d3dd6";
const STAR_OPACITY_DARK = 1;
const STAR_OPACITY_LIGHT = 0.55;

const Stars = ({ color = STAR_COLOR_DARK, opacity = STAR_OPACITY_DARK, ...props }) => {
  const ref = useRef();
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.2 }));

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color={color}
          opacity={opacity}
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas = () => {
  // Read the theme out here: `Stars` lives inside the R3F reconciler, but its
  // props are evaluated in this DOM-level component, where the hook is legal.
  const { isDark } = useTheme();

  return (
    <ErrorBoundary>
      <div className='w-full h-auto absolute inset-0 z-[-1]'>
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Suspense fallback={null}>
            <Stars
              color={isDark ? STAR_COLOR_DARK : STAR_COLOR_LIGHT}
              opacity={isDark ? STAR_OPACITY_DARK : STAR_OPACITY_LIGHT}
            />
          </Suspense>

          <Preload all />
        </Canvas>
      </div>
    </ErrorBoundary>
  );
};

export default StarsCanvas;
