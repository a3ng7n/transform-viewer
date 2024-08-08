'use client'

import { Canvas } from "@react-three/fiber";

function Viewport() {
  return (
    <div className="w-full h-full">
      <Canvas />
    </div>
  )
}

export { Viewport };
