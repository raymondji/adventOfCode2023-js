import { readFileSync } from 'fs';

const DEBUG = false;
const file = "inputs/day10.txt";

export {
  pt1,
  pt2,
}

function pt1() {
  const data = readFileSync(file, 'utf8');
  const lines = data.split('\n');
  const grid: string[][] = lines.map(l => l.split(""));

  let start: Coord = [0, 0];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === "S") {
        start = [y, x];
      }
    }
  }

  const candidates = [
    completePath([start, add(start, up)], JSON.parse(JSON.stringify(grid))),
    completePath([start, add(start, down)], JSON.parse(JSON.stringify(grid))),
    completePath([start, add(start, left)], JSON.parse(JSON.stringify(grid))),
    completePath([start, add(start, right)], JSON.parse(JSON.stringify(grid))),
  ];
  const result = candidates.filter(c => c !== undefined)[0];
  if (result === undefined) {
    console.error("failed");
    return;
  }
  debugLog(result);
  console.log((result[1].length - 1) / 2);
}

type Coord = [number, number];
function equal(a: Coord, b: Coord): boolean {
  return a[0] === b[0] && a[1] === b[1];
}
function diff(a: Coord, b: Coord): Coord {
  return [a[0] - b[0], a[1] - b[1]];
}
function add(c: Coord, v: Coord): Coord {
  return [c[0] + v[0], c[1] + v[1]];
}
function isTile(c: Coord): boolean {
  return (c[0] % 1) === 0 && (c[1] % 1) === 0;
}

const up: Coord = [-1, 0];
const down: Coord = [1, 0];
const left: Coord = [0, -1];
const right: Coord = [0, 1];
const upRight: Coord = [-0.5, 0.5];
const upLeft: Coord = [-0.5, -0.5];
const downRight: Coord = [0.5, 0.5];
const downLeft: Coord = [0.5, -0.5];

function at(grid: string[][], c: Coord): string {
  if (!isTile(c)) {
    throw new Error(`at called with non-tile coord: ${c}`);
  }
  return grid[c[0]][c[1]];
}
function set(grid: string[][], c: Coord, v: string) {
  if (!isTile(c)) {
    throw new Error(`set called with non-tile coord: ${c}`);
  }
  grid[c[0]][c[1]] = v;
}

function debugLog(...args: any[]) {
  if (DEBUG) console.log(...args);
}

// completePath returns the completed path [pathSoFar..., ..., end]
// if there is one, or undefined if there is no such path.
function completePath(
  pathSoFar: Coord[], grid: string[][],
): [string[][], Coord[]] | undefined {
  while (true) {
    const curr = pathSoFar[pathSoFar.length - 1];
    const prev = pathSoFar[pathSoFar.length - 2];
    const prevMove = diff(curr, prev);
    if (curr[0] < 0 || curr[0] >= grid.length || curr[1] < 0 || curr[1] >= grid[0].length) {
      return undefined;
    }
    const currTile = at(grid, curr);

    switch (currTile) {
      case ".":
        return undefined;
      case "S":
        return [grid, pathSoFar];
      case "|":
        if (equal(prevMove, up) || equal(prevMove, down)) {
          pathSoFar.push(add(curr, prevMove));
          break;
        } else {
          return undefined;
        }
      case "-":
        if (equal(prevMove, left) || equal(prevMove, right)) {
          pathSoFar.push(add(curr, prevMove));
          break;
        } else {
          return undefined;
        }
      case "L":
        if (equal(prevMove, left)) {
          pathSoFar.push(add(curr, up));
          break;
        } else if (equal(prevMove, down)) {
          pathSoFar.push(add(curr, right));
          break;
        } else {
          return undefined;
        }
      case "J":
        if (equal(prevMove, right)) {
          pathSoFar.push(add(curr, up));
          break;
        } else if (equal(prevMove, down)) {
          pathSoFar.push(add(curr, left));
          break;
        } else {
          return undefined;
        }
      case "7":
        if (equal(prevMove, up)) {
          pathSoFar.push(add(curr, left));
          break;
        } else if (equal(prevMove, right)) {
          pathSoFar.push(add(curr, down));
          break;
        } else {
          return undefined;
        }
      case "F":
        if (equal(prevMove, up)) {
          pathSoFar.push(add(curr, right));
          break;
        } else if (equal(prevMove, left)) {
          pathSoFar.push(add(curr, down));
          break;
        } else {
          return undefined;
        }
      default:
        console.log("unknown tile", currTile);
        debugPath(pathSoFar, grid);
        console.log(grid);
        throw new Error("unexpected tile");
    }
  }
}

function debugPath(path: Coord[], grid: string[][]) {
  if (path.length === 0) {
    console.log("empty path");
    return;
  }
  console.log("started at", grid[path[0][0]][path[0][1]]);
  for (let i = 1; i < path.length; i++) {
    const move = diff(path[i], path[i - 1]);
    console.log(grid[path[i][0]][path[i][1]]);
  }
}

function pt2() {
  const data = readFileSync(file, 'utf8');
  const lines = data.split('\n');
  const grid: string[][] = lines.map(l => l.split(""));

  let start: Coord = [0, 0];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === "S") {
        start = [y, x];
      }
    }
  }

  const candidates = [
    completePath([start, add(start, up)], JSON.parse(JSON.stringify(grid))),
    completePath([start, add(start, down)], JSON.parse(JSON.stringify(grid))),
    completePath([start, add(start, left)], JSON.parse(JSON.stringify(grid))),
    completePath([start, add(start, right)], JSON.parse(JSON.stringify(grid))),
  ];
  const result = candidates.filter(c => c !== undefined)[0];
  if (result === undefined) {
    console.error("failed");
    return;
  }

  const area = findEnclosedArea(result[0], result[1]);
  console.log("area", area);
}

