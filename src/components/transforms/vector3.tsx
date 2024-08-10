'use client'

import type { Vector3 } from "~/lib/transforms-store"
import { Input } from "../ui/input"
import { ChangeEventHandler } from "react"
import { useTransformStore } from "~/providers/transforms-store-provider"

type Vector3SettingProps = {
  chainIndex: number,
  transformIndex: number
} & Vector3

function Vector3Setting({ chainIndex, transformIndex, ...props }: Vector3SettingProps) {
  const { setTransform } = useTransformStore((state) => state);

  const propertyChangeHandler = (property: keyof Vector3) => {
    const handler: ChangeEventHandler<HTMLInputElement> = (e) => {
      const v = +e.target.value
      if (isNaN(v)) return;
      setTransform(chainIndex, transformIndex, (tfm) => ({ ...tfm, [property]: v }))
    }
    return handler
  }

  return (
    <div className="flex flex-row justify-start">
      <div className="flex flex-row flex-grow items-center ps-2">x: <Input value={props.x} onChange={propertyChangeHandler("x")} /></div>
      <div className="flex flex-row flex-grow items-center ps-2">y: <Input value={props.y} onChange={propertyChangeHandler("y")} /></div>
      <div className="flex flex-row flex-grow items-center ps-2">z: <Input value={props.z} onChange={propertyChangeHandler("z")} /></div>
    </div>
  )
}

export { Vector3Setting }
