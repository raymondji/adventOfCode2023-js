import { readFileSync } from 'fs';

export {
  pt1,
  pt2,
  tests,
}

const DEBUG = false;
function debugLog(...args: any[]) {
  if (DEBUG) console.log(...args);
}

function pt1(input: string) {
  const data = readFileSync(input, 'utf8');
  const grid: number[][] = data.split('\n')
    .map(l => l.split("").map(c => parseInt(c)));
  printGrid("original", grid);

  const start: Node = {
    coord: [0, 0],
    movesStraight: 0,
    straight: E,
    heatLoss: 0,
  };
  const unvisited: Node[] = [];
  unvisited.push(start);
  for (let movesStraight = 1; movesStraight <= 3; movesStraight++) {
    for (const straight of [N, E, S, W]) {
      for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
          unvisited.push({
            coord: [r, c],
            movesStraight,
            straight,
            heatLoss: Infinity,
          })
        }
      }
    }
  }
  const nodes = new Map<string, Node>();
  for (const c of unvisited) {
    nodes.set(toResultsKey(c.coord, c.movesStraight, c.straight), c);
  }

  while (unvisited.length > 0) {
    if (unvisited.length % 1000 === 0) {
      console.log("---unvisited left", unvisited.length);
      console.timeEnd("visited");
      console.time("visited");
    }
    
    const minIndex = getMinIndex(unvisited);
    const curr = unvisited[minIndex];
    unvisited.splice(minIndex, 1);

    debugLog("curr", curr.coord, "moves", curr.movesStraight, "straight", curr.straight);
    const rightDir = rotateRight(curr.straight);
    const leftDir = rotateLeft(curr.straight);
    const neighbourKeys: string[] = [
      toResultsKey(
        add(curr.coord, curr.straight), curr.movesStraight+1, curr.straight),
      toResultsKey( 
        add(curr.coord, rightDir), 1, rightDir),
      toResultsKey(
        add(curr.coord, leftDir), 1, leftDir),
    ];
    const neighbours = neighbourKeys
      .map(k => nodes.get(k))
      .filter((n): n is Node => n !== undefined);
    debugLog("neighbours", neighbours.length);
    for (let i =0; i < neighbours.length; i++) {
      const neighbour = neighbours[i];
      const tile = at(grid, neighbour.coord);
      if (tile === undefined) throw new Error("WTF");
      const newPathLoss = curr.heatLoss + tile;
      if (newPathLoss < neighbour.heatLoss) {
        debugLog("got cheaper path to", neighbour.coord, tile, "old heatloss", neighbour.heatLoss, "new heatloss", newPathLoss, "from", curr.coord);
        neighbour.heatLoss = newPathLoss;
        neighbour.prev = curr;
      } else {
        debugLog("got more expensive path to", neighbour.coord, tile, "old heatloss", neighbour.heatLoss, "new heatloss", newPathLoss, "from", curr.coord);
      }
    }
  }

  let minEnd: Node|undefined;
  for (const [_, node] of nodes) {
    if (!equal(node.coord, [grid.length-1, grid[0].length-1])) {
      continue;
    }
    if (minEnd === undefined || node.heatLoss < minEnd.heatLoss) {
      minEnd = node;
    }
  }
  if (minEnd === undefined) throw new Error("WTF");
  drawPath("min path", minEnd, grid);
  console.log(minEnd.heatLoss);
}

function drawPath(name: string, end: Node, grid: number[][]) {
  let path: Node[] = [];
  let curr: Node|undefined = end;
  while (curr !== undefined) {
    path.push(curr);
    curr = curr.prev;
  }
  const g2 = JSON.parse(JSON.stringify(grid));
  for (let i = 0; i<path.length; i++) {
    const c = path[i];
    set(g2, c.coord, toStringDir(c.straight));
  }
  printGrid(name, g2);
}

function toStringDir(t: Tuple): string {
  if (equal(t, E)) {
    return ">";
  }
  if (equal(t, N)) {
    return "^";
  }
  if (equal(t, W)) {
    return "<";
  }
  if (equal(t, S)) {
    return "V";
  }
  return "X";
}

function getMinIndex(nodes: Node[]): number {
  let min = Infinity;
  let minI = 0;
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].heatLoss < min) {
      min = nodes[i].heatLoss;
      minI = i;
    }
  }

  return minI;
}

function rotateLeft(t: Tuple): Tuple {
  if (equal(t, N)) {
    return W;
  }
  if (equal(t, W)) {
    return S;
  }
  if (equal(t, S)) {
    return E;
  }
  if (equal(t, E)) {
    return N;
  }
  throw new Error("WTF");
}

function rotateRight(t: Tuple): Tuple {
  if (equal(t, N)) {
    return E;
  }
  if (equal(t, E)) {
    return S;
  }
  if (equal(t, S)) {
    return W;
  }
  if (equal(t, W)) {
    return N;
  }
  throw new Error("WTF");
}

