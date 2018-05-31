import Creature from './Creature'
import { Wander } from '../StatusEffects/Wander'
import { Burning } from '../StatusEffects/Burning'
import { Escaping } from '../StatusEffects/Escaping'

export default class Deer extends Creature {
  get defaults () {
    return Object.assign(super.defaults, {
      name: 'Deer',
      speed: 2,
      statusEffects: [new Wander()]
    })
  }

  applyDamage (amount: number, damageType: string, source?: any) {
    super.applyDamage(amount, damageType)
    if (damageType === 'fire' && !(source instanceof Burning)) {
      this.attachStatusEffect(new Burning(amount))
      this.detachStatusEffect(Wander)
      this.attachStatusEffect(new Escaping())
      this.set('speed', 1)
    }
  }
}
