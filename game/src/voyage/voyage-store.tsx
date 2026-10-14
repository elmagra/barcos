import { createContext, useContext, useRef, type ReactNode } from 'react'
import { seaPorts } from '../sea/sea-config'
import {
  advanceVoyage,
  createMooredVoyage,
  requestCastOff,
  requestDock,
  type VoyageState,
} from './voyage-state'

export interface VoyageStore {
  getState: () => VoyageState
  advance: (delta: number) => void
  castOff: () => void
  dockAt: (portId: string) => void
  subscribe: (listener: () => void) => () => void
}

const VoyageContext = createContext<VoyageStore | null>(null)

const createVoyageStore = (): VoyageStore => {
  const homePortId = seaPorts[0]?.id
  if (!homePortId) {
    throw new Error('No hay puerto de salida')
  }
  let state = createMooredVoyage(homePortId)
  const listeners = new Set<() => void>()
  const notify = () => {
    listeners.forEach((listener) => listener())
  }
  const replace = (next: VoyageState, announce: boolean) => {
    if (next === state) {
      return
    }
    state = next
    if (announce) {
      notify()
    }
  }
  return {
    getState: () => state,
    advance: (delta: number) => {
      const next = advanceVoyage(state, delta)
      const announce = next.phase !== state.phase || next.portId !== state.portId
      replace(next, announce)
    },
    castOff: () => replace(requestCastOff(state), true),
    dockAt: (portId: string) => replace(requestDock(state, portId), true),
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

/** Estado de la salida, compartido por el casco y los botones. */
export function VoyageProvider({ children }: { children: ReactNode }) {
  const store = useRef<VoyageStore | null>(null)
  if (!store.current) {
    store.current = createVoyageStore()
  }
  return <VoyageContext.Provider value={store.current}>{children}</VoyageContext.Provider>
}

/** Lee el almacén de la salida. Tiene que vivir bajo VoyageProvider. */
export function useVoyageStore(): VoyageStore {
  const store = useContext(VoyageContext)
  if (!store) {
    throw new Error('La salida no está montada')
  }
  return store
}
