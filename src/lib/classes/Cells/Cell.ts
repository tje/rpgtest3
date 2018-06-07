import * as shortid from 'shortid'
import {
  ICell,
  ICellData,
  ICellProxyHandler,
  TurnPhase,
  TurnMethod
} from '../../interfaces/ICell'
import * as StatusEffect from '../StatusEffects/StatusEffect'
import Battlefield from '../Battlefield'

type CellAttributes<T extends ICellData> = {
  [P in keyof T]: T[P]
}

type CellChangeset = {
  attribute: string
  from: any
  to: any
}

export default abstract class Cell<C extends ICellData> implements ICell {
  id: string = shortid.generate()
  changes: CellChangeset[] = []
  protected attributes: C
  protected map?: Battlefield

  constructor (attributes: Partial<C> = {}) {
    const mergedDefaults = <C>Object.assign(this.defaults, attributes)
    this.attributes = <C>this.createProxy(mergedDefaults)
    this.initialize(mergedDefaults)
  }

  get defaults (): C | ICellData {
    return {
      name: '',
      priority: 0,
      x: 0,
      y: 0,
      speed: 0,
      altitude: 0,
      solid: false,
      statusEffects: []
    }
  }

  createProxy<C> (
    obj: C & ICellData,
    handler: ICellProxyHandler<C & ICellData> = {
      get: (target, property) => target[property],
      set: (target, property, value) => {
        target[property] = value
        return true
      }
    }
  ): C & ICellData {
    return new Proxy<C & ICellData>(obj, handler)
  }

  get <K extends keyof C>(prop: K) {
    return this.attributes[prop]
  }

  setMany <T extends Partial<C>> (props: T) {
    Object.keys(props).forEach(prop => {
      const propKey = <keyof C>prop
      this.attributes[propKey] = <C[keyof C]>props[propKey]
    })
  }

  set <K extends keyof C> (props: K, value: C[K]): void
  set (props: Partial<C>): void
  set (props: any, value?: any) {
    if (typeof props === 'object' && value === undefined) {
      Object.keys(props).forEach(prop => {
        const propKey = <keyof C>prop
        this.recordChange(propKey, props[propKey])
        this.attributes[propKey] = props[propKey]
      })
    } else {
      this.recordChange(<keyof C>props, value)
      this.attributes[<keyof C>props] = value
    }
  }

  bindMap (map: Battlefield) {
    this.map = map
  }

  private recordChange (propKey: keyof C, newValue: any) {
    const oldValue = this.get(propKey)
    if (oldValue !== newValue) {
      this.changes.slice().reverse()
        .filter(change => change.attribute === propKey)
        .slice(0, 1)
        .forEach((change, idx) => {
          // Mutual negation if we're reverting
          if (change.from === newValue) {
            console.log(`negate ${propKey} ${change.to} -> ${change.from}`)
            this.changes.splice(this.changes.indexOf(change), 1)
            return
          }
        })

      this.changes.push({
        attribute: propKey,
        from: oldValue,
        to: newValue
      })
    }
  }

  consumeChanges () {
    return this.changes.splice(0)
  }

  relativeToAbsolute (x: number, y: number): { x: number, y: number } {
    return {
      x: x + this.get('x'),
      y: y + this.get('y')
    }
  }

  iterateStatusEffects (phase: TurnPhase, fixture: StatusEffect.Fixture) {
    const effects = this.get('statusEffects')
    if (!Array.isArray(effects)) {
      return
    }

    effects.forEach(effect => {
      const fx = <StatusEffect.Effect>effect
      fx.run(phase, fixture, this)
    })
  }

  attachStatusEffect (effect: StatusEffect.Effect) {
    const effects = <StatusEffect.Effect[]>this.get('statusEffects')
    effects.push(effect)
    this.set('statusEffects', effects)
  }

  detachStatusEffect (effect: StatusEffect.Effect | typeof StatusEffect.Effect) {
    let effects = <StatusEffect.Effect[]>this.get('statusEffects')
    effects = effects.filter(f => {
      if (typeof effect === 'function') {
        return !(f instanceof effect)
      }
      return effect !== f
    })
    this.set('statusEffects', effects)
    // const idx = effects.indexOf(effect)
    // if (idx !== -1) {
    //   console.log(`remove ${this.get('name')}.${effect.name}`)
    //   effects.splice(idx, 1)
    //   this.set('statusEffects', effects)
    // }
  }

  remove () {
    if (this.map !== undefined) {
      this.map.removeCell(this)
    }
  }

  turn (phase: TurnPhase, tick: number): void {
    const fn = <TurnMethod>`turn${phase.substr(0, 1).toUpperCase()}${phase.substr(1)}`
    
    this.iterateStatusEffects(phase, StatusEffect.Fixture.Pre)
    this[fn](tick)
    this.iterateStatusEffects(phase, StatusEffect.Fixture.Post)
  }

  turnStart (tick: number): void {}
  turnMove (tick: number): void {}
  turnAction (tick: number): void {}
  turnEnd (tick: number): void {}

  resolveStatusEffects (): void {}
  resolveDamage (): void {}

  initialize (attributes: any): void {}
}
