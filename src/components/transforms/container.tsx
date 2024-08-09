'use client'

import { MinusIcon, PlusIcon } from "lucide-react";
import { Button, type ButtonProps } from "../ui/button";
import { QuaternionSetting } from "./quaternion";
import type { TransformChain, Transforms } from "~/lib/transforms-store";
import { useTransformStore } from "~/providers/transforms-store-provider";
import { Separator } from "../ui/separator";


function PlusButton(props: ButtonProps = {}) {
  const { className, ...rest } = props
  return (
    <Button size="icon" variant="outline" className={"rounded-full " + (className ?? "")} {...rest}>
      <PlusIcon className="h-5 w-5" />
    </Button>
  )
}

function MinusButton(props: ButtonProps = {}) {
  const { className, ...rest } = props
  return (
    <Button size="icon" variant="outline" className={"rounded-full " + (className ?? "")} {...rest}>
      <MinusIcon className="h-5 w-5" />
    </Button>
  )
}

function Buttons({ idx }: { idx: number }) {

  const { removeChain } = useTransformStore((state) => state)

  return (
    <div className="flex flex-row justify-stretch px-5 group">
      <div className="flex flex-row flex-grow justify-center space-x-5">
        <PlusButton className="my-1" />
        <PlusButton className="my-1" />
      </div>
      <div>
        <MinusButton variant={"destructive"} onClick={() => removeChain(idx)} className="my-1 absolute translate-x-[-2.5em] opacity-0 group-hover:opacity-100" />
      </div>
    </div>
  )
}


function Container() {

  const { chains, addChain } = useTransformStore((state) => state)

  const settings = (transforms: Transforms[]) => {
    return transforms.map((v, _) => {
      if (v.type == "translation") {
        return QuaternionSetting({ ...v, w: 1.0 })
      }
      return QuaternionSetting(v)
    })
  }

  const chainSettings = (chains: TransformChain[]) => {
    return chains.map((chain, idx) => {
      return (
        <div key={`chain-${idx}`}>
          {(idx > 0) ? <Separator /> : null}
          {settings(chain.transforms)}
          <Buttons idx={idx} />
        </div>
      )
    })
  }

  const newChain = () => addChain({ transforms: [] })

  return (
    <div className="flex flex-col flex-grow">
      {chainSettings(chains)}
      <PlusButton onClick={newChain} className="mx-auto my-1" />
    </div>
  )

}

export { Container }
