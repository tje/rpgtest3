import Projectile from './Projectile'
import Creature from './Creature'
import { Damage } from '../StatusEffects/Damage'
import { TurnPhase } from '../../interfaces/ICell'
import * as _ from 'lodash'

export default class Train extends Projectile {
  get defaults () {
    return Object.assign(super.defaults, {
      name: 'Train',
      speed: 2,
      solid: true,
      statusEffects: [],
      health: 25,
      resistance: {
        fire: 0,
        cold: 0,
        physical: 0,
        poison: 0
      },
      trajectoryX: 0,
      trajectoryY: 0,
      links: 0,
      link: null,
      linked: false
    })
  }

  initialize (attributes: any) {
    if (this.get('links') > 0) {
      const childAttributes = _.cloneDeep(attributes)
      childAttributes.links -= 1
      childAttributes.link = null
      childAttributes.trajectoryX = 0
      childAttributes.trajectoryY = 0
      childAttributes.linked = true
      const link = new Train(childAttributes)
      this.set('link', link)
    }
  }

  zcanMove (x: number, y: number, relative: boolean = true) {
    let canMove = super.canMove(x, y, relative)
    if (canMove === Projectile.MoveStatus.Occupied) {
      canMove = Projectile.MoveStatus.OK
    }
    return canMove
  }

  move (x: number, y: number, relative: boolean = true) {
    const link = this.get('link')
    if (link && this.map !== undefined) {
      link.move(this.get('x'), this.get('y'), false)
    }
    super.move(x, y, relative)
  }

  turnMove (tick: number) {
    if (tick % this.get('speed') !== 0) {
      return
    }
    if (this.map === undefined || this.get('linked') === true) {
      return
    }

    let x = this.get('trajectoryX')
    let y = this.get('trajectoryY')

    if (Math.random() > 0.5) {
      do {
        const r = Math.random()
        if (r > 0.75) {
          x += 1
        } else if (r > 0.5) {
          x -= 1
        } else if (r > 0.25) {
          y += 1
        } else {
          y -= 1
        }
      } while (x === 0 && y === 0)

      x = Math.max(-1, Math.min(1, x))
      y = Math.max(-1, Math.min(1, y))

      this.set('trajectoryX', x)
      this.set('trajectoryY', y)
    }

    const canMove = this.canMove(x, y)
    switch (canMove) {
      case Creature.MoveStatus.OK:
        this.move(x, y)
        break
      case Creature.MoveStatus.OutOfBounds:
        this.map.removeCell(this)
        let link = this.get('link')
        if (link) {
          link.set('trajectoryX', x)
          link.set('trajectoryY', y)
          link.set('linked', false)
          link.turn(TurnPhase.Move, tick)
        }
        break
    }
  }

  zturnAction () {
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
        const damage = new Damage(10)
        victim.attachStatusEffect(damage)
      }
    })
  }
}
