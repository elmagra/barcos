import { measureAllOutings } from './measure-outing'

/** Medidas del único mar: una salida cabe en la vista. */
export const seaLayout = {
  outerRadius: 150,
  outerStretchX: 1.08,
  outerStretchZ: 0.94,
  outerWobbleA: 18,
  outerWobbleB: 9,
  innerRadiusX: 82,
  innerRadiusZ: 62,
  innerWobble: 0.11,
  waterRadiusX: 58,
  waterRadiusZ: 42,
  coastTop: 3.6,
  wallBottom: -1.4,
  waterLevel: 0.42,
  deckTop: 1.45,
  beachLevel: 0.16,
  pierRoot: 0.75,
  maxOutingMeters: 180,
  segments: 96,
  minLandMeters: 12,
}

export const seaQuality = {
  dpr: [1, 2] as [number, number],
  performanceMin: 0.5,
  antialias: true,
  shadows: true,
}

export const seaLight = {
  ambientIntensity: 0.55,
  hemisphereIntensity: 0.2,
  sunIntensity: 1.15,
  sunPosition: [24, 72, 18] as [number, number, number],
  shadowExtent: 170,
  shadowFar: 220,
}

export const portSilhouette = {
  longPier: 'longPier',
  wideQuay: 'wideQuay',
  tallCrane: 'tallCrane',
} as const

export type PortSilhouette = (typeof portSilhouette)[keyof typeof portSilhouette]

export interface PierPlan {
  length: number
  width: number
  thickness: number
}

export interface ShedPlan {
  width: number
  depth: number
  height: number
  offsetZ: number
}

export interface CranePlan {
  height: number
  jib: number
  x: number
  z: number
}

export interface PortBlueprint {
  pier: PierPlan
  shed: ShedPlan
  crane: CranePlan
}

export const portBlueprints: Record<PortSilhouette, PortBlueprint> = {
  longPier: {
    pier: { length: 34, width: 3.4, thickness: 0.42 },
    shed: { width: 6.4, depth: 4.8, height: 4.6, offsetZ: -4.4 },
    crane: { height: 8.6, jib: 9, x: 0, z: 24 },
  },
  wideQuay: {
    pier: { length: 32, width: 16, thickness: 0.55 },
    shed: { width: 13.5, depth: 4.6, height: 3.5, offsetZ: -4.2 },
    crane: { height: 7.2, jib: 9.5, x: -5.4, z: 9 },
  },
  tallCrane: {
    pier: { length: 33, width: 4.2, thickness: 0.42 },
    shed: { width: 5.4, depth: 4.2, height: 3.2, offsetZ: -3.8 },
    crane: { height: 16, jib: 12, x: 0.4, z: 6.5 },
  },
}

export interface SeaPortPlacement {
  id: string
  silhouette: PortSilhouette
  position: [number, number, number]
  yaw: number
}

interface PortSeed {
  id: string
  silhouette: PortSilhouette
  angle: number
}

/** Punto de la orilla interior. La misma curva coloca la costa y los puertos. */
export function innerShorePoint(angle: number) {
  const swell = Math.sin(angle * 2) * seaLayout.innerWobble
  const nick = Math.cos(angle * 5) * seaLayout.innerWobble * 0.45
  const scale = 1 + swell + nick
  return {
    x: Math.cos(angle) * seaLayout.innerRadiusX * scale,
    z: Math.sin(angle) * seaLayout.innerRadiusZ * scale,
  }
}

const portSeeds: PortSeed[] = [
  { id: 'calaNorte', silhouette: portSilhouette.longPier, angle: -Math.PI / 2 },
  { id: 'darsenaEste', silhouette: portSilhouette.wideQuay, angle: 0.22 },
  { id: 'gruaOeste', silhouette: portSilhouette.tallCrane, angle: Math.PI - 0.38 },
]

function placePort(seed: PortSeed): SeaPortPlacement {
  const shore = innerShorePoint(seed.angle)
  return {
    id: seed.id,
    silhouette: seed.silhouette,
    position: [shore.x, seaLayout.coastTop, shore.z],
    yaw: Math.atan2(-shore.x, -shore.z),
  }
}

/** Tres puertos fijos sobre la costa interior. */
export const seaPorts: SeaPortPlacement[] = portSeeds.map((seed) => placePort(seed))

/** Trayectos entre puertos, en metros de una salida. */
export const outingMeasures = measureAllOutings(seaPorts)

const longestOuting = outingMeasures.reduce((longest, outing) => {
  return Math.max(longest, outing.meters)
}, 0)

if (longestOuting > seaLayout.maxOutingMeters) {
  throw new Error('El trayecto más largo no cabe en una salida')
}

/** Rejilla que tapa el óvalo del agua, más densa que un abanico. */
export const seaCover = {
  overflow: 1.015,
  columns: 70,
  rows: 50,
  fillColumns: 48,
  fillRows: 36,
}

export const seaView = {
  cameraPosition: [18, 42, 128] as [number, number, number],
  cameraTarget: [0, 2, -12] as [number, number, number],
  fov: 50,
  near: 0.1,
  far: longestOuting * 8,
  fogNear: longestOuting * 2.15,
  fogFar: longestOuting * 4.4,
  minDistance: 70,
  maxDistance: longestOuting * 1.7,
  maxPolarAngle: Math.PI / 2.08,
}
