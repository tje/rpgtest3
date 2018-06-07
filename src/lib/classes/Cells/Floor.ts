import Cell from './Cell'
import { IFloorData } from '../../interfaces/IFloor'

export default class Floor extends Cell<IFloorData> {
  get defaults (): IFloorData {
    return Object.assign(super.defaults, {
      name: 'Floor',
      priority: 0,
      x: 0,
      y: 0,
      speed: 0,
      altitude: 0,
      solid: false
    })
  }
}
