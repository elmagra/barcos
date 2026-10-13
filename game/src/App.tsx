import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { SeaErrorBoundary } from './SeaErrorBoundary'
import { SeaScene } from './sea/SeaScene'
import { palette } from './sea/palette'
import { seaQuality, seaView } from './sea/sea-config'

function App() {
  return (
    <div className="app-container">
      <SeaErrorBoundary>
        <Canvas
          camera={{
            position: seaView.cameraPosition,
            fov: seaView.fov,
            near: seaView.near,
            far: seaView.far,
          }}
          shadows={seaQuality.shadows}
          dpr={seaQuality.dpr}
          performance={{ min: seaQuality.performanceMin }}
          gl={{
            antialias: seaQuality.antialias,
            alpha: false,
            powerPreference: 'high-performance',
            toneMapping: THREE.NoToneMapping,
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(palette.sky)
          }}
        >
          <Suspense fallback={null}>
            <SeaScene />
          </Suspense>
        </Canvas>
      </SeaErrorBoundary>
    </div>
  )
}

export default App
