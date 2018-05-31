export const enum DamageType {
  Physical,
  Cold,
  Fire,
  Poison
}

export interface IDamage {
  physical: number
  cold: number
  fire: number
  poison: number
}
