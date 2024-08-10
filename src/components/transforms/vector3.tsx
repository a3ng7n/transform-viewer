"use client";

import { isTransformFieldValid, type Vector3 } from "~/lib/transforms-store";
import { Input } from "../ui/input";
import { useTransformStore } from "~/providers/transforms-store-provider";
import { invalidInputAttrs, propertyChangeHandler } from "./quaternion";

type Vector3SettingProps = {
  chainIndex: number;
  transformIndex: number;
} & Vector3;

function Vector3Setting({
  chainIndex,
  transformIndex,
  ...props
}: Vector3SettingProps) {
  const { setTransform } = useTransformStore((state) => state);

  const onChangeProp = (property: keyof Vector3) =>
    propertyChangeHandler(chainIndex, transformIndex, property, setTransform);

  return (
    <div className="flex flex-row justify-start">
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
    </div>
  );
}

export { Vector3Setting };
