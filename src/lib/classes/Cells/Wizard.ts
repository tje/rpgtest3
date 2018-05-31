import Creature from './Creature'
import Fireball from './Fireball'
import { TurnPhase } from '../../interfaces/ICell'
import { Wander } from '../StatusEffects/Wander'

export default class Wizard extends Creature {
  get defaults () {
    return Object.assign(super.defaults, {
      name: 'Wizard',
      speed: 2,
      statusEffects: [new Wander()]
    })
  }

  turnAction (tick: number) {
    if (this.map === undefined) {
      return
    }

    if (Math.random() > 0.5) {
      let trajectoryX = Math.round(Math.random() * 2) - 1
      let trajectoryY = 0
      if (Math.random() > 0.5) {
        trajectoryY = trajectoryX
        trajectoryX = 0
      }

      if (trajectoryX === 0 && trajectoryY === 0) {
        return
      }

      const x = this.get('x')
      const y = this.get('y')

      const fireball = new Fireball({
        x,
        y,
        trajectoryX,
        trajectoryY
      })
      this.map.addCell(fireball)
    }
  }
}
