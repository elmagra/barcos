import { palette } from './palette'
import type { ShedPlan } from './sea-config'

/** Tinglado del puerto, con tejado de lona. */
export function PortShed({ plan }: { plan: ShedPlan }) {
  return (
    <group position={[0, 0, plan.offsetZ]}>
      <mesh position={[0, plan.height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[plan.width, plan.height, plan.depth]} />
        <meshLambertMaterial color={palette.wood} />
      </mesh>
      <mesh position={[0, plan.height + 0.16, 0]} castShadow>
        <boxGeometry args={[plan.width + 0.6, 0.32, plan.depth + 0.6]} />
        <meshLambertMaterial color={palette.foam} />
      </mesh>
      <mesh position={[0, plan.height * 0.38, plan.depth / 2 + 0.05]}>
        <boxGeometry args={[Math.min(1.4, plan.width * 0.28), plan.height * 0.46, 0.08]} />
        <meshLambertMaterial color={palette.metal} />
      </mesh>
    </group>
  )
}
