import Creature from '../Cells/Creature'
import { Damage } from './Damage'
import { IDamage } from '../../interfaces/IDamage';

export class Burning extends Damage {
  name = 'Burning'
  delay = 1
  duration = 6
  iterations = 6

  constructor (
    protected amount: number,
    protected damageType: keyof IDamage = 'fire'
  ) {
    super(amount, damageType)
  }

  protected resolve (cell: Creature<any>) {
    cell.applyDamage(this.amount, this.damageType, this)
    return true
  }
}
