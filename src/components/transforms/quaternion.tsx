"use client";

import {
  type RotateQuaternion,
  type TransformActions,
  type TranslateVector3,
  isTransformFieldValid,
  type Quaternion,
} from "~/lib/transforms-store";
import { Input } from "../ui/input";
import { useTransformStore } from "~/providers/transforms-store-provider";
import type { ChangeEventHandler } from "react";

type PropertyChangeHandler = (
  chainIndex: number,
  transformIndex: number,
  property:
    | keyof Omit<TranslateVector3, "type">
    | keyof Omit<RotateQuaternion, "type">,
  setTransform: TransformActions["setTransform"],
) => ChangeEventHandler<HTMLInputElement>;

export const propertyChangeHandler: PropertyChangeHandler = (
  chainIndex,
  transformIndex,
  property,
  setTransform,
) => {
  const handler: ChangeEventHandler<HTMLInputElement> = (e) => {
    const v = (() => {
      if (!isNaN(e.target.valueAsNumber)) {
        return e.target.valueAsNumber;
      } else {
        return e.target.value;
      }
    })();

    setTransform(chainIndex, transformIndex, (tfm) => ({
      ...tfm,
      [property]: v,
    }));
  };
  return handler;
};

export const invalidInputAttrs: {
  className?: React.ComponentProps<"div">["className"];
} = {
  className:
    "border-solid text-destructive bg-destructive-foreground border-destructive",
};

type QuaternionSettingProps = {
  chainIndex: number;
  transformIndex: number;
} & Quaternion;

function QuaternionSetting({
  chainIndex,
  transformIndex,
  ...props
}: QuaternionSettingProps) {
  const { setTransform } = useTransformStore((state) => state);

  const onChangeProp = (property: keyof Quaternion) =>
    propertyChangeHandler(chainIndex, transformIndex, property, setTransform);

  return (
    <div className={"flex flex-row justify-start"}>
      <div className="flex flex-grow flex-row items-center ps-2">
        x:{" "}
        <Input
          {...(isTransformFieldValid(props.x) ? {} : invalidInputAttrs)}
          value={props.x}
          onChange={onChangeProp("x")}
        />
      </div>
      <div className="flex flex-grow flex-row items-center ps-2">
        y:{" "}
        <Input
          {...(isTransformFieldValid(props.y) ? {} : invalidInputAttrs)}
          value={props.y}
          onChange={onChangeProp("y")}
        />
      </div>
      <div className="flex flex-grow flex-row items-center ps-2">
        z:{" "}
        <Input
          {...(isTransformFieldValid(props.z) ? {} : invalidInputAttrs)}
          value={props.z}
          onChange={onChangeProp("z")}
        />
      </div>
      <div className="flex flex-grow flex-row items-center ps-2">
        w:{" "}
        <Input
          {...(isTransformFieldValid(props.w) ? {} : invalidInputAttrs)}
          value={props.w}
          onChange={onChangeProp("w")}
        />
      </div>
    </div>
  );
}

export { QuaternionSetting };
