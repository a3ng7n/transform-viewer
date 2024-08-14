"use client";

import {
  Environment,
  GizmoHelper,
  GizmoViewport,
  Grid,
  OrbitControls,
} from "@react-three/drei";
import { Canvas, type MeshProps } from "@react-three/fiber";
import { type ReactElement, useRef } from "react";
import type { ArrowHelper } from "three";
import * as THREE from "three";
import {
  type RotateQuaternion,
  type TransformChainT,
  type TranslateVector3,
  isTransformValid,
} from "~/lib/transforms-store";
import {
  useHovered,
  useTransformStore,
} from "~/providers/transforms-store-provider";

const _VX = new THREE.Vector3(1, 0, 0);
const _VY = new THREE.Vector3(0, 1, 0);
const _VZ = new THREE.Vector3(0, 0, 1);

function CustomAxes(props: MeshProps) {
  const xref = useRef<ArrowHelper>(null!);
  const yref = useRef<ArrowHelper>(null!);
  const zref = useRef<ArrowHelper>(null!);

  return (
    <>
      <mesh {...props}>
        <arrowHelper ref={xref} args={[_VX, undefined, undefined, "red"]} />
        <arrowHelper ref={yref} args={[_VY, undefined, undefined, "green"]} />
        <arrowHelper ref={zref} args={[_VZ, undefined, undefined, "blue"]} />
      </mesh>
    </>
  );
}

type RotateQuaternionViewProps = {
  chainIndex: number;
  transformIndex: number;
  children?: ReactElement;
} & RotateQuaternion;

function RotateQuaternionView({
  chainIndex,
  transformIndex,
  children,
  ...transform
}: RotateQuaternionViewProps) {
  const [hovered, setHovered] = useHovered(chainIndex, transformIndex);

  return (
    <>
      <mesh
        quaternion={[+transform.x, +transform.y, +transform.z, +transform.w]}
      >
        <CustomAxes
          scale={hovered ? 1.3 : 1.0}
          onPointerEnter={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerLeave={() => setHovered(false)}
          onPointerMissed={() => setHovered(false)}
        />
        {children}
      </mesh>
    </>
  );
}

type TranslateVector3ViewProps = {
  chainIndex: number;
  transformIndex: number;
  children?: ReactElement;
} & TranslateVector3;

function TranslateVector3View({
  chainIndex,
  transformIndex,
  children,
  ...transform
}: TranslateVector3ViewProps) {
  const ref = useRef<ArrowHelper>(null!);
  const [hovered, setHovered] = useHovered(chainIndex, transformIndex);
  const dir = new THREE.Vector3();
  const origin = new THREE.Vector3();
  let len = 0;
  if (isTransformValid(transform)) {
    dir.set(+transform.x, +transform.y, +transform.z);
    len = dir.length();
    dir.normalize();
  }

  return (
    <>
      <mesh>
        <arrowHelper
          ref={ref}
          args={[dir, origin, len]}
          scale={hovered ? 1.1 : 1.0}
          onPointerEnter={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerLeave={() => setHovered(false)}
          onPointerMissed={() => setHovered(false)}
        />
        <mesh position={[+transform.x, +transform.y, +transform.z]}>
          {children}
        </mesh>
      </mesh>
    </>
  );
}

type TransformChainViewProps = {
  chainIndex: number;
} & TransformChainT;

function TransformChainView({
  chainIndex,
  ...chainData
}: TransformChainViewProps) {
  let tfmview: ReactElement = <></>;

  for (const [transformIndexRev, transform] of chainData.transforms
    .slice()
    .reverse()
    .entries()) {
    const transformIndex = chainData.transforms.length - 1 - transformIndexRev;

    switch (transform.type) {
      case "translation": {
        tfmview = (
          <TranslateVector3View
            key={`transformView-${chainIndex}-${transformIndex}`}
            chainIndex={chainIndex}
            transformIndex={transformIndex}
            {...transform}
          >
            {tfmview}
          </TranslateVector3View>
        );
        continue;
      }
      case "rotation": {
        tfmview = (
          <RotateQuaternionView
            key={`transformView-${chainIndex}-${transformIndex}`}
            chainIndex={chainIndex}
            transformIndex={transformIndex}
            {...transform}
          >
            {tfmview}
          </RotateQuaternionView>
        );
        continue;
      }
    }
  }

  return <>{tfmview}</>;
}

function Viewport() {
  const { chains } = useTransformStore((state) => state);

  const chainViews = chains.map((chain, chainIndex) => (
    <TransformChainView
      key={`chainView-${chainIndex}`}
      chainIndex={chainIndex}
      {...chain}
    />
  ));

  return (
    <div className="h-screen w-full">
      <Canvas shadows camera={{ position: [5, 5, 5] }} resize={{ debounce: 0 }}>
        {chainViews}
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
