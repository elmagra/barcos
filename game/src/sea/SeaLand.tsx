import { useMemo } from 'react'
import * as THREE from 'three'
import { createBeachGeometry, createCoastGeometry } from './coast-geometry'
import { palette } from './palette'
import { seaLayout } from './sea-config'

/** Costa de piedra y orilla de espuma que cierran el agua. */
export function SeaLand() {
  const coastGeometry = useMemo(() => createCoastGeometry(), [])
  const beachGeometry = useMemo(() => createBeachGeometry(), [])

  return (
    <group>
      <mesh
        rotation-x={-Math.PI / 2}
        position={[0, 0.02, 0]}
        scale={[seaLayout.innerRadiusX, seaLayout.innerRadiusZ, 1]}
      >
        <circleGeometry args={[1, 48]} />
        <meshBasicMaterial color={palette.deepWater} />
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
