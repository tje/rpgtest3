import Creature from './Creature'
import { ICreatureData } from '../../interfaces/ICreature'
import { IDamage } from '../../interfaces/IDamage'
import { Wander } from '../StatusEffects/Wander'
import { Burning } from '../StatusEffects/Burning'
import { Escaping } from '../StatusEffects/Escaping'

export default class Deer<C extends ICreatureData> extends Creature<C> {
  get defaults () {
    return Object.assign(super.defaults, {
      name: 'Deer',
      speed: 2,
      statusEffects: [new Wander()]
    })
  }

  applyDamage (amount: number, damageType: keyof IDamage, source?: any) {
    super.applyDamage(amount, damageType)
    if (damageType === 'fire' && !(source instanceof Burning)) {
      this.attachStatusEffect(new Burning(amount))
      this.detachStatusEffect(Wander)
      this.attachStatusEffect(new Escaping())
      this.set('speed', 1)
    }
  }
}
