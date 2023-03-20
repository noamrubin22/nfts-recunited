import React, { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

interface CanvasContainerProps {
  position?: [x: number, y: number, z: number];
  fov?: number;
  rotateSpeed?: number;
  zoom?: number;
}

const CanvasContainer: React.FC<CanvasContainerProps> = ({
  position = [-15, 1, 10],
  fov = 6,
  rotateSpeed = 1,
  zoom = 1,
  children,
}) => {
  useEffect(() => {}, [zoom]);
  return (
    <Canvas
      camera={{
        position,
        fov,
        zoom,
      }}
      className="diamond"
    >
      <ambientLight intensity={1} />
      <directionalLight position={[0, 5, 5]} />
      <directionalLight position={[10, 15, 15]} />
      <directionalLight position={[-10, -15, -5]} />
      <OrbitControls rotateSpeed={rotateSpeed} />
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  );
};

export default CanvasContainer;
