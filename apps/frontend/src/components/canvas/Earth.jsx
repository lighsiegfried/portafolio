import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";
import ErrorBoundary from "../ErrorBoundary";
import { useLanguage } from "../../context/LanguageContext";
import { fixNaNPositions } from "../../utils/threeFix";

// The planet ships its own baked materials and no scene lights are added here,
// so the render is identical on either page ground — nothing to re-tune.
const Earth = () => {
  const { scene } = useGLTF("./planet/scene.gltf");
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

  return (
    <primitive object={scene} scale={2.5} position-y={0} rotation-y={0} />
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

const EarthCanvas = () => {
  // Hook lives in the DOM tree; the strings travel into the r3f scene as props.
  const { t } = useLanguage();

  return (
    <ErrorBoundary fallback={<Fallback message={t.common.sceneUnavailable} />}>
      <Canvas
        shadows
        frameloop='demand'
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [-4, 3, 6],
        }}
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
            autoRotate
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
          <Earth />

          <Preload all />
        </Suspense>
      </Canvas>
    </ErrorBoundary>
  );
};

export default EarthCanvas;
