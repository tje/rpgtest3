import Creature from './Creature'
import { Burning } from '../StatusEffects/Burning'

export default class Tree extends Creature {
  get defaults () {
    return Object.assign(super.defaults, {
      name: 'Tree'
    })
  }

  turnMove (tick: number) { }

  applyDamage (amount: number, damageType: string, source?: any) {
    super.applyDamage(amount, damageType)
    if (damageType === 'fire' && !(source instanceof Burning)) {
      this.attachStatusEffect(new Burning(amount))
    }
  }
}
