import { voyageTiming } from '../sea/berth-config'
import { seaPorts } from '../sea/sea-config'

export const voyagePhase = {
  moored: 'moored',
  castingOff: 'castingOff',
  atSea: 'atSea',
  docking: 'docking',
} as const

export type VoyagePhase = (typeof voyagePhase)[keyof typeof voyagePhase]

export interface VoyageState {
  phase: VoyagePhase
  portId: string
  destinationPortId: string | null
  progress: number
  hasLeftDock: boolean
}

/** La salida empieza amarrada en el muelle de casa. */
export function createMooredVoyage(portId: string): VoyageState {
  return {
    phase: voyagePhase.moored,
    portId,
    destinationPortId: null,
    progress: 1,
    hasLeftDock: false,
  }
}

/** Suelta amarras y pasa al agua. No es un timón de viaje. */
export function requestCastOff(state: VoyageState): VoyageState {
  if (state.phase !== voyagePhase.moored) {
    return state
  }
  return {
    ...state,
    phase: voyagePhase.castingOff,
    progress: 0,
    destinationPortId: null,
    hasLeftDock: true,
  }
}

const knownPort = (portId: string) => seaPorts.some((port) => port.id === portId)

/** Pide atraque en uno de los tres puertos. */
export function requestDock(state: VoyageState, portId: string): VoyageState {
  if (state.phase !== voyagePhase.atSea || !knownPort(portId)) {
    return state
  }
  return {
    ...state,
    phase: voyagePhase.docking,
    destinationPortId: portId,
    progress: 0,
  }
}

const stepToward = (progress: number, delta: number, seconds: number) => {
  return Math.min(1, progress + delta / seconds)
}

const stepCastOff = (state: VoyageState, delta: number): VoyageState => {
  const progress = stepToward(state.progress, delta, voyageTiming.castOffSeconds)
  if (progress < 1) {
    return { ...state, progress }
  }
  return { ...state, phase: voyagePhase.atSea, progress: 1 }
}

const stepDock = (state: VoyageState, delta: number): VoyageState => {
  const progress = stepToward(state.progress, delta, voyageTiming.dockSeconds)
  if (progress < 1 || !state.destinationPortId) {
    return { ...state, progress }
  }
  return {
    phase: voyagePhase.moored,
    portId: state.destinationPortId,
    destinationPortId: null,
    progress: 1,
    hasLeftDock: true,
  }
}

/** Avanza la maniobra de salida o de atraque. En el agua se queda quieto. */
export function advanceVoyage(state: VoyageState, delta: number): VoyageState {
  if (state.phase === voyagePhase.castingOff) {
    return stepCastOff(state, delta)
  }
  if (state.phase === voyagePhase.docking) {
    return stepDock(state, delta)
  }
  return state
}

/** El puerto cuyas bitas sujetan las amarras en este instante. */
export function ropePortId(state: VoyageState): string {
  if (state.phase === voyagePhase.docking && state.destinationPortId) {
    return state.destinationPortId
  }
  return state.portId
}

/** Las amarras siguen firmes al empezar a zarpar y al terminar de atracar. */
export function ropesAreFast(state: VoyageState): boolean {
  if (state.phase === voyagePhase.moored) {
    return true
  }
  if (state.phase === voyagePhase.castingOff) {
    return state.progress < voyageTiming.ropeRelease
  }
  if (state.phase === voyagePhase.docking) {
    return state.progress > 1 - voyageTiming.ropeRelease
  }
  return false
}
