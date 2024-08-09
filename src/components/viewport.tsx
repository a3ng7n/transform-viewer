'use client'

import { Environment, GizmoHelper, GizmoViewport, Grid, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

function Viewport() {
  return (
    <div className="w-full h-full">
      <Canvas shadows camera={{ position: [5, 5, 5] }} resize={{ debounce: 0 }}>
        <mesh>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
        <Grid fadeFrom={0} infiniteGrid fadeDistance={25} fadeStrength={5} />
        <OrbitControls makeDefault />
        <Environment preset="apartment" />
        <GizmoHelper alignment="bottom-right">
          <GizmoViewport />
        </GizmoHelper>
      </Canvas>
    </div>
  )
}

export { Viewport };
