import Creature from '../Cells/Creature'
// import { ICellData } from '../../interfaces/ICell'
// import { ICell } from '../../interfaces/ICell'

export default abstract class Wander extends Creature {
  turnMove (tick: number) {
    if (tick % this.get('speed') !== 0) {
      return
    }

    let x = Math.round(Math.random() * 2) - 1
    let y = 0
    if (Math.random() > 0.5) {
      y = x
      x = 0
    }
    this.move(x, y)
  }
}
