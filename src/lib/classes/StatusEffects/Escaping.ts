import { Wander } from './Wander'
import Creature from '../Cells/Creature'
import * as _ from 'lodash'

export class Escaping extends Wander {
  name = 'Escaping'

  constructor (protected threshold: number = 1) {
    super(threshold)
  }

  resolve (cell: Creature<any>) {
    if (this.elapsed % cell.get('speed') !== 0) {
      return false
    }

    const surroundingTiles = [
      { x: -1, y: 0  },
      { x: 1,  y: 0  },
      { x: 0,  y: -1 },
      { x: 0,  y: 1  }
    ]

    const candidates = _.shuffle(surroundingTiles)
      .filter(tile => {
        const canMove = cell.canMove(tile.x, tile.y)
        return (
          canMove === Creature.MoveStatus.OK
          || canMove === Creature.MoveStatus.OutOfBounds
        )
      })
    for (const tile of candidates) {
      const canMove = cell.canMove(tile.x, tile.y)
      if (canMove === Creature.MoveStatus.OutOfBounds) {
        cell.remove()
        return true
      }
    }

    if (candidates.length === 0) {
      return false
    }

    const { x: newX, y: newY } = candidates[0]
    cell.move(newX, newY)

    return true
  }
}
