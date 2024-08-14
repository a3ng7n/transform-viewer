"use client";

import {
  type TranslateVector3,
  isTransformFieldValid,
  type Vector3,
} from "~/lib/transforms-store";
import { Input } from "../ui/input";
import {
  useTransformField,
  useTransformStore,
} from "~/providers/transforms-store-provider";
import { invalidInputAttrs } from "./quaternion";

type Vector3SettingProps = TranslateVector3;

function Vector3Setting(vector: Vector3SettingProps) {
  const { setTransform } = useTransformStore((state) => state);

  const onChangeProp = useTransformField<Vector3>(vector.id, setTransform);

  return (
    <div className="flex flex-row justify-start">
      <div className="flex flex-grow flex-row items-center ps-2">
        x:{" "}
        <Input
          {...(isTransformFieldValid(vector.x) ? {} : invalidInputAttrs)}
          value={vector.x}
          onChange={onChangeProp("x")}
        />
      </div>
      <div className="flex flex-grow flex-row items-center ps-2">
        y:{" "}
        <Input
          {...(isTransformFieldValid(vector.y) ? {} : invalidInputAttrs)}
          value={vector.y}
          onChange={onChangeProp("y")}
        />
      </div>
      <div className="flex flex-grow flex-row items-center ps-2">
        z:{" "}
        <Input
          {...(isTransformFieldValid(vector.z) ? {} : invalidInputAttrs)}
          value={vector.z}
          onChange={onChangeProp("z")}
        />
      </div>
    </div>
  );
}

export { Vector3Setting };
