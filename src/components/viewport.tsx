"use client";

import {
  Environment,
  GizmoHelper,
  GizmoViewport,
  Grid,
  OrbitControls,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { TransformChainT } from "~/lib/transforms-store";
import { useTransformStore } from "~/providers/transforms-store-provider";

function RotateQuaternionView() {
  return <></>;
}

function TranslateVector3View() {
  return <></>;
}

type TransformChainViewProps = {
  chainIndex: number;
} & TransformChainT;

function TransformChainView({
  chainIndex,
  ...chainData
}: TransformChainViewProps) {
  const transformViews = chainData.transforms.map(
    (transform, transformIndex) => {
      switch (transform.type) {
        case "translation": {
          return <TranslateVector3View />;
        }
        case "rotation": {
          return <RotateQuaternionView />;
        }
      }
    },
  );

  return <></>;
}

function Viewport() {
  const { chains } = useTransformStore((state) => state);

  const chainViews = chains.map((chain, chainIndex) => (
    <TransformChainView chainIndex={chainIndex} {...chain} />
  ));

  return (
    <div className="h-full w-full">
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
  );
}

export { Viewport };
