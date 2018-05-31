import * as shortid from 'shortid'
import {
  ICell,
  ICellData,
  ICellProxyHandler,
  TurnPhase
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
  protected attributes: CellAttributes<C & ICellData>
  protected map?: Battlefield

  constructor (attributes?: Partial<CellAttributes<C>>) {
    const mergedDefaults = Object.assign(this.defaults, attributes || {})
    this.attributes = <CellAttributes<C>>this.createProxy(<C>mergedDefaults)
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

  createProxy<T extends ICellData> (
    obj: T,
    handler: ICellProxyHandler<T> = {
      get: (target, property) => target[property],
      set: (target, property, value) => {
        target[property] = value
        return true
      }
    }
  ): T & ICellData {
    return new Proxy<T & ICellData>(obj, handler)
  }

  get (prop: keyof C) {
    return this.attributes[prop]
  }

  setMany (props: Partial<CellAttributes<C>>) {
    Object.keys(props).forEach(prop => {
      this.attributes[<keyof C>prop] = props[<keyof C>prop]
    })
  }

  set (props: keyof C | Partial<CellAttributes<C>>, value?: any) {
    if (typeof props === 'object' && value === undefined) {
      const partialProps = <Partial<CellAttributes<C>>>props
      Object.keys(props).forEach(prop => {
        const propKey = <keyof C>prop
        this.recordChange(propKey, partialProps[propKey])
        this.attributes[propKey] = partialProps[propKey]
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

  detachStatusEffect (effect: StatusEffect.Effect) {
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
    const fn = `turn${phase.substr(0, 1).toUpperCase()}${phase.substr(1)}`
    
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
