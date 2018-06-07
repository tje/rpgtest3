export interface ICellData {
  name: string
  priority: number
  x: number
  y: number
  speed: number
  altitude: number
  solid: boolean
  statusEffects: any
}

export const enum TurnPhase {
  Start = 'start',
  Move = 'move',
  Action = 'action',
  End = 'end'
}

export type TurnMethod = 'turnStart' | 'turnMove' | 'turnAction' | 'turnEnd'

export interface ICell {
  turn: (phase: TurnPhase, tick: number) => void
  turnStart: (tick: number) => void
  turnMove: (tick: number) => void
  turnAction: (tick: number) => void
  turnEnd: (tick: number) => void

  resolveStatusEffects: (tick: number) => void
  resolveDamage: (tick: number) => void
}

export interface ICellProxyHandler<T extends ICellData> extends ProxyHandler<T> {
  get? <T, K extends keyof T>(t: T, p: K, r: any): T[K]
  set? <T, K extends keyof T>(t: T, p: K, v: T[K], r: any): boolean
}