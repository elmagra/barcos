import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { palette } from './palette'
import { seaLayout, seaView } from './sea-config'
import { waterFragmentShader, waterVertexShader } from './water-shader'

function colorVector(hex: string) {
  const color = new THREE.Color(hex)
  return new THREE.Vector3(color.r, color.g, color.b)
}

function createWaterUniforms() {
  return {
    uDeep: { value: colorVector(palette.deepWater) },
    uCoast: { value: colorVector(palette.coastalWater) },
    uFoam: { value: colorVector(palette.foam) },
    uFogColor: { value: colorVector(palette.sky) },
    uTime: { value: 0 },
    uFogNear: { value: seaView.fogNear },
    uFogFar: { value: seaView.fogFar },
    uRadius: {
      value: new THREE.Vector2(seaLayout.waterRadiusX, seaLayout.waterRadiusZ),
    },
  }
}

/** Agua del único mar: oscura al centro y clara junto a la orilla. */
export function SeaWater() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(() => createWaterUniforms(), [])

  useFrame((state) => {
    if (!materialRef.current) {
      return
    }
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <mesh
      rotation-x={-Math.PI / 2}
      scale={[seaLayout.waterRadiusX, seaLayout.waterRadiusZ, 1]}
      position={[0, seaLayout.waterLevel, 0]}
    >
      <circleGeometry args={[1, seaLayout.segments]} />
      <shaderMaterial
        ref={materialRef}
        toneMapped={false}
        uniforms={uniforms}
        vertexShader={waterVertexShader}
        fragmentShader={waterFragmentShader}
      />
    </mesh>
  )
}
