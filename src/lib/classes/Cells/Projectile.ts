import Cell from './Cell'
import Creature from './Creature'
import { IProjectileData } from '../../interfaces/IProjectile'
// import { Wandering } from '../StatusEffects/StatusEffect'

export default class Projectile<C extends IProjectileData> extends Creature<C> {
  get defaults (): IProjectileData {
    return Object.assign(super.defaults, {
      name: 'Projectile',
      speed: 1,
      solid: false,
      statusEffects: [],
      trajectoryX: 0,
      trajectoryY: 0
    })
  }

  turnMove (tick: number) {
    if (this.map === undefined) {
      return
    }

    const x = this.get('trajectoryX')
    const y = this.get('trajectoryY')
    const canMove = this.canMove(x, y)
    switch (canMove) {
      case Creature.MoveStatus.OK:
        this.move(x, y)
        break
      default:
        this.map.removeCell(this)
        break
    }
  }
}
