'use client'

import type { Quaternion } from "~/lib/transforms-store"
import { Input } from "../ui/input"
import { useTransformStore } from "~/providers/transforms-store-provider"
import { ChangeEventHandler, useState } from "react"

type QuaternionSettingProps = {
  chainIndex: number,
  transformIndex: number
} & Quaternion

function QuaternionSetting({ chainIndex, transformIndex, ...props }: QuaternionSettingProps) {
  const { setTransform, isTransformValid } = useTransformStore((state) => state)

  const isValid = isTransformValid(chainIndex, transformIndex)

  const propertyChangeHandler = (property: keyof Quaternion) => {
    const handler: ChangeEventHandler<HTMLInputElement> = (e) => {
      const v = (() => {
        if (!isNaN(e.target.valueAsNumber)) {
          return e.target.valueAsNumber
        } else {
          return e.target.value
        }
      })()

      setTransform(chainIndex, transformIndex, (tfm) => ({ ...tfm, [property]: v }))
    }
    return handler
  }

  const invalidAttrs: { className?: string } = {}

  if (!isValid) {
    invalidAttrs["className"] = "border-solid text-destructive bg-destructive-foreground border-destructive"
  }

  console.log(isValid, chainIndex, transformIndex)

  return (
    <div className={"flex flex-row justify-start"}>
      <div className="flex flex-row flex-grow items-center ps-2">
        x: <Input {...invalidAttrs} value={props.x} onChange={propertyChangeHandler("x")} />
      </div>
      <div className="flex flex-row flex-grow items-center ps-2">
        y: <Input {...invalidAttrs} value={props.y} onChange={propertyChangeHandler("y")} />
      </div>
      <div className="flex flex-row flex-grow items-center ps-2">
        z: <Input {...invalidAttrs} value={props.z} onChange={propertyChangeHandler("z")} />
      </div>
      <div className="flex flex-row flex-grow items-center ps-2">
        w: <Input {...invalidAttrs} value={props.w} onChange={propertyChangeHandler("w")} />
      </div>
    </div>
  )
}

export { QuaternionSetting }
