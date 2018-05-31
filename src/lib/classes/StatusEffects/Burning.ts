import Creature from '../Cells/Creature'
import { Damage } from './Damage'

export class Burning extends Damage {
  name = 'Burning'
  delay = 1
  duration = 6
  iterations = 6

  constructor (
    protected amount: number,
    protected damageType: string = 'fire'
  ) {
    super(amount, damageType)
  }

  protected resolve (cell: Creature) {
    cell.applyDamage(this.amount, this.damageType, this)
    return true
  }
}
