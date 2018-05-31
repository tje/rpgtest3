import Battlefield from './lib/classes/Battlefield'
import Tree from './lib/classes/Cells/Tree'
import Deer from './lib/classes/Cells/Deer'
import Wizard from './lib/classes/Cells/Wizard'

const tiles = new Map()
const $map = document.getElementById('map')

const columns = 10
const rows = 10
const tileSize = 50

const numTrees = Math.floor(columns * rows * 0.2)
const numDeer = 5

const fps = 4

const map = new Battlefield(columns, rows)
map.on('cell:add', cell => {
  console.log('add:', cell.id)
  const $el = createTile(cell)
  tiles.set(cell.id, $el)
  updateTile(cell)
  $map.appendChild($el)
})
map.on('cell:update', cell => {
  updateTile(cell)
})
map.on('cell:remove', cell => {
  const $el = tiles.get(cell.id)
  console.log('kill', cell.id)
  tiles.delete(cell.id)
  $el.remove()
})
map.generate()

for (let i = 0; i < numTrees; i++) {
  let tree = new Tree()
  map.addCellRandom(tree)
}
for (let i = 0; i < numDeer; i++) {
  let deer = new Deer()
  map.addCellRandom(deer)
}
const wizard = window.wizard = new Wizard()
map.addCellRandom(wizard)

setInterval(() => map.update(), (1 / fps) * 1000)

function createTile (cell) {
  const $el = document.createElement('div')
  return $el
}

function updateTile (cell) {
  const $el = tiles.get(cell.id)
  if ($el === undefined) {
    return
  }

  const classes = ['tile', cell.constructor.name, cell.get('name')]
  classes.push(...cell.get('statusEffects').map(effect => effect.name))
  $el.classList.add(...classes)
  $el.classList.forEach(elClass => {
    if (classes.indexOf(elClass) === -1) {
      $el.classList.remove(elClass)
    }
  })
  
  // Size and positioning
  $el.style.left = '0px' //(tileSize * cell.get('x')) + 'px'
  $el.style.top = '0px' //(tileSize * cell.get('y')) + 'px'
  $el.style.width =  tileSize + 'px'
  $el.style.height = tileSize + 'px'
  $el.style.transform = `translate(${cell.get('x') * 100}%, ${cell.get('y') * 100}%)`
  $el.style.zIndex = cell.get('altitude') + 1

  $el.style.transitionDuration = `${cell.get('speed') * ((1 / fps) * 1000)}ms`
}
