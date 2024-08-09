
'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import {
  type TransformStore,
  createTransformStore,
  initTransformStore,
} from '~/lib/transforms-store'

export type TransformStoreApi = ReturnType<typeof createTransformStore>

export const TransformStoreContext = createContext<TransformStoreApi | undefined>(
  undefined,
)

export interface TransformStoreProviderProps {
  children: ReactNode
}

export const TransformStoreProvider = ({
  children,
}: TransformStoreProviderProps) => {
  const storeRef = useRef<TransformStoreApi>()
  if (!storeRef.current) {
    storeRef.current = createTransformStore(initTransformStore())
  }

  return (
    <TransformStoreContext.Provider value={storeRef.current}>
      {children}
    </TransformStoreContext.Provider>
  )
}

export const useTransformStore = <T,>(
  selector: (store: TransformStore) => T,
): T => {
  const transformStoreContext = useContext(TransformStoreContext)

  if (!transformStoreContext) {
    throw new Error(`useCounterStore must be used within TransformStoreProvider`)
  }

  return useStore(transformStoreContext, selector)
}
