import {
  Effect,
  Fixture
} from './StatusEffect'
import { TurnPhase } from '../../interfaces/ICell'
import Creature from '../Cells/Creature'

export class Wander extends Effect {
  name = 'Wander'
  delay = 0
  phase = TurnPhase.Move

  constructor (
    protected threshold: number = 0.5
  ) {
    super()
  }

  protected resolve (cell: Creature) {
    if (this.elapsed % cell.get('speed') !== 0) {
      return false
    }

    if (Math.random() > this.threshold) {
      return false
    }

    let x = 1 * Math.round(Math.random() * -1)
    let y = 0
    if (Math.random() > 0.5) {
      y = x
      x = 0
    }

    const canMove = cell.canMove(x, y, true)
    switch (canMove) {
      case Creature.MoveStatus.OutOfBounds:
        // @todo if cell is escaping, then we're alright
        break
      case Creature.MoveStatus.OK:
        cell.move(x, y)
        break
    }

    return true
  }
}