// lastIndexOf returns -1 if not found
function lastIndexOf(c: Coord, path: Coord[]): number {
  for (let i = path.length-1; i >= 0; i--) {
    if (equal(path[i], c)) {
      return i;
    }
  }
  return -1;
}

function findEnclosedArea(grid: string[][], enclosure: Coord[]): number {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      const pathI = lastIndexOf([y, x], enclosure);
      if (pathI === -1) {
        set(grid, [y, x], ".");
      } else {
        set(grid, [y,x], pathI);
      }
    }
  }
  debugLog("---- starting grid");
  printGrid(grid, 3);

  outer: for (let y = 0; y < grid.length; y++) {
    console.log("---- starting search for y", y);
    for (let x = 0; x < grid[0].length; x++) {
      const found = search([y, x], grid, enclosure);
      debugLog("grid after searching");
      printGrid(grid, 3);
      if (found) {
        break outer;
      }
    }
  }
  let count = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (at(grid, [y, x]) === "I") {
        count++;
      }
    }
  }
  return count;
}

let iters = 0;
function search(start: Coord, grid: string[][], enclosure: Coord[]): boolean {
  const stack: Coord[] = [];
  stack.push(start);
  let reachedOutside = false;
  const visitedVertices = new Map<string, boolean>();
  while (stack.length > 0) {
    iters++;
    if (stack.length < 5) {
      debugLog("stack", stack)
    }
    const curr = stack.pop();
    if (isTile(curr)) {
      // debugLog("curr tile", curr);
      if (curr[0] < 0 || curr[0] >= grid.length || curr[1] < 0 || curr[1] >= grid[0].length) {
        reachedOutside = true;
        // debugLog("reached outside");
        continue;
      }
      const currTile = at(grid, curr);
      if (currTile === "O") {
        reachedOutside = true;
        // debugLog("reached outside from previously visited tile");
        continue;
      }
      if (currTile !== ".") {
        // debugLog("not .");
        continue;
      }
      set(grid, curr, "U");

      // move onto another tile
      stack.push(add(curr, up));
      stack.push(add(curr, right));
      stack.push(add(curr, down));
      stack.push(add(curr, left));

      // move onto a vertex
      stack.push(add(curr, upLeft));
      stack.push(add(curr, upRight));
      stack.push(add(curr, downLeft));
      stack.push(add(curr, downRight));
    } else {
      // debugLog("curr vertex", curr);
      if (curr[0] < 0 || curr[0] > (grid.length-1) || curr[1] < 0 || curr[1] > (grid[0].length-1)) {
        reachedOutside = true;
        // debugLog("reached outside");
        continue;
      }
      if (visitedVertices.has(curr.toString())) {
        // debugLog("already visited");
        continue;
      }
      visitedVertices.set(curr.toString(), true);
      
      // we are on a vertex, e.g. [-0.5, -0.5]
      // we can always move back down from a vertex to its adjacent tiles
      stack.push(add(curr, upRight));
      stack.push(add(curr, downRight));
      stack.push(add(curr, downLeft));
      stack.push(add(curr, upLeft));
      
      // we have to check if we can move to a neighboring vertex
      if (canMoveVertexToVertex(curr, up, grid, enclosure)) {
        stack.push(add(curr, up));
      }
      if (canMoveVertexToVertex(curr, down, grid, enclosure)) {
        stack.push(add(curr, down));
      }
      if (canMoveVertexToVertex(curr, left, grid, enclosure)) {
        stack.push(add(curr, left));
      }
      if (canMoveVertexToVertex(curr, right, grid, enclosure)) {
        stack.push(add(curr, right));
      }
    }
  }

  let found = false;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      const currTile = at(grid, [y, x]);
      if (currTile === "U" && reachedOutside) {
        set(grid, [y, x], "O");
      } else if (currTile === "U") {
        set(grid, [y, x], "I");
        found = true;
      }
    }
  }
  return found;
}

function canMoveVertexToVertex(
  from: Coord, move: Coord, grid: string[][], enclosure: Coord[],
): boolean {
  // e.g.
  // from: [1.5, 0.5]
  // move: up = [-1, 0]
  // to: [0.5, 0.5]
  // passing through: [1, 0] and [1, 1]
  const passThroughTiles = [];
  if (equal(move, up)) {
    passThroughTiles.push(
      add(from, upLeft), add(from, upRight));
  } else if (equal(move, down)) {
    passThroughTiles.push(
      add(from, downLeft), add(from, downRight));
  }  else if (equal(move, left)) {
    passThroughTiles.push(
      add(from, upLeft), add(from, downLeft));
  } else if (equal(move, right)) {
    passThroughTiles.push(
      add(from, upRight), add(from, downRight));
  } else {
    throw new Error(`wtf ${move}`);
  }
  let tile0 = at(grid, passThroughTiles[0]);
  let tile1 = at(grid, passThroughTiles[1]);
  if (Math.abs(tile0-tile1) === 1) {
    return false; // consecutive
  }
  // The start tile is labeled e.g. 44, but should also be connected to the
  // tile labeled 1.
  tile0 = tile0 % (enclosure.length-1);
  tile1 = tile1 % (enclosure.length-1);
  if (Math.abs(tile0-tile1) === 1) {
    return false;
  }
  return true;
}

function printGrid(grid: string[][], padding: number) {
  const str = grid.map(r => r.map(c => {
    return c.toString().padEnd(padding);
  }).join("")).join("\n");
  debugLog(str);
}