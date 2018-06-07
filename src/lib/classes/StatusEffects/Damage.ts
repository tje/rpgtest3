import {
  Effect,
  Fixture
} from './StatusEffect'
import { TurnPhase } from '../../interfaces/ICell'
import Creature from '../Cells/Creature'
import { IDamage } from '../../interfaces/IDamage';

export class Damage extends Effect {
  name = 'Damage'
  delay = 0
  iterations = 1
  phase = TurnPhase.End
  fixture = Fixture.Pre

  constructor (
    protected amount: number,
    protected damageType: keyof IDamage = 'physical'
  ) {
    super()
  }

  protected resolve (cell: Creature<any>) {
    cell.applyDamage(this.amount, this.damageType)
    return true
  }
}
