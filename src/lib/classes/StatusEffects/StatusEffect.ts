import Cell from '../Cells/Cell'
import Creature from '../Cells/Creature'
import { TurnPhase } from '../../interfaces/ICell'

export const enum Fixture {
  Pre,
  Post
}

export class Effect {
  readonly name: string = 'Effect'
  readonly delay: number = 0
  readonly duration: number = Infinity
  readonly iterations: number = Infinity
  readonly phase: TurnPhase = TurnPhase.Start
  readonly fixture: Fixture = Fixture.Pre

  active: boolean = true
  elapsed: number = 0
  iteration: number = 0

  public run (phase: TurnPhase, fixture: Fixture, cell: Cell<any>) {
    if (this.active === true && this.validateStage(phase, fixture)) {
      this.elapsed += 1
      const result = this.resolve(cell)
      if (result === true) {
        this.iteration += 1
      }
    }

    this.cleanUp(cell)
  }

  protected validateStage (phase: TurnPhase, fixture: Fixture): boolean {
    return (
      phase === this.phase
      && fixture === this.fixture
    )
  }

  private cleanUp (cell: Cell<any>) {
    const timeEnded = this.elapsed > this.delay + this.duration
    const iterationsComplete = this.iteration >= this.iterations
    if (this.active === false || timeEnded || iterationsComplete) {
      this.active = false
      cell.detachStatusEffect(this)
    }
  }

  protected resolve (cell: Cell<any>): boolean {
    return true
  }
}
