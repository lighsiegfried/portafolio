import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";
import ErrorBoundary from "../ErrorBoundary";
import { useLanguage } from "../../context/LanguageContext";
import { fixNaNPositions } from "../../utils/threeFix";

const Computers = ({ isMobile }) => {
  const { scene } = useGLTF("./desktop_pc/scene.gltf");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (scene) {
      try {
        fixNaNPositions(scene);
      } catch (_) {}
      setReady(true);
    }
  }, [scene]);

  if (!ready) return null;

  // Lighting is intentionally theme-independent: the desktop_pc model is a
  // dark asset, so the key spotlight that made it read against #050816 gives it
  // *more* contrast against the light page ground, not less.
  return (
    <mesh>
      <hemisphereLight intensity={0.15} groundColor='black' />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={1} />
      <primitive
        object={scene}
        scale={isMobile ? 0.65 : 0.75}
        position={isMobile ? [0, -2.8, -2.5] : [0, -3.25, -1.5]}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </mesh>
  );
};

const Fallback = ({ message }) => (
  <div className="w-full h-full flex items-center justify-center">
    <div
      role='status'
      aria-label={message}
      title={message}
      className="w-12 h-12 border-2 border-accentv/30 border-t-accentv rounded-full animate-spin"
    />
  </div>
);

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  // Hook lives in the DOM tree; the strings travel into the r3f scene as props.
  const { t } = useLanguage();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };
    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <ErrorBoundary fallback={<Fallback message={t.common.sceneUnavailable} />}>
      <Canvas
        frameloop='demand'
        shadows
        dpr={[1, 2]}
        camera={{
          position: isMobile ? [18, 3, 5] : [20, 3, 5],
          fov: isMobile ? 30 : 25,
        }}
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
          <OrbitControls
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
          <Computers isMobile={isMobile} />
        </Suspense>

        <Preload all />
      </Canvas>
    </ErrorBoundary>
  );
};

export default ComputersCanvas;