type Tuple = [number, number];
function equal(a: Tuple, b: Tuple): boolean {
  return a[0] === b[0] && a[1] === b[1];
}
function diff(a: Tuple, b: Tuple): Tuple {
  return [a[0] - b[0], a[1] - b[1]];
}
function add(c: Tuple, v: Tuple): Tuple {
  return [c[0] + v[0], c[1] + v[1]];
}
function toString(t: Tuple): string {
  return `${t[0]},${t[1]}`;
}
const N: Tuple = [-1, 0];
const S: Tuple = [1, 0];
const W: Tuple = [0, -1];
const E: Tuple = [0, 1];

function at(grid: number[][], c: Tuple): number|undefined {
  const row = grid[c[0]];
  return row === undefined ? undefined : row[c[1]];
}

function set(grid: string[][], c: Tuple, v: string) {
  grid[c[0]][c[1]] = v;
}

type Node = {
  coord: Tuple,
  movesStraight: number,
  straight: Tuple,
  heatLoss: number,
  prev?: Node,
}
function toResultsKey(coord: Tuple, movesStraight: number, straight: Tuple): string {
  return `${toString(coord)}--${movesStraight}--${toString(straight)}}`;
}

function pt2(input: string) {
  const data = readFileSync(input, 'utf8');
  const grid: number[][] = data.split('\n')
    .map(l => l.split("").map(c => parseInt(c)));

  const start: Node = {
    coord: [0, 0],
    movesStraight: 0,
    straight: E,
    heatLoss: 0,
  };
  const unvisited: Node[] = [];
  unvisited.push(start);
  for (let movesStraight = 1; movesStraight <= 10; movesStraight++) {
    for (const straight of [N, E, S, W]) {
      for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
          unvisited.push({
            coord: [r, c],
            movesStraight,
            straight,
            heatLoss: Infinity,
          })
        }
      }
    }
  }
  const nodes = new Map<string, Node>();
  for (const c of unvisited) {
    nodes.set(toResultsKey(c.coord, c.movesStraight, c.straight), c);
  }

  while (unvisited.length > 0) {
    if (unvisited.length % 1000 === 0) {
      console.log("---unvisited left", unvisited.length);
      console.timeEnd("visited");
      console.time("visited");
    }
    
    const minIndex = getMinIndex(unvisited);
    const curr = unvisited[minIndex];
    unvisited.splice(minIndex, 1);

    debugLog("curr", curr.coord, "moves", curr.movesStraight, "straight", curr.straight);
    const rightDir = rotateRight(curr.straight);
    const leftDir = rotateLeft(curr.straight);
    const neighbourKeys: string[] = [
      toResultsKey(
        add(curr.coord, curr.straight), curr.movesStraight+1, curr.straight),
    ];
    if (curr.movesStraight >= 4) {
      neighbourKeys.push(
        toResultsKey( 
          add(curr.coord, rightDir), 1, rightDir),
        toResultsKey(
          add(curr.coord, leftDir), 1, leftDir),
      );
    }

    const neighbours = neighbourKeys
      .map(k => nodes.get(k))
      .filter((n): n is Node => n !== undefined);
    debugLog("neighbours", neighbours.length);
    for (let i =0; i < neighbours.length; i++) {
      const neighbour = neighbours[i];
      const tile = at(grid, neighbour.coord);
      if (tile === undefined) throw new Error("WTF");
      const newPathLoss = curr.heatLoss + tile;
      if (newPathLoss < neighbour.heatLoss) {
        debugLog("got cheaper path to", neighbour.coord, tile, "old heatloss", neighbour.heatLoss, "new heatloss", newPathLoss, "from", curr.coord);
        neighbour.heatLoss = newPathLoss;
        neighbour.prev = curr;
      } else {
        debugLog("got more expensive path to", neighbour.coord, tile, "old heatloss", neighbour.heatLoss, "new heatloss", newPathLoss, "from", curr.coord);
      }
    }
  }

  let minEnd: Node|undefined;
  for (const [_, node] of nodes) {
    if (!equal(node.coord, [grid.length-1, grid[0].length-1]) || node.movesStraight < 4) {
      continue;
    }
    if (minEnd === undefined || node.heatLoss < minEnd.heatLoss) {
      minEnd = node;
    }
  }
  if (minEnd === undefined) throw new Error("WTF");
  drawPath("min path", minEnd, grid);
  console.log(minEnd.heatLoss);
}

function tests() {}


function printGrid(name: string, grid: number[][]) {
  console.log(`----- ${name} -----`);
    const str = grid.map(r => r.map(c => {
      return c.toString().padEnd(2);
    }).join("")).join("\n");
    console.log(str);
}
