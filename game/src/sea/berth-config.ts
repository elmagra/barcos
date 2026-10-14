import { portSilhouette, type PortSilhouette } from './sea-config'

/** Cómo se amarra el casco respecto del muelle. */
export const berthStyle = {
  alongside: 'alongside',
  acrossFace: 'acrossFace',
} as const

export type BerthStyle = (typeof berthStyle)[keyof typeof berthStyle]

export const berthStyleBySilhouette: Record<PortSilhouette, BerthStyle> = {
  [portSilhouette.longPier]: berthStyle.alongside,
  [portSilhouette.wideQuay]: berthStyle.acrossFace,
  [portSilhouette.tallCrane]: berthStyle.alongside,
}

export const portLabel: Record<string, string> = {
  calaNorte: 'Cala Norte',
  darsenaEste: 'Dársena Este',
  gruaOeste: 'Grúa Oeste',
}

/** Medidas del casco humilde, en metros, tomadas del GLB. */
export const hullMeasure = {
  beam: 4,
  length: 12,
  keel: 0.55,
  url: '/models/SM_Humilde.glb',
}

/** Distancias del amarre y de la maniobra corta junto al muelle. */
export const mooringLayout = {
  gap: 0.9,
  sternMargin: 1.1,
  castOffSide: 12,
  castOffForward: 8,
  cleatHeight: 1.15,
  bollardRaise: 0.42,
  cleatAlong: [-3.4, 0, 3.4],
  ropeRadius: 0.045,
}

export const voyageTiming = {
  castOffSeconds: 3.4,
  dockSeconds: 6.5,
  ropeRelease: 0.42,
}

/** Encuadre del barco al soltar amarras o al quedar amarrado. */
export const berthView = {
  back: 30,
  side: 18,
  height: 16,
  lookHeight: 1.8,
}
