import {
  Effect,
  Fixture
} from './StatusEffect'
import { TurnPhase } from '../../interfaces/ICell'
import Creature from '../Cells/Creature'

export class Damage extends Effect {
  name = 'Damage'
  delay = 0
  iterations = 1
  phase = TurnPhase.End
  fixture = Fixture.Pre

  constructor (
    protected amount: number,
    protected damageType: string = 'physical'
  ) {
    super()
  }

  protected resolve (cell: Creature) {
    cell.applyDamage(this.amount, this.damageType)
    return true
  }
}
