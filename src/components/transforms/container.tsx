"use client";

import { IconButton, PlusButton, XButton } from "../ui/button";
import { QuaternionSetting } from "./quaternion";
import { type TransformChainT, type Transforms } from "~/lib/transforms-store";
import {
  useHovered,
  useTransformStore,
} from "~/providers/transforms-store-provider";
import { Separator } from "../ui/separator";
import { Vector3Setting } from "./vector3";
import { MoveUpRightIcon, Rotate3dIcon } from "lucide-react";
import { type HTMLAttributes, type MouseEventHandler, useState } from "react";

interface FloatButtonProps {
  children: React.ReactNode;
  className: HTMLAttributes<HTMLDivElement>["className"];
  groupName?: string;
  onMouseOver?: HTMLAttributes<HTMLDivElement>["onMouseOver"];
  onMouseLeave?: HTMLAttributes<HTMLDivElement>["onMouseLeave"];
}

function FloatButton({
  children,
  className,
  groupName,
  onMouseOver,
  onMouseLeave,
}: FloatButtonProps) {
  return (
    <div>
      <div className={"absolute " + (className ?? "")}>
        <div
          onMouseOver={onMouseOver}
          onMouseLeave={onMouseLeave}
          className={
            "group fixed z-[100] flex translate-x-[-50%] translate-y-[-50%]" +
            ((groupName && `/${groupName}`) ?? "")
          }
        >
          <div className="m-1 flex">{children}</div>
        </div>
      </div>
    </div>
  );
}

type TransformRowProps = {
  chainIndex: number;
  transformIndex: number;
} & Transforms;

function TransformRow({
  chainIndex,
  transformIndex,
  ...transformData
}: TransformRowProps) {
  const { removeTransform } = useTransformStore((state) => ({
    ...state,
  }));

  const [hovered, setHovered] = useHovered(chainIndex, transformIndex);

  const transformSetting = ({ inputData }: { inputData: Transforms }) => {
    switch (inputData.type) {
      case "translation":
        return (
          <Vector3Setting
            chainIndex={chainIndex}
            transformIndex={transformIndex}
            {...inputData}
          />
        );
      case "rotation": {
        return (
          <QuaternionSetting
            chainIndex={chainIndex}
            transformIndex={transformIndex}
            {...inputData}
          />
        );
      }
    }
  };

  const deleteTransform: MouseEventHandler = (e) => {
    e.preventDefault();
    removeTransform(chainIndex, transformIndex);
  };

  return (
    <div
      className={
        "delay-50 relative mx-2 flex flex-row justify-between rounded-sm border-[1px] border-hidden p-2 transition-all duration-300 ease-in-out" +
        (hovered ? " my-2 border-solid bg-primary-foreground shadow-md " : " ")
      }
    >
      <div className="px-2">
        {transformSetting({ inputData: transformData })}
      </div>
      <FloatButton
        className="right-2 top-1/2"
        onMouseOver={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <XButton
          title={`delete ${transformData.type}`}
          variant={"destructive"}
          onClick={deleteTransform}
          className={"h-5 w-5" + (hovered ? " opacity-100 " : " opacity-0 ")}
        />
      </FloatButton>
    </div>
  );
}

type TransformChainContainerProps = {
  chainIndex: number;
} & TransformChainT;

function TransformChainContainer({
  chainIndex,
  ...chainData
}: TransformChainContainerProps) {
  const { removeChain, addTransform } = useTransformStore((state) => state);
  const newRotation = () =>
    addTransform(chainIndex, { type: "rotation", x: 0, y: 0, z: 0, w: 1 });
  const newTranslation = () =>
    addTransform(chainIndex, { type: "translation", x: 1, y: 2, z: 3 });

  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={
        "delay-50 relative mx-2 rounded-sm border-[1px] border-hidden transition-all duration-300 ease-in-out" +
        (hovered ? " border-solid bg-primary-foreground shadow-md " : " ")
      }
    >
      <div>
        {chainData.transforms.map((transform, tfmIdx) => (
          <TransformRow
            key={`transform-${chainIndex}-${tfmIdx}`}
            chainIndex={chainIndex}
            transformIndex={tfmIdx}
            {...transform}
          />
        ))}
      </div>
      <div className="flex flex-grow flex-row justify-center space-x-5">
        <IconButton
          title={"add new rotation"}
          variant={"outline"}
          className="my-1"
          onClick={newRotation}
        >
          <Rotate3dIcon />
        </IconButton>
        <IconButton
          title={"add new translation"}
          variant={"outline"}
          className="my-1"
          onClick={newTranslation}
        >
          <MoveUpRightIcon />
        </IconButton>
      </div>
      <FloatButton
        className="right-2 top-2"
        onMouseOver={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <XButton
          title={"delete transform chain"}
          variant={"destructive"}
          onClick={() => removeChain(chainIndex)}
          className={"h-7 w-7" + (hovered ? " opacity-100 " : " opacity-0 ")}
        />
      </FloatButton>
    </div>
  );
}

function Container() {
  const { chains, addChain } = useTransformStore((state) => state);

  const chainSettings = (chains: TransformChainT[]) => {
    return chains.map((chain, idx) => {
      return (
        <div key={`chain-${idx}`}>
          {idx > 0 ? <Separator /> : null}
          <TransformChainContainer chainIndex={idx} {...chain} />
        </div>
      );
    });
  };

  const newChain = () => addChain({ transforms: [] });

  return (
    <div className="flex flex-grow flex-col">
      {chainSettings(chains)}
      <PlusButton
        title={"add new transform chain"}
        variant={"outline"}
        onClick={newChain}
        className="mx-auto my-1"
      />
    </div>
  );
}

export { Container };
