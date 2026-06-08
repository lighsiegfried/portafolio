import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";
import ErrorBoundary from "../ErrorBoundary";
import { fixNaNPositions } from "../../utils/threeFix";

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

const Fallback = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="w-12 h-12 border-2 border-violet-500/30 border-t-violet-400 rounded-full animate-spin" />
  </div>
);

const EarthCanvas = () => {
  return (
    <ErrorBoundary fallback={<Fallback />}>
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
        <Suspense fallback={<CanvasLoader />}>
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
