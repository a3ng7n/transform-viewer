'use client'

import type { Quaternion } from "~/lib/transforms-store"
import { Input } from "../ui/input"

function QuaternionSetting(props: Quaternion) {
  return (
    <div className="flex flex-row justify-start">
      <div className="flex flex-row flex-grow items-center ps-2">x: <Input value={props.x} /></div>
      <div className="flex flex-row flex-grow items-center ps-2">y: <Input value={props.y} /></div>
      <div className="flex flex-row flex-grow items-center ps-2">z: <Input value={props.z} /></div>
      <div className="flex flex-row flex-grow items-center ps-2">w: <Input value={props.w} /></div>
    </div>
  )
}

export { QuaternionSetting }
