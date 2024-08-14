"use client";

import {
  type ReactNode,
  createContext,
  useRef,
  useContext,
  type ChangeEventHandler,
} from "react";
import { useStore } from "zustand";

import {
  type TransformStore,
  createTransformStore,
  initTransformStore,
  type Vector3,
  type Quaternion,
  type TransformActions,
} from "~/lib/transforms-store";

export type TransformStoreApi = ReturnType<typeof createTransformStore>;

export const TransformStoreContext = createContext<
  TransformStoreApi | undefined
>(undefined);

export interface TransformStoreProviderProps {
  children: ReactNode;
}

export const TransformStoreProvider = ({
  children,
}: TransformStoreProviderProps) => {
  const storeRef = useRef<TransformStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createTransformStore(initTransformStore());
  }

  return (
    <TransformStoreContext.Provider value={storeRef.current}>
      {children}
    </TransformStoreContext.Provider>
  );
};

export const useTransformStore = <T,>(
  selector: (store: TransformStore) => T,
): T => {
  const transformStoreContext = useContext(TransformStoreContext);

  if (!transformStoreContext) {
    throw new Error(
      `useCounterStore must be used within TransformStoreProvider`,
    );
  }

  return useStore(transformStoreContext, selector);
};

export const useHovered = (id: string): [boolean, (hover: boolean) => void] => {
  const {
    hovered: hovered_,
    setHovered: setHovered_,
    removeHovered,
  } = useTransformStore((state) => state);

  const setHovered = (hover: boolean) => {
    if (hover) {
      setHovered_(id);
      return;
    }
    removeHovered(id);
    return;
  };

  const hovered = hovered_.some((hover) => hover == id);

  return [hovered, setHovered];
};

type KeysOfUnion<T> = T extends T ? keyof T : never;

type UseTransformFieldT<T extends Vector3 | Quaternion> = (
  id: string,
  setTransform: TransformActions["setTransform"],
) => (property: KeysOfUnion<T>) => ChangeEventHandler<HTMLInputElement>;

export function useTransformField<T extends Vector3 | Quaternion>(
  ...[id, setTransform]: Parameters<UseTransformFieldT<T>>
): ReturnType<UseTransformFieldT<T>> {
  const propertyChangeHandler = (
    ...[property]: Parameters<ReturnType<UseTransformFieldT<T>>>
  ) => {
    const handler: ChangeEventHandler<HTMLInputElement> = (e) => {
      const v = (() => {
        if (!isNaN(e.target.valueAsNumber)) {
          return e.target.valueAsNumber;
        } else {
          return e.target.value;
        }
      })();

      setTransform({ id, payload: (tfm) => ({ ...tfm, [property]: v }) });
    };
    return handler;
  };

  return (prop) => propertyChangeHandler(prop);
}
