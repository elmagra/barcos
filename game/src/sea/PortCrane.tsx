import { palette } from './palette'
import { seaLayout, type CranePlan } from './sea-config'

/** Grúa de metal sobre el muelle. */
export function PortCrane({ plan }: { plan: CranePlan }) {
  const baseY = seaLayout.deckTop - seaLayout.coastTop

  return (
    <group position={[plan.x, baseY, plan.z]}>
      <mesh position={[0, 0.16, 0]} castShadow>
        <boxGeometry args={[1.5, 0.32, 1.5]} />
        <meshLambertMaterial color={palette.metal} />
      </mesh>
      <mesh position={[0, plan.height / 2, 0]} castShadow>
        <boxGeometry args={[0.55, plan.height, 0.55]} />
        <meshLambertMaterial color={palette.metal} />
      </mesh>
      <mesh position={[0, plan.height - 0.45, 0.15]} castShadow>
        <boxGeometry args={[1.15, 0.85, 1.15]} />
        <meshLambertMaterial color={palette.metal} />
      </mesh>
      <mesh position={[0, plan.height, plan.jib / 2]} castShadow>
        <boxGeometry args={[0.38, 0.3, plan.jib]} />
        <meshLambertMaterial color={palette.metal} />
      </mesh>
      <mesh position={[0, plan.height - 0.85, plan.jib * 0.9]}>
        <boxGeometry args={[0.1, 1.5, 0.1]} />
        <meshLambertMaterial color={palette.metal} />
      </mesh>
    </group>
  )
}
