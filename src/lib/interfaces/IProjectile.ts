import { ICreatureData } from './ICreature'
import { IDamage } from './IDamage'

export interface IProjectileData extends ICreatureData {
  trajectoryX: number
  trajectoryY: number
}
