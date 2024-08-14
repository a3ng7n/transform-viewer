"use client";

import {
  type RotateQuaternion,
  isTransformFieldValid,
  type Quaternion,
} from "~/lib/transforms-store";
import { Input } from "../ui/input";
import {
  useTransformField,
  useTransformStore,
} from "~/providers/transforms-store-provider";

export const invalidInputAttrs: {
  className?: React.ComponentProps<"div">["className"];
} = {
  className:
    "border-solid text-destructive bg-destructive-foreground border-destructive",
};

type QuaternionSettingProps = RotateQuaternion;

function QuaternionSetting(props: QuaternionSettingProps) {
  const { setTransform } = useTransformStore((state) => state);

  const onChangeProp = useTransformField<Quaternion>(props.id, setTransform);

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
