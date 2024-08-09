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
  x: number,
  y: number,
  z: number,
  w: number
}

export interface Vector3 {
  x: number,
  y: number,
  z: number
}

export type TranslateVector3 = TranslationBase & Vector3
export type RotateQuaternion = RotationBase & Quaternion

export type Transforms = TranslateVector3 | RotateQuaternion

export interface TransformChain {
  transforms: Transforms[]
}

export type TransformState = {
  chains: TransformChain[]
}

export type TransformActions = {
  updateChains: (chains: TransformChain[]) => void
  addChain: (chain: TransformChain) => void
  removeChain: (index: number) => void
  addTransform: (chainIndex: number, transform: Transforms) => void
  removeTransform: (chainIndex: number, transformIndex: number) => void
}

export type TransformStore = TransformState & TransformActions

export const initTransformStore = (): TransformState => {
  return { chains: [] }
}

export const defaultInitState: TransformState = {
  chains: [],
}

export const createTransformStore = (
  initState: TransformState = defaultInitState,
) => {
  return createStore<TransformStore>()((set) => ({
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
  }))
}
