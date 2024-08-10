'use client'

import { IconButton, PlusButton, XButton } from "../ui/button";
import { QuaternionSetting } from "./quaternion";
import { isTransformValid, type TransformChainT, type Transforms } from "~/lib/transforms-store";
import { useTransformStore } from "~/providers/transforms-store-provider";
import { Separator } from "../ui/separator";
import { Vector3Setting } from "./vector3";
import { MoveUpRightIcon, Rotate3dIcon } from "lucide-react";
import { HTMLAttributes, MouseEventHandler, useState } from "react";


interface FloatButtonProps {
  children: React.ReactNode,
  className: HTMLAttributes<HTMLDivElement>['className'],
  groupName?: string,
  onMouseOver?: HTMLAttributes<HTMLDivElement>['onMouseOver'],
  onMouseLeave?: HTMLAttributes<HTMLDivElement>['onMouseLeave'],
}

function FloatButton({ children, className, groupName, onMouseOver, onMouseLeave }: FloatButtonProps) {
  return (
    <div>
      <div className={"absolute " + (className ?? "")}>
        <div onMouseOver={onMouseOver} onMouseLeave={onMouseLeave} className={"fixed flex z-[100] translate-x-[-50%] translate-y-[-50%] group" + ((groupName && `/${groupName}`) ?? "")} >
          <div className="flex m-1">
            {children}
          </div>
        </div>
      </div>
    </div >
  )
}


type TransformRowProps = {
  chainIndex: number,
  transformIndex: number,
} & Transforms

function TransformRow({ chainIndex, transformIndex, ...transformData }: TransformRowProps) {
  const { removeTransform, chains } = useTransformStore((state) => ({ ...state }))

  const [hovered, setHovered] = useState(false)

  const transformSetting = ({ inputData }: { inputData: Transforms }) => {
    switch (inputData.type) {
      case "translation":
        return <Vector3Setting chainIndex={chainIndex} transformIndex={transformIndex} {...inputData} />
      case "rotation": {
        return <QuaternionSetting chainIndex={chainIndex} transformIndex={transformIndex} {...inputData} />
      }
    }
  }

  const deleteTransform: MouseEventHandler = (e) => {
    e.preventDefault()
    removeTransform(chainIndex, transformIndex)
  }

  // const isValid = (() => {
  //   const chain = chains.at(chainIndex);
  //   if (!chain) return false;
  //
  //   const transform = chain.transforms.at(transformIndex);
  //   if (!transform) return false;
  //
  //   return isTransformValid(transform)
  // })()
  //
  // console.log(isValid, chains)

  return (
    <div className={"relative flex flex-row justify-between transition-all ease-in-out delay-50 duration-300 mx-2 p-2 rounded-sm border-hidden border-[1px]"
      + (hovered ? " my-2 shadow-md border-solid bg-primary-foreground " : " ")
    }>
      <div className="px-2">
        {transformSetting({ inputData: transformData })}
      </div>
      <FloatButton className="right-2 top-1/2" onMouseOver={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <XButton title={`delete ${transformData.type}`} variant={"destructive"} onClick={deleteTransform} className={"w-5 h-5" + (hovered ? " opacity-100 " : " opacity-0 ")} />
      </FloatButton>
    </div >
  )
}


type TransformChainContainerProps = {
  chainIndex: number,
} & TransformChainT

function TransformChainContainer({ chainIndex, ...chainData }: TransformChainContainerProps) {
  const { removeChain, addTransform } = useTransformStore((state) => state)
  const newRotation = () => addTransform(chainIndex, { type: "rotation", x: 0, y: 0, z: 0, w: 1 });
  const newTranslation = () => addTransform(chainIndex, { type: "translation", x: 1, y: 2, z: 3 });

  const [hovered, setHovered] = useState(false)

  return (
    <div className={"relative transition-all ease-in-out delay-50 duration-300 mx-2 rounded-sm border-hidden border-[1px]" + (hovered ? " shadow-md border-solid bg-primary-foreground " : " ")} >
      <div>
        {chainData.transforms.map((transform, tfmIdx) => <TransformRow key={`transform-${chainIndex}-${tfmIdx}`} chainIndex={chainIndex} transformIndex={tfmIdx} {...transform} />)}
      </div>
      <div className="flex flex-row flex-grow justify-center space-x-5">
        <IconButton title={"add new rotation"} variant={"outline"} className="my-1" onClick={newRotation}>
          <Rotate3dIcon />
        </IconButton>
        <IconButton title={"add new translation"} variant={"outline"} className="my-1" onClick={newTranslation}>
          <MoveUpRightIcon />
        </IconButton>
      </div>
      <FloatButton className="right-2 top-2" onMouseOver={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <XButton title={"delete transform chain"} variant={"destructive"} onClick={() => removeChain(chainIndex)} className={"w-7 h-7" + (hovered ? " opacity-100 " : " opacity-0 ")} />
      </FloatButton>
    </div>
  )
}


function Container() {
  const { chains, addChain } = useTransformStore((state) => state)

  const chainSettings = (chains: TransformChainT[]) => {
    return chains.map((chain, idx) => {
      return (
        <div key={`chain-${idx}`} >
          {(idx > 0) ? <Separator /> : null}
          <TransformChainContainer chainIndex={idx} {...chain} />
        </div >
      )
    })
  }

  const newChain = () => addChain({ transforms: [] })

  return (
    <div className="flex flex-col flex-grow">
      {chainSettings(chains)}
      <PlusButton title={"add new transform chain"} variant={"outline"} onClick={newChain} className="mx-auto my-1" />
    </div>
  )

}

export { Container }
