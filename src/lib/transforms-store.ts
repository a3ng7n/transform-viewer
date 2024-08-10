'use clien'

import { createStore } from 'zustand/vanilla'

interface TransformBase {
  type: "rotation" | "translation"
}
export interface RotationBase extends TransformBase {
  type: "rotation"
}
export interface TranslationBase extends TransformBase {
  type: "translation"
}

export interface Quaternion {
  x: number | string,
  y: number | string,
  z: number | string,
  w: number | string,
}

export interface Vector3 {
  x: number | string,
  y: number | string,
  z: number | string,
}

export type TranslateVector3 = TranslationBase & Vector3
export type RotateQuaternion = RotationBase & Quaternion

export type Transforms = TranslateVector3 | RotateQuaternion

export interface TransformChainT {
  transforms: Transforms[]
}

export type TransformState = {
  chains: TransformChainT[]
}

export type TransformActions = {
  updateChains: (chains: TransformChainT[]) => void
  addChain: (chain: TransformChainT) => void
  removeChain: (index: number) => void
  addTransform: (chainIndex: number, transform: Transforms) => void
  removeTransform: (chainIndex: number, transformIndex: number) => void
  setTransform: (chainIndex: number, transformIndex: number, payload: React.SetStateAction<Transforms>) => void
  isTransformValid: (chainIndex: number, transformIndex: number) => boolean
}

export type TransformStore = TransformState & TransformActions

export const initTransformStore = (): TransformState => {
  return { chains: [] }
}

export const defaultInitState: TransformState = {
  chains: [],
}

export const isTransformValid = (transform: Transforms) => {
  const { type, ...data } = transform;
  // console.log(data)
  const valids = Object.values(data).some((v) => (isNaN(+v)))
  if (valids) {
    return false
  }
  return true
}

export const createTransformStore = (
  initState: TransformState = defaultInitState,
) => {
  return createStore<TransformStore>()((set, get) => ({
    ...initState,
    updateChains: (chains) => set((_) => ({ chains: chains })),
    addChain: (chain) => set((state) => ({ chains: [...state.chains, chain] })),
    removeChain: (index) => set((state) => {
      const newChains = [...state.chains];
      newChains.splice(index, 1)
      return { chains: newChains };
    }),
    addTransform: (chainIndex, transform) => set((state) => {
      const chain = state.chains.at(chainIndex)
      if (!chain) return state;
      chain.transforms = [...chain.transforms, transform]
      return { chains: [...state.chains] }
    }),
    removeTransform: (chainIndex, transformIndex) => set((state) => {
      const chain = state.chains.at(chainIndex)
      if (!chain) return state;
      chain.transforms.splice(transformIndex, 1)
      return { chains: [...state.chains] }
    }),
    setTransform: (chainIndex, transformIndex, payload) => set((state) => {
      const chain = state.chains.at(chainIndex)
      if (!chain) return state;
      const transform = chain.transforms.at(transformIndex)
      if (!transform) return state;
      const newTransform = (() => {
        if (typeof payload === "function") {
          return { ...payload(transform) }
        } else {
          return { ...payload }
        }
      })()

      const newTransforms = [...chain.transforms.slice(0, transformIndex), newTransform, ...chain.transforms.slice(transformIndex + 1)]
      const newChains = [...state.chains.slice(0, chainIndex), { ...chain, transforms: [...newTransforms] }, ...state.chains.slice(chainIndex + 1)]

      // state.chains[chainIndex] = { ...chain, transforms: [...chain.transforms] }

      const newState = { chains: newChains }

      // console.log("new state")
      return { ...newState }
    }),
    isTransformValid: (chainIndex: number, transformIndex: number) => {
      const state = get()
      const chain = state.chains.at(chainIndex)
      if (!chain) return false;
      const transform = chain.transforms.at(transformIndex)
      if (!transform) return false;
      return isTransformValid(transform)
    }
  }
  ))
}
