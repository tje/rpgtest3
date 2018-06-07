import Floor from './Cells/Floor'
import Cell from './Cells/Cell'
import { TurnPhase } from '../interfaces/ICell'
import IBattlefield from '../interfaces/IBattlefield'
import * as EventEmitter from 'events'
import * as _ from 'lodash'

type ValidCell = Cell<any>

export default class Battlefield extends EventEmitter implements IBattlefield {
  tick: number = 0
  protected cells: Set<ValidCell> = new Set()

  constructor (readonly width = 8, readonly height = 5) {
    super()
  }

  generate () {
    this.cells.clear()
    
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        const cell = new Floor({ x, y })
        this.addCell(cell)
      }
    }
  }

  getCells (criteria: any = {}): ValidCell[] {
    return _.filter(Array.from(this.cells), cell => {
      for (const prop of Object.keys(criteria)) {
        if (cell.get(prop) !== criteria[prop]) {
          return false
        }
      }
      return true
    })
  }

  addCell (cell: ValidCell) {
    if (!this.cells.has(cell)) {
      cell.bindMap(this)
      this.cells.add(cell)
      this.emit('cell:add', cell)
    }
  }

  addCellRandom (cell: ValidCell): boolean {
    const occupied: string[] = []
    this.getCells({
      altitude: cell.get('altitude'),
      solid: true // @todo only if `cell` is solid too?
    }).forEach(occupant => {
      occupied.push(`${occupant.get('x')}x${occupant.get('y')}`)
    })

    const openCells = this.getCells({ altitude: 0 })
      .filter(floor => {
        const coords = `${floor.get('x')}x${floor.get('y')}`
        return occupied.indexOf(coords) === -1
      })

    const targetCell = _.sample(openCells)
    if (targetCell === undefined) {
      return false
    }

    cell.set({
      x: targetCell.get('x'),
      y: targetCell.get('y')
    })
    this.addCell(cell)
    return true
  }

  removeCell (cell: ValidCell) {
    if (this.cells.has(cell)) {
      this.cells.delete(cell)
      this.emit('cell:remove', cell)
    }
  }

  getPrioritizedCells (): ValidCell[] {
    return _.sortBy(
      Array.from(this.cells),
      cell => <number>cell.get('priority')
    ).reverse()
  }

  update () {
    const cells = this.getPrioritizedCells()
    this.tick += 1

    cells.forEach(cell => cell.turn(TurnPhase.Start, this.tick))
    cells.forEach(cell => cell.turn(TurnPhase.Move, this.tick))
    cells.forEach(cell => cell.turn(TurnPhase.Action, this.tick))
    cells.forEach(cell => cell.turn(TurnPhase.End, this.tick))
    cells.forEach(cell => {
      const changes = cell.consumeChanges()
      if (changes.length > 0) {
        this.emit('cell:update', cell, changes)
      }
    })
    this.emit('tick', this.tick)
  }

  draw (): ValidCell[][][] {
    const grid: ValidCell[][][] = []
    for (let y = 0; y < this.height; y += 1) {
      grid.push(Array(this.width).fill(null).map(c => []))
    }
    this.cells.forEach(cell => {
      const x = cell.get('x')
      const y = cell.get('y')
      let pos = grid[y][x]
      pos.push(cell)
      // console.log(`add ${cell.id} to ${x},${y} (has ${pos.length})`)
    })
    return grid
  }
}
