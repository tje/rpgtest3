import Cell from './Cell'
import * as StatusEffect from '../StatusEffects/StatusEffect'
import { ICreatureData } from '../../interfaces/ICreature'
import { IDamage } from '../../interfaces/IDamage'

class Creature<C extends ICreatureData> extends Cell<C> {
  get defaults (): C | ICreatureData {
    return Object.assign(super.defaults, {
      name: 'Monster',
      priority: 5,
      speed: 1,
      altitude: 1,
      solid: true,
      health: 100,
      resistance: {
        physical: 0,
        cold: 0,
        fire: 0,
        poison: 0
      }
    })
  }

  canMove (x: number, y: number, relative: boolean = true): Creature.MoveStatus {
    let destX = x
    let destY = y
    if (relative === true) {
      ({ x: destX, y: destY } = this.relativeToAbsolute(x, y))
    }

    if (this.map === undefined) {
      return Creature.MoveStatus.MissingContext
    }

    const { width, height } = this.map
    const outOfBounds = (
      destX < 0
      || destY < 0
      || destX >= width
      || destY >= height
    )
    if (outOfBounds === true) {
      return Creature.MoveStatus.OutOfBounds
    }

    const spaceTaken = this.map.getCells({
      altitude: this.get('altitude'),
      x: destX,
      y: destY,
      solid: true // @todo what i'm allowed to pass through
    }).length > 0
    if (spaceTaken === true) {
      return Creature.MoveStatus.Occupied
    }

    return Creature.MoveStatus.OK
  }

  move (dx: number, dy: number, relative: boolean = true): void {
    let { dx: x, dy: y } = { dx, dy }
    if (relative === true) {
      ({ x, y } = this.relativeToAbsolute(x, y))
    }

    const xy  = <C>{ x, y }
    this.set(xy)
  }

  applyDamage (amount: number, type: keyof IDamage, source?: any) {
    const resistance = this.get('resistance')[type]
    const hp = this.get('health')
    this.set('health', hp - (amount - resistance))
  }

  hasStatusEffect (effect: StatusEffect.Effect): boolean {
    return this.get('statusEffects')
      .filter((status: StatusEffect.Effect) => {
        return status === effect
      })
      .length > 0
  }

  turnEnd () {
    if (this.get('health') <= 0 && this.map !== undefined) {
      this.map.removeCell(this)
    }
  }
}

module Creature {
  export enum MoveStatus {
    OK,
    OutOfBounds,
    Occupied,
    MissingContext
  }
}

export default Creature
