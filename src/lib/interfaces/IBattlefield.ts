export default interface IBattlefield {
  width: number
  height: number
  tick: number

  generate: () => void
}
