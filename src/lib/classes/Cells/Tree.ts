import Creature from './Creature'
import { Burning } from '../StatusEffects/Burning'
import { ICreatureData } from '../../interfaces/ICreature';
import { IDamage } from '../../interfaces/IDamage';

export default class Tree<C extends ICreatureData> extends Creature<C> {
  get defaults () {
    return Object.assign(super.defaults, {
      name: 'Tree'
    })
  }

  turnMove (tick: number) { }

  applyDamage (amount: number, damageType: keyof IDamage, source?: any) {
    super.applyDamage(amount, damageType)
    if (damageType === 'fire' && !(source instanceof Burning)) {
      this.attachStatusEffect(new Burning(amount))
    }
  }
}
