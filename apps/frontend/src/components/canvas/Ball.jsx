import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Decal,
  Float,
  OrbitControls,
  Preload,
  useTexture,
} from "@react-three/drei";
import CanvasLoader from "../Loader";
import ErrorBoundary from "../ErrorBoundary";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

// The icosahedron is lit front-on, so its fully lit faces render at almost the
// material color. The original cream (#fff8eb) sat on #050816 with plenty of
// separation but dissolves into the light page ground (#f4f6fb), leaving only
// the shaded rim. Light mode therefore uses a soft lavender-grey: the sphere
// keeps a silhouette, and the Decal (its own lit material) is untouched, so
// logo legibility is identical in both themes.
const BALL_COLOR_DARK = "#fff8eb";
const BALL_COLOR_LIGHT = "#e6e1f5";

const Ball = ({ imgUrl, color = BALL_COLOR_DARK }) => {
  const texture = useTexture(imgUrl);
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.01;
    }
  });

  return (
    <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 0, 0.05]} />
      <mesh ref={meshRef} castShadow receiveShadow scale={2.75}>
        <icosahedronGeometry args={[1, 3]} />
        <meshStandardMaterial
          color={color}
          polygonOffset
          polygonOffsetFactor={-5}
          flatShading
        />
        <Decal
          position={[0, 0, 1]}
          rotation={[0, 0, 0]}
          scale={1.1}
          map={texture}
          flatShading
        />
      </mesh>
    </Float>
  );
};

const Fallback = ({ message }) => (
  <div
    role='status'
    aria-label={message}
    title={message}
    className="w-12 h-12 border-2 border-accentv/30 border-t-accentv rounded-full animate-spin"
  />
);

const BallCanvas = ({ icon }) => {
  // Both hooks run here, in the DOM tree: the r3f reconciler does not carry
  // this context down, but props evaluated in this render do reach the scene.
  const { t } = useLanguage();
  const { isDark } = useTheme();

  return (
    <ErrorBoundary fallback={<Fallback message={t.common.sceneUnavailable} />}>
      <Canvas
        frameloop='always'
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true }}
      >
        <Suspense
          fallback={
            <CanvasLoader
              label={t.common.loadingScene}
              percentLabel={t.common.loadingPercent}
            />
          }
        >
          <OrbitControls enableZoom={false} />
          <Ball imgUrl={icon} color={isDark ? BALL_COLOR_DARK : BALL_COLOR_LIGHT} />
        </Suspense>
        <Preload all />
      </Canvas>
    </ErrorBoundary>
  );
};

export default BallCanvas;
