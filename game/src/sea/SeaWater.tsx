import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { palette } from './palette'
import { seaCover, seaLayout, seaView } from './sea-config'
import { createSeaCover } from './water-cover'
import { waterFragmentShader, waterVertexShader } from './water-shader'

const colorVector = (hex: string) => {
  const color = new THREE.Color(hex)
  return new THREE.Vector3(color.r, color.g, color.b)
}

const createWaterUniforms = () => {
  return {
    uDeep: { value: colorVector(palette.deepWater) },
    uCoast: { value: colorVector(palette.coastalWater) },
    uFogColor: { value: colorVector(palette.sky) },
    uTime: { value: 0 },
    uFogNear: { value: seaView.fogNear },
    uFogFar: { value: seaView.fogFar },
    uRadius: {
      value: new THREE.Vector2(
        seaLayout.waterRadiusX * seaCover.overflow,
        seaLayout.waterRadiusZ * seaCover.overflow,
      ),
    },
  }
}

/** Agua que tapa el mar: rejilla cerrada, sin el corte claro del abanico. */
export function SeaWater() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(() => createWaterUniforms(), [])
  const geometry = useMemo(
    () => createSeaCover(
      seaLayout.waterRadiusX * seaCover.overflow,
      seaLayout.waterRadiusZ * seaCover.overflow,
      seaCover.columns,
      seaCover.rows,
    ),
    [],
  )

  useFrame((state) => {
    if (!materialRef.current) {
      return
    }
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <mesh geometry={geometry} position={[0, seaLayout.waterLevel, 0]}>
      <shaderMaterial
        ref={materialRef}
        side={THREE.DoubleSide}
        toneMapped={false}
        uniforms={uniforms}
        vertexShader={waterVertexShader}
        fragmentShader={waterFragmentShader}
      />
    </mesh>
  )
}
