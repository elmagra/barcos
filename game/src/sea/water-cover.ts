import * as THREE from 'three'

interface CoverPoint {
  x: number
  z: number
  outside: boolean
}

const pointOnEllipse = (x: number, z: number, radiusX: number, radiusZ: number): CoverPoint => {
  const nx = x / radiusX
  const nz = z / radiusZ
  const dist = Math.hypot(nx, nz)
  if (dist <= 1) {
    return { x, z, outside: false }
  }
  return {
    x: (nx / dist) * radiusX,
    z: (nz / dist) * radiusZ,
    outside: true,
  }
}

const collectCoverPoints = (
  radiusX: number,
  radiusZ: number,
  columns: number,
  rows: number,
): CoverPoint[] => {
  const points: CoverPoint[] = []
  for (let row = 0; row <= rows; row += 1) {
    const v = row / rows
    for (let column = 0; column <= columns; column += 1) {
      const u = column / columns
      const x = (u * 2 - 1) * radiusX
      const z = (v * 2 - 1) * radiusZ
      points.push(pointOnEllipse(x, z, radiusX, radiusZ))
    }
  }
  return points
}

const pushCoverQuad = (indices: number[], corners: CoverPoint[], quad: number[]) => {
  if (corners.every((corner) => corner.outside)) {
    return
  }
  const [a, b, c, d] = quad
  indices.push(a, d, b, b, d, c)
}

const coverIndices = (points: CoverPoint[], columns: number, rows: number): number[] => {
  const indices: number[] = []
  const stride = columns + 1
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const a = row * stride + column
      const b = a + 1
      const d = a + stride
      const c = d + 1
      pushCoverQuad(indices, [points[a], points[b], points[c], points[d]], [a, b, c, d])
    }
  }
  return indices
}

/** Óvalo continuo que tapa el mar. No usa el abanico que dejaba un corte. */
export function createSeaCover(
  radiusX: number,
  radiusZ: number,
  columns: number,
  rows: number,
): THREE.BufferGeometry {
  const points = collectCoverPoints(radiusX, radiusZ, columns, rows)
  const positions = points.flatMap((point) => [point.x, 0, point.z])
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setIndex(coverIndices(points, columns, rows))
  geometry.computeVertexNormals()
  return geometry
}
