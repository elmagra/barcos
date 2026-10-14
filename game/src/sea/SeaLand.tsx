import { useMemo } from 'react'
import * as THREE from 'three'
import { createBeachGeometry, createCoastGeometry } from './coast-geometry'
import { palette } from './palette'
import { seaCover, seaLayout } from './sea-config'
import { createSeaCover } from './water-cover'

/** Costa de piedra y orilla de espuma que cierran el agua. */
export function SeaLand() {
  const coastGeometry = useMemo(() => createCoastGeometry(), [])
  const beachGeometry = useMemo(() => createBeachGeometry(), [])
  const fillGeometry = useMemo(
    () => createSeaCover(
      seaLayout.innerRadiusX,
      seaLayout.innerRadiusZ,
      seaCover.fillColumns,
      seaCover.fillRows,
    ),
    [],
  )

  return (
    <group>
      <mesh geometry={fillGeometry} position={[0, 0.02, 0]}>
        <meshBasicMaterial color={palette.deepWater} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={coastGeometry} castShadow receiveShadow>
        <meshLambertMaterial color={palette.metal} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={beachGeometry}>
        <meshBasicMaterial color={palette.foam} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}
