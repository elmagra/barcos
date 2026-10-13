export interface OutingPoint {
  id: string
  position: [number, number, number]
}

export interface OutingMeasure {
  fromId: string
  toId: string
  meters: number
}

/** Distancia horizontal de un trayecto, en metros. */
export function measureOutingMeters(
  from: [number, number, number],
  to: [number, number, number],
): number {
  return Math.hypot(from[0] - to[0], from[2] - to[2])
}

/** Los tres trayectos del mar, uno por cada par de puertos. */
export function measureAllOutings(ports: OutingPoint[]): OutingMeasure[] {
  const measures: OutingMeasure[] = []
  for (let origin = 0; origin < ports.length; origin += 1) {
    for (let destination = origin + 1; destination < ports.length; destination += 1) {
      const from = ports[origin]
      const to = ports[destination]
      measures.push({
        fromId: from.id,
        toId: to.id,
        meters: measureOutingMeters(from.position, to.position),
      })
    }
  }
  return measures
}
