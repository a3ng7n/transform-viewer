import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { QuaternionSetting } from "./quaternion";

function PlusButton() {
  return (
    // <Button size="icon" variant="outline" >
    <Button size="icon" variant="outline" className="mx-5 my-1 rounded-full">
      <PlusIcon className="h-5 w-5" />
    </Button>
  )
}


function Buttons() {
  return (
    <div className="flex flex-row justify-center">
      <PlusButton />
      <PlusButton />
    </div>
  )
}


function Container() {
  return (
    <div className="flex flex-col">
      <QuaternionSetting />
      <Buttons />
    </div>
  )

}

export { Container }
