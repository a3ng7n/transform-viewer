'use client'

import { Input } from "../ui/input"

function QuaternionSetting() {
  return (
    <div className="flex flex-row justify-start">
      <div className="flex flex-row flex-grow items-center ps-2">x: <Input /></div>
      <div className="flex flex-row flex-grow items-center ps-2">y: <Input /></div>
      <div className="flex flex-row flex-grow items-center ps-2">z: <Input /></div>
      <div className="flex flex-row flex-grow items-center ps-2">w: <Input /></div>
    </div>
  )
}

export { QuaternionSetting }
