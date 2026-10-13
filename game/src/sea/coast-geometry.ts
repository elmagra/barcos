import * as THREE from 'three'
import { innerShorePoint, seaLayout } from './sea-config'

interface FlatPoint {
  x: number
  z: number
}

function ringAngle(index: number, count: number): number {
  return (index / count) * Math.PI * 2
}

function coastOuterPoint(index: number, count: number): FlatPoint {
  const angle = ringAngle(index, count)
  const wobble = Math.sin(angle * 3) * seaLayout.outerWobbleA
  const ripple = Math.cos(angle * 5) * seaLayout.outerWobbleB
  const radius = seaLayout.outerRadius + wobble + ripple
  return {
    x: Math.cos(angle) * radius * seaLayout.outerStretchX,
    z: Math.sin(angle) * radius * seaLayout.outerStretchZ,
  }
}

function coastInnerPoint(index: number, count: number): FlatPoint {
  return innerShorePoint(ringAngle(index, count))
}

function beachInnerPoint(index: number, count: number): FlatPoint {
  const angle = ringAngle(index, count)
  return {
    x: Math.cos(angle) * seaLayout.waterRadiusX,
    z: Math.sin(angle) * seaLayout.waterRadiusZ,
  }
}

function collectRing(
  count: number,
  atPoint: (index: number, count: number) => FlatPoint,
): FlatPoint[] {
  return Array.from({ length: count }, (_, index) => atPoint(index, count))
}

function pushVertex(positions: number[], x: number, y: number, z: number) {
  positions.push(x, y, z)
}

function pushTop(positions: number[], outer: FlatPoint[], inner: FlatPoint[], y: number) {
  for (let index = 0; index < outer.length; index += 1) {
    const next = (index + 1) % outer.length
    const start = outer[index]
    const end = outer[next]
    const endHole = inner[next]
    const startHole = inner[index]
    pushVertex(positions, start.x, y, start.z)
    pushVertex(positions, endHole.x, y, endHole.z)
    pushVertex(positions, end.x, y, end.z)
    pushVertex(positions, start.x, y, start.z)
    pushVertex(positions, startHole.x, y, startHole.z)
    pushVertex(positions, endHole.x, y, endHole.z)
  }
}

function pushWall(positions: number[], ring: FlatPoint[], yTop: number, yBottom: number) {
  for (let index = 0; index < ring.length; index += 1) {
    const next = (index + 1) % ring.length
    const start = ring[index]
    const end = ring[next]
    pushVertex(positions, start.x, yTop, start.z)
    pushVertex(positions, start.x, yBottom, start.z)
    pushVertex(positions, end.x, yTop, end.z)
    pushVertex(positions, end.x, yTop, end.z)
    pushVertex(positions, start.x, yBottom, start.z)
    pushVertex(positions, end.x, yBottom, end.z)
  }
}

function geometryFromPositions(positions: number[]): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.computeVertexNormals()
  return geometry
}

function assertCoastClosesWater(outer: FlatPoint[], inner: FlatPoint[]) {
  for (let index = 0; index < outer.length; index += 1) {
    const land = Math.hypot(outer[index].x, outer[index].z)
    const shore = Math.hypot(inner[index].x, inner[index].z)
    const nx = inner[index].x / seaLayout.waterRadiusX
    const nz = inner[index].z / seaLayout.waterRadiusZ
    const outsideWater = nx * nx + nz * nz
    if (land <= shore + seaLayout.minLandMeters || outsideWater < 1.04) {
      throw new Error('La costa no cierra el agua')
    }
  }
}

/** Anillo de tierra que deja un solo hueco de agua. */
export function createCoastGeometry(): THREE.BufferGeometry {
  const outer = collectRing(seaLayout.segments, coastOuterPoint)
  const inner = collectRing(seaLayout.segments, coastInnerPoint)
  assertCoastClosesWater(outer, inner)
  const positions: number[] = []
  pushTop(positions, outer, inner, seaLayout.coastTop)
  pushWall(positions, outer, seaLayout.coastTop, seaLayout.wallBottom)
  pushWall(positions, inner, seaLayout.coastTop, seaLayout.wallBottom)
  return geometryFromPositions(positions)
}

/** Orilla de espuma entre el agua y el muro de costa. */
export function createBeachGeometry(): THREE.BufferGeometry {
  const outer = collectRing(seaLayout.segments, coastInnerPoint)
  const inner = collectRing(seaLayout.segments, beachInnerPoint)
  const positions: number[] = []
  pushTop(positions, outer, inner, seaLayout.beachLevel)
  return geometryFromPositions(positions)
}
