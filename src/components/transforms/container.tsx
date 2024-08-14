"use client";

import { IconButton, PlusButton, XButton } from "../ui/button";
import { QuaternionSetting } from "./quaternion";
import type {
  RotateQuaternion,
  TranslateVector3,
  TransformChainT,
  Transforms,
} from "~/lib/transforms-store";
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
  type DragEvent,
} from "react";
import { nanoid } from "nanoid";

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
  handleDragStart: (
    e: DragEvent,
    transform: Transforms | TransformChainT,
  ) => void;
} & Transforms;

function TransformRow({ handleDragStart, ...transform }: TransformRowProps) {
  const { removeTransform } = useTransformStore((state) => state);

  const [hovered, setHovered] = useHovered(transform.id);

  const transformSetting = (() => {
    switch (transform.type) {
      case "translation":
        return <Vector3Setting {...transform} />;
      case "rotation": {
        return <QuaternionSetting {...transform} />;
      }
    }
  })();

  const deleteTransform: MouseEventHandler = (e) => {
    e.preventDefault();
    removeTransform(transform.id);
  };

  return (
    <>
      <div
        className={
          "delay-50 relative mx-2 flex flex-row justify-evenly rounded-sm border-[1px] border-hidden p-2 transition-all duration-300 ease-in-out" +
          (hovered ? " my-2 border-solid bg-accent shadow-md " : " ")
        }
        draggable={true}
        onDragStart={(e) => handleDragStart(e, transform)}
      >
        <div
          className="mx-0.5 flex w-5 flex-shrink-0 cursor-grab items-center rounded bg-muted"
          onMouseOver={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <GripVertical className="stroke-muted-foreground" />
        </div>
        <div className="px-2">{transformSetting}</div>
        <FloatButton
          className="right-2 top-1/2"
          onMouseOver={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <XButton
            title={`delete ${transform.type}`}
            variant={"destructive"}
            onClick={deleteTransform}
            className={"h-5 w-5" + (hovered ? " opacity-100 " : " opacity-0 ")}
          />
        </FloatButton>
      </div>
    </>
  );
}

function DropIndicator({
  itemId,
  containerId,
}: {
  itemId?: string;
  containerId?: string;
}) {
  return (
    <div
      data-item={itemId ?? "-1"}
      data-container={containerId ?? "-1"}
      style={{ opacity: 0 }}
      className="transition-[margin, opacity] w-full bg-accent-foreground opacity-100 duration-100 ease-in-out"
    />
  );
}

type TransformChainContainerProps = TransformChainT;

function TransformChainContainer(chain: TransformChainContainerProps) {
  const {
    setChain,
    removeChain,
    addTransform,
    transforms: allTransforms,
    chains,
  } = useTransformStore((state) => state);

  const deleteSelf = () => removeChain(chain.id);
  const newRotation = () => {
    const newItem: RotateQuaternion = {
      id: nanoid(),
      type: "rotation",
      x: 0,
      y: 0,
      z: 0,
      w: 1,
    };
    addTransform(newItem);
    setChain({
      id: chain.id,
      payload: (prevChain) => ({
        ...prevChain,
        transforms: [...prevChain.transforms, newItem.id],
      }),
    });
  };
  const newTranslation = () => {
    const newItem: TranslateVector3 = {
      id: nanoid(),
      type: "translation",
      x: 1,
      y: 1,
      z: 1,
    };
    addTransform(newItem);
    setChain({
      id: chain.id,
      payload: (prevChain) => ({
        ...prevChain,
        transforms: [...prevChain.transforms, newItem.id],
      }),
    });
  };

  const [hovered, setHovered] = useState(false);

  const getIndicators = (): HTMLElement[] => {
    return Array.from(
      document.querySelectorAll<HTMLElement>("[data-container]"),
    );
  };

  const getNearestIndicator = (
    e: DragEvent,
    indicators: HTMLElement[],
  ): { offset: number; element: HTMLElement } => {
    const DISTANCE_OFFSET = 25;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1]!,
      },
    );

    return el;
  };

  const highlightIndicator = (e: DragEvent) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = "1";
    el.element.style.height = "0.125rem";
    el.element.style.margin = "0.125rem 0";
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els ?? getIndicators();
    indicators.forEach((i) => {
      i.style.opacity = "0";
      i.style.height = "0";
      i.style.margin = "0";
    });
  };

  const handleDragStart = (
    e: DragEvent,
    transform: Transforms | TransformChainT,
  ) => {
    e.dataTransfer.setData("itemId", transform.id);
    e.dataTransfer.setData("containerId", chain.id);
  };

  const handleDragEnd = (e: DragEvent) => {
    const itemId = e.dataTransfer.getData("itemId");
    const containerId = e.dataTransfer.getData("containerId");

    setHovered(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const indicatorItemId = element.dataset.item ?? "-1";
    const indicatorContainerId = element.dataset.container ?? "-1";

    if (indicatorItemId === itemId) return;

    const sourceContainer = chains.find((c) => c.id === containerId);
    if (!sourceContainer) return;

    const destContainer =
      containerId === indicatorContainerId
        ? sourceContainer
        : chains.find((c) => c.id === indicatorContainerId);
    if (!destContainer) return;

    sourceContainer.transforms = sourceContainer.transforms.filter(
      (id) => id !== itemId,
    );

    const moveToBack = indicatorItemId === "-1";
    if (moveToBack) {
      destContainer.transforms.push(itemId);
    } else {
      const insertAtIndex = destContainer.transforms.findIndex(
        (id) => id === indicatorItemId,
      );
      if (insertAtIndex === undefined) return;
      destContainer.transforms.splice(insertAtIndex, 0, itemId);
    }

    if (sourceContainer.id !== destContainer.id) {
      setChain({ ...sourceContainer });
      setChain({ ...destContainer });
    } else {
      setChain({ ...sourceContainer });
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    highlightIndicator(e);
    setHovered(true);
  };

  const handleDragLeave = () => {
    clearHighlights();
    setHovered(false);
  };

  const transforms = chain.transforms
    .map((transformId) =>
      allTransforms.find((transform) => transform.id == transformId),
    )
    .filter((transform): transform is Transforms => !!transform);

  return (
    <div
      className={
        "delay-50 relative mx-2 rounded-sm border-[1px] border-hidden transition-all duration-300 ease-in-out" +
        (hovered ? " border-solid bg-primary-foreground shadow-md " : " ")
      }
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className={"delay-50 transition-all duration-300 ease-in-out"}>
        {transforms.map((t) => (
          <>
            <DropIndicator itemId={t.id} containerId={chain.id} />
            <TransformRow
              key={`transformRow-${t.id}`}
              {...t}
              handleDragStart={handleDragStart}
            />
          </>
        ))}
        <DropIndicator containerId={chain.id} />
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
          onClick={() => deleteSelf}
          className={"h-7 w-7" + (hovered ? " opacity-100 " : " opacity-0 ")}
        />
      </FloatButton>
    </div>
  );
}

function Container() {
  const { chains, addChain } = useTransformStore((state) => state);

  const chainSettings = chains.map((chain, idx) => (
    <div key={`chainRow-${chain.id}`}>
      {idx > 0 ? <Separator /> : null}
      <TransformChainContainer {...chain} />
    </div>
  ));

  const newChain = () => addChain({ id: nanoid(), transforms: [] });

  return (
    <div className="flex flex-grow flex-col">
      {chainSettings}
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
