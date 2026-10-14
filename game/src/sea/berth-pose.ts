import {
  berthStyle,
  berthStyleBySilhouette,
  hullMeasure,
  mooringLayout,
  type BerthStyle,
} from './berth-config'
import { portBlueprints, seaLayout, seaPorts, type SeaPortPlacement } from './sea-config'
import { voyagePhase, type VoyageState } from '../voyage/voyage-state'

export interface WorldPoint {
  x: number
  y: number
  z: number
}

export interface ShipPose extends WorldPoint {
  yaw: number
}

export interface BerthPlan {
  portId: string
  pose: ShipPose
  castPose: ShipPose
  cleatSide: number
  pierCleats: WorldPoint[]
}

interface LocalBerth {
  localX: number
  localZ: number
  yawOffset: number
  cleatSide: number
  castX: number
  castZ: number
}

const localToWorld = (
  port: SeaPortPlacement,
  localX: number,
  localY: number,
  localZ: number,
): WorldPoint => {
  const yaw = port.yaw
  return {
    x: port.position[0] + localX * Math.cos(yaw) + localZ * Math.sin(yaw),
    y: port.position[1] + localY,
    z: port.position[2] - localX * Math.sin(yaw) + localZ * Math.cos(yaw),
  }
}

const alongsideBerth = (width: number, length: number): LocalBerth => {
  const localX = width / 2 + hullMeasure.beam / 2 + mooringLayout.gap
  const localZ = seaLayout.pierRoot + length - hullMeasure.length / 2 - mooringLayout.sternMargin
  return {
    localX,
    localZ,
    yawOffset: 0,
    cleatSide: -1,
    castX: localX + mooringLayout.castOffSide,
    castZ: localZ + mooringLayout.castOffForward,
  }
}

const faceBerth = (length: number): LocalBerth => {
  const localZ = seaLayout.pierRoot + length + hullMeasure.beam / 2 + mooringLayout.gap
  return {
    localX: 0,
    localZ,
    yawOffset: Math.PI / 2,
    cleatSide: 1,
    castX: 0,
    castZ: localZ + mooringLayout.castOffSide,
  }
}

const berthLocals = (style: BerthStyle, width: number, length: number): LocalBerth => {
  if (style === berthStyle.acrossFace) {
    return faceBerth(length)
  }
  return alongsideBerth(width, length)
}

const pierEdge = (style: BerthStyle, width: number, length: number, berthZ: number, along: number) => {
  if (style === berthStyle.acrossFace) {
    return { x: along, z: seaLayout.pierRoot + length }
  }
  return { x: width / 2, z: berthZ + along }
}

const poseAt = (port: SeaPortPlacement, localX: number, localZ: number, yawOffset: number): ShipPose => {
  const flat = localToWorld(port, localX, 0, localZ)
  return {
    x: flat.x,
    y: seaLayout.waterLevel,
    z: flat.z,
    yaw: port.yaw + yawOffset,
  }
}

const hullFitsWater = (pose: ShipPose): boolean => {
  const forwardX = Math.sin(pose.yaw)
  const forwardZ = Math.cos(pose.yaw)
  const sideX = Math.cos(pose.yaw)
  const sideZ = -Math.sin(pose.yaw)
  const halfLength = hullMeasure.length / 2
  const halfBeam = hullMeasure.beam / 2
  const samples: Array<[number, number]> = [
    [0, 0],
    [halfLength, 0],
    [-halfLength, 0],
    [halfLength, halfBeam],
    [-halfLength, -halfBeam],
  ]
  return samples.every(([along, side]) => {
    const x = pose.x + forwardX * along + sideX * side
    const z = pose.z + forwardZ * along + sideZ * side
    const nx = x / seaLayout.waterRadiusX
    const nz = z / seaLayout.waterRadiusZ
    return nx * nx + nz * nz <= 1
  })
}

const buildBerth = (port: SeaPortPlacement): BerthPlan => {
  const blueprint = portBlueprints[port.silhouette]
  const style = berthStyleBySilhouette[port.silhouette]
  const local = berthLocals(style, blueprint.pier.width, blueprint.pier.length)
  const pose = poseAt(port, local.localX, local.localZ, local.yawOffset)
  const castPose = poseAt(port, local.castX, local.castZ, local.yawOffset)
  if (!hullFitsWater(pose) || !hullFitsWater(castPose)) {
    throw new Error(`El amarre de ${port.id} no está en el agua`)
  }
  const deckY = seaLayout.deckTop - seaLayout.coastTop + mooringLayout.bollardRaise
  const pierCleats = mooringLayout.cleatAlong.map((along) => {
    const edge = pierEdge(style, blueprint.pier.width, blueprint.pier.length, local.localZ, along)
    return localToWorld(port, edge.x, deckY, edge.z)
  })
  return { portId: port.id, pose, castPose, cleatSide: local.cleatSide, pierCleats }
}

const berthPlans = new Map(seaPorts.map((port) => [port.id, buildBerth(port)]))

/** Amarre fijo de un puerto. La salida empieza y termina en uno de estos. */
export function planFor(portId: string): BerthPlan {
  const plan = berthPlans.get(portId)
  if (!plan) {
    throw new Error('No hay amarre para ese puerto')
  }
  return plan
}

const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount

const smooth = (value: number) => {
  const amount = Math.min(1, Math.max(0, value))
  return amount * amount * (3 - 2 * amount)
}

const lerpAngle = (from: number, to: number, amount: number) => {
  const turn = Math.atan2(Math.sin(to - from), Math.cos(to - from))
  return from + turn * amount
}

/** Interpola posición y rumbo del casco. */
export function lerpPose(from: ShipPose, to: ShipPose, amount: number): ShipPose {
  return {
    x: lerp(from.x, to.x, amount),
    y: lerp(from.y, to.y, amount),
    z: lerp(from.z, to.z, amount),
    yaw: lerpAngle(from.yaw, to.yaw, amount),
  }
}

/** Dónde está el casco: amarrado, saliendo al agua o entrando a otro muelle. */
export function poseForVoyage(state: VoyageState): ShipPose {
  const origin = planFor(state.portId)
  if (state.phase === voyagePhase.moored) {
    return origin.pose
  }
  if (state.phase === voyagePhase.docking && state.destinationPortId) {
    return lerpPose(origin.castPose, planFor(state.destinationPortId).pose, smooth(state.progress))
  }
  const leave = state.phase === voyagePhase.atSea ? 1 : smooth(state.progress)
  return lerpPose(origin.pose, origin.castPose, leave)
}

/** Bita del casco, en el costado que mira al muelle. */
export function cleatWorld(pose: ShipPose, cleatSide: number, along: number): WorldPoint {
  const forwardX = Math.sin(pose.yaw)
  const forwardZ = Math.cos(pose.yaw)
  const sideX = Math.cos(pose.yaw)
  const sideZ = -Math.sin(pose.yaw)
  const side = cleatSide * (hullMeasure.beam / 2)
  return {
    x: pose.x + forwardX * along + sideX * side,
    y: pose.y + mooringLayout.cleatHeight,
    z: pose.z + forwardZ * along + sideZ * side,
  }
}
