import { ICellData } from './ICell'
import { IDamage } from './IDamage'

export interface ICreatureData extends ICellData {
  health: number
  resistance: IDamage
}
