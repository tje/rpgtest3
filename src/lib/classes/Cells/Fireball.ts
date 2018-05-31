import Projectile from './Projectile'
import Creature from './Creature'
import { Damage } from '../StatusEffects/Damage'

export default class Fireball extends Projectile {
  get defaults () {
    return Object.assign(super.defaults, {
      name: 'Fireball',
      speed: 1,
      solid: false,
      statusEffects: [],
      health: 25,
      resistance: {
        fire: 999,
        cold: -5,
        physical: 5,
        poison: 999
      },
      trajectoryX: 0,
      trajectoryY: 0
    })
  }

  canMove (x: number, y: number, relative: boolean = true) {
    let canMove = super.canMove(x, y, relative)
    if (canMove === Projectile.MoveStatus.Occupied) {
      canMove = Projectile.MoveStatus.OK
    }
    return canMove
  }

  turnAction () {
    if (this.map === undefined) {
      return
    }

    const victims = this.map.getCells({
      x: this.get('x'),
      y: this.get('y'),
      altitude: this.get('altitude')
    })

    victims.forEach(victim => {
      if (victim instanceof Creature && victim !== this) {
        const damage = new Damage(5, 'fire')
        victim.attachStatusEffect(damage)
      }
    })
  }
}
