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
import { GripVertical, MoveUpRightIcon, Rotate3dIcon } from "lucide-react";
import {
  type HTMLAttributes,
  type MouseEventHandler,
  useState,
  type DragEventHandler,
} from "react";

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

  const dragStart: DragEventHandler<HTMLDivElement> = (e) => {
    console.log(e);
    return;
  };

  return (
    <>
      <div
        className={
          "delay-50 relative mx-2 flex flex-row justify-evenly rounded-sm border-[1px] border-hidden p-2 transition-all duration-300 ease-in-out" +
          (hovered ? " my-2 border-solid bg-accent shadow-md " : " ")
        }
        draggable={true}
        onDragStart={dragStart}
      >
        <div
          className="mx-0.5 flex w-5 flex-shrink-0 cursor-grab items-center rounded bg-muted"
          onMouseOver={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <GripVertical className="stroke-muted-foreground" />
        </div>
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
      <DropIndicator chainId={chainIndex} transformId={transformIndex} />
    </>
  );
}

function DropIndicator({
  chainId,
  transformId,
}: {
  chainId: number;
  transformId: number;
}) {
  return (
    <div
      data-transform={transformId || "-1"}
      data-chain={chainId || "-1"}
      className="my-0.5 h-0.5 w-full bg-secondary opacity-100"
    />
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
    addTransform(chainIndex, { type: "translation", x: 1, y: 1, z: 1 });

  const [hovered, setHovered] = useState(false);

  // const getIndicators = (): HTMLElement[] => {
  //   return Array.from(
  //     document.querySelectorAll<HTMLElement>(`[data-chain="${chainIndex}"]`),
  //   );
  // };
  //
  // const getNearestIndicator = (
  //   e: DragEvent,
  //   indicators: HTMLElement[],
  // ): { offset: number; element: HTMLElement } => {
  //   const DISTANCE_OFFSET = 50;
  //
  //   const el = indicators.reduce(
  //     (closest, child) => {
  //       const box = child.getBoundingClientRect();
  //
  //       const offset = e.clientY - (box.top + DISTANCE_OFFSET);
  //
  //       if (offset < 0 && offset > closest.offset) {
  //         return { offset: offset, element: child };
  //       } else {
  //         return closest;
  //       }
  //     },
  //     {
  //       offset: Number.NEGATIVE_INFINITY,
  //       element: indicators[indicators.length - 1]!,
  //     },
  //   );
  //
  //   return el;
  // };
  //
  // const highlightIndicator = (e: DragEvent) => {
  //   const indicators = getIndicators();
  //   clearHighlights(indicators);
  //   const el = getNearestIndicator(e, indicators);
  //   el.element.style.opacity = "1";
  // };
  //
  // const clearHighlights = (els?: HTMLElement[]) => {
  //   const indicators = els || getIndicators();
  //   indicators.forEach((i) => {
  //     i.style.opacity = "0";
  //   });
  // };
  //
  // const handleDragStart = (e: DragEvent, transform: TransformRowProps) => {
  //   e.dataTransfer!.setData("chainIndex", transform.chainIndex.toString());
  //   e.dataTransfer!.setData(
  //     "transformIndex",
  //     transform.transformIndex.toString(),
  //   );
  // };
  //
  // const handleDragEnd = (e: DragEvent) => {
  //   const chainIndex = e.dataTransfer!.getData("chainIndex");
  //   const transformIndex = e.dataTransfer!.getData("transformIndex");
  //
  //   setHovered(false);
  //   clearHighlights();
  //   const indicators = getIndicators();
  //   const { element } = getNearestIndicator(e, indicators);
  //
  //   const chainIdx = element.dataset.chainId || "-1";
  //   const transformIdx = element.dataset.transformId || "-1";
  //
  //   if (before !== cardId) {
  //     let copy = [...cards];
  //     let cardToTransfer = copy.find((c) => c.id === cardId);
  //     if (!cardToTransfer) return;
  //
  //     cardToTransfer = { ...cardToTransfer, column };
  //     copy = copy.filter((c) => c.id !== cardId);
  //     const moveToBack = before === "-1";
  //     if (moveToBack) {
  //       copy.push(cardToTransfer);
  //     } else {
  //       const insertAtIndex = copy.findIndex((el) => el.id === before);
  //       if (insertAtIndex === undefined) return;
  //       copy.splice(insertAtIndex, 0, cardToTransfer);
  //     }
  //     setCards(copy);
  //   }
  // };
  // const handleDragOver = (e: DragEvent) => {
  //   e.preventDefault();
  //   highlightIndicator(e);
  //   setHovered(true);
  // };
  //
  // const handleDragLeave = () => {
  //   clearHighlights();
  //   setHovered(false);
  // };

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
