import { createStore } from "zustand/vanilla";

interface TransformBase {
  /** the id of this transform */
  id: string;
  type: "rotation" | "translation";
}
export interface RotationBase extends TransformBase {
  type: "rotation";
}
export interface TranslationBase extends TransformBase {
  type: "translation";
}

export interface Quaternion {
  x: number | string;
  y: number | string;
  z: number | string;
  w: number | string;
}

export interface Vector3 {
  x: number | string;
  y: number | string;
  z: number | string;
}

export type TranslateVector3 = TranslationBase & Vector3;
export type RotateQuaternion = RotationBase & Quaternion;

export type Transforms = TranslateVector3 | RotateQuaternion;

export interface TransformChainT {
  /** the id of this chain */
  id: string;
  /** an array of transform ids or chain ids */
  transforms: string[];
}

export type TransformState = {
  chains: TransformChainT[];
  transforms: Transforms[];
  hovered: string[];
  selected?: string;
};

export type TransformActions = {
  // chain operations

  /** adds `chain` to list of chains */
  addChain: (chain: TransformChainT) => void;
  /** removes chain from `chains` and from any other `chains` */
  removeChain: (payload: string | TransformChainT) => void;
  /** `chains` setter */
  setChains: (chains: React.SetStateAction<TransformChainT[]>) => void;
  /** finds and updates existing `chain` or adds it if it doesn't exist
   * If providing `{ id, payload }`, will find and overwrite `chain` of `id` if it exists */
  setChain: (
    payload:
      | TransformChainT
      | { id: string; payload: React.SetStateAction<TransformChainT> },
  ) => void;

  // transform operations

  /** adds `transform` to list of transforms */
  addTransform: (transform: Transforms) => void;
  /** removes transform from `transforms` and from any `chains` */
  removeTransform: (payload: string | Transforms) => void;
  /** `transforms` setter */
  setTransforms: (payload: React.SetStateAction<Transforms[]>) => void;
  /** finds and updates existing `trainsform` or adds it if it doesn't exist
   * If providing `{ id, payload }`, will find and overwrite `transform` of `id` if it exists */
  setTransform: (
    payload:
      | Transforms
      | { id: string; payload: React.SetStateAction<Transforms> },
  ) => void;

  isTransformValid: (id: string) => boolean;

  // hovered operations

  setHovered: (id: string) => void;
  removeHovered: (id: string) => void;
  clearHovered: () => void;

  // selected operations

  setSelected: (id: string) => void;
  clearSelected: () => void;
};

export type TransformStore = TransformState & TransformActions;

export const initTransformStore = (): TransformState => {
  return { chains: [], transforms: [], hovered: [] };
};

export const defaultInitState: TransformState = {
  chains: [],
  transforms: [],
  hovered: [],
};

export const isTransformFieldValid = (field: number | string) => {
  return !isNaN(+field);
};

export const isTransformValid = (transform: Transforms) => {
  const { type, id, ...data } = transform;
  const invalids = Object.values(data).some((v) => !isTransformFieldValid(v));
  if (invalids) {
    return false;
  }
  return true;
};

export const createTransformStore = (
  initState: TransformState = defaultInitState,
) => {
  return createStore<TransformStore>()((set, get) => ({
    ...initState,
    setChains: (payload) =>
      set((state) => {
        const newChains =
          typeof payload === "function" ? payload(state.chains) : payload;
        return { chains: newChains };
      }),
    setChain: (payload) =>
      set((state) => {
        const newChains = (chains: TransformChainT[]) => {
          if ("payload" in payload) {
            const chainGetterGetter = (
              pld: React.SetStateAction<TransformChainT>,
            ) => {
              if (typeof pld == "function") {
                return (chain: TransformChainT) => pld(chain);
              }
              return (_: TransformChainT) => pld;
            };

            const chainGetter = chainGetterGetter(payload.payload);

            return chains.map((chain) => {
              if (chain.id != payload.id) return chain;
              return chainGetter(chain);
            });
          } else {
            return chains.map((chain) => {
              if (chain.id != payload.id) return chain;
              return payload;
            });
          }
        };

        return {
          chains: newChains(state.chains),
        };
      }),
    addChain: (chain) => set((state) => ({ chains: [...state.chains, chain] })),
    removeChain: (payload) =>
      set((state) => {
        const removeId = typeof payload == "string" ? payload : payload.id;
        const newChains = state.chains
          .filter((chain) => chain.id != removeId)
          .map((chain) => ({
            ...chain,
            transforms: chain.transforms.filter((id) => id != removeId),
          }));
        return {
          chains: newChains,
        };
      }),
    addTransform: (transform) =>
      set((state) => ({ transforms: [...state.transforms, transform] })),
    removeTransform: (payload) =>
      set((state) => {
        const removeId = typeof payload == "string" ? payload : payload.id;
        const newTransforms = state.transforms.filter(
          (transform) => transform.id != removeId,
        );
        const newChains = state.chains.map((chain) => ({
          ...chain,
          transforms: chain.transforms.filter((id) => id != removeId),
        }));
        return { chains: newChains, transforms: newTransforms };
      }),
    setTransforms: (payload) =>
      set((state) => {
        const newTransforms =
          typeof payload === "function" ? payload(state.transforms) : payload;
        return { transforms: newTransforms };
      }),
    setTransform: (payload) =>
      set((state) => {
        const newTransforms = (transforms: Transforms[]) => {
          if ("payload" in payload) {
            const transformGetterGetter = (
              pld: React.SetStateAction<Transforms>,
            ) => {
              if (typeof pld == "function") {
                return (chain: Transforms) => pld(chain);
              }
              return (_: Transforms) => pld;
            };

            const transformGetter = transformGetterGetter(payload.payload);

            return transforms.map((transform) => {
              if (transform.id != payload.id) return transform;
              return transformGetter(transform);
            });
          } else {
            return transforms.map((transform) => {
              if (transform.id != payload.id) return transform;
              return payload;
            });
          }
        };

        return {
          transforms: newTransforms(state.transforms),
        };
      }),
    isTransformValid: (id) => {
      const state = get();
      const transform = state.transforms.find(
        (transform) => transform.id == id,
      );
      return Boolean(transform && isTransformValid(transform));
    },
    setHovered: (id) =>
      set((state) => {
        if (state.hovered.some((hover) => hover == id)) {
          return state;
        }
        return { hovered: [...state.hovered, id] };
      }),
    removeHovered: (id) =>
      set((state) => ({
        hovered: state.hovered.filter((hover) => hover != id),
      })),
    clearHovered: () => set((_) => ({ hovered: [] })),
    setSelected: (id) => set((_) => ({ selected: id })),
    clearSelected: () => set((_) => ({ selected: undefined })),
  }));
};
