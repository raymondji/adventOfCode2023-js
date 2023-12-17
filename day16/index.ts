import { readFileSync } from 'fs';

export {
  pt1,
  pt2,
  tests,
}

function pt1(input: string) {
  const data = readFileSync(input, 'utf8');
  const grid: string[][] = data.split('\n').map(l => l.split(""));
  const energized = JSON.parse(JSON.stringify(grid));

  const beams: Beam[] = [
    {
      coord: [0, 0],
      dir: "e",
    }
  ];
  const seen = new Set<string>(); // keys are cache keys
  while (beams.length > 0) {
    const b = beams.pop()!;
    const cacheKey = getCacheKey(b);
    if (seen.has(cacheKey)) {
      continue;
    }
    seen.add(cacheKey);
    const tile = at(grid, b.coord);
    if (tile === undefined) {
      console.log("beam done");
      continue; // this beam disappears
    }
    set(energized, b.coord, "#");

    if (tile === "/") {
      switch (b.dir) {
        case "n":
          b.dir = "e";
          break;
        case "e":
          b.dir = "n";
          break;
        case "s":
          b.dir = "w";
          break;
        case "w":
          b.dir = "s";
          break;
      }
    } else if (tile === "\\") {
      switch (b.dir) {
        case "n":
          b.dir = "w";
          break;
        case "e":
          b.dir = "s";
          break;
        case "s":
          b.dir = "e";
          break;
        case "w":
          b.dir = "n"
          break;;
      }
    } else if (tile === "-") {
      if (b.dir === "n" || b.dir === "s") {
        b.dir = "w";
        beams.push({ coord: b.coord, dir: "e" });
      }
    } else if (tile === "|") {
      if (b.dir === "e" || b.dir === "w") {
        b.dir = "n";
        beams.push({ coord: b.coord, dir: "s" });
      }
    }
    b.coord = add(b.coord, getDir(b));
    beams.push(b);
  }

  let sum = 0;
  for (let r =0; r<energized.length; r++) {
    for (let c =0; c < energized[0].length; c++) {
      if (energized[r][c] === "#") {
        sum++;
      }
    }
  }
  console.log(sum);
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

function at(grid: string[][], c: Tuple): string|undefined {
  const row = grid[c[0]];
  return row === undefined ? undefined : row[c[1]];
}

function set(grid: string[][], c: Tuple, v: string) {
  grid[c[0]][c[1]] = v;
}

type Beam = {
  coord: Tuple,
  dir: "n"|"e"|"s"|"w";
}

function getDir(b: Beam): Tuple {
  switch (b.dir) {
    case "n":
      return N;
    case "e":
      return E;
    case "s":
      return S;
    case "w":
      return W;
  }
}

function getCacheKey(b: Beam): string {
  return `${toString(b.coord)}-${b.dir}`;
}

function pt2(input: string) {
  const data = readFileSync(input, 'utf8');
  const grid: string[][] = data.split('\n').map(l => l.split(""));

  console.time("count");
  var counts: number[] = [];
  for (let r = 0; r < grid.length; r++) {
    const gotLeft = countEnergized(grid, {
      coord: [r, 0],
      dir: "e",
    })
    const gotRight = countEnergized(grid, {
      coord: [r, grid[0].length -1],
      dir: "w",
    })
    counts.push(gotLeft);
    counts.push(gotRight);
  }
  for (let c = 0; c < grid[0].length; c++) {
    const gotTop = countEnergized(grid, {
      coord: [0, c],
      dir: "s",
    })
    const gotBot = countEnergized(grid, {
      coord: [grid.length-1, c],
      dir: "n",
    })
    counts.push(gotTop);
    counts.push(gotBot);
  }
  console.timeEnd("count");
  console.log(Math.max(...counts));
}

function countEnergized(grid: string[][], start: Beam): number {
  const energized = JSON.parse(JSON.stringify(grid));
  const beams: Beam[] = [start];
  const seen = new Set<string>(); // keys are cache keys
  while (beams.length > 0) {
    const b = beams.pop()!;
    const cacheKey = getCacheKey(b);
    if (seen.has(cacheKey)) {
      continue;
    }
    seen.add(cacheKey);
    const tile = at(grid, b.coord);
    if (tile === undefined) {
      continue; // this beam disappears
    }
    set(energized, b.coord, "#");

    if (tile === "/") {
      switch (b.dir) {
        case "n":
          b.dir = "e";
          break;
        case "e":
          b.dir = "n";
          break;
        case "s":
          b.dir = "w";
          break;
        case "w":
          b.dir = "s";
          break;
      }
    } else if (tile === "\\") {
      switch (b.dir) {
        case "n":
          b.dir = "w";
          break;
        case "e":
          b.dir = "s";
          break;
        case "s":
          b.dir = "e";
          break;
        case "w":
          b.dir = "n"
          break;;
      }
    } else if (tile === "-") {
      if (b.dir === "n" || b.dir === "s") {
        b.dir = "w";
        beams.push({ coord: b.coord, dir: "e" });
      }
    } else if (tile === "|") {
      if (b.dir === "e" || b.dir === "w") {
        b.dir = "n";
        beams.push({ coord: b.coord, dir: "s" });
      }
    }
    b.coord = add(b.coord, getDir(b));
    beams.push(b);
  }

  let sum = 0;
  for (let r =0; r<energized.length; r++) {
    for (let c =0; c < energized[0].length; c++) {
      if (energized[r][c] === "#") {
        sum++;
      }
    }
  }
  return sum;
}

function tests() {}

function printGrid(name: String, grid: string[][]) {
  console.log(`------${name}------`)
  grid.forEach(r => {
    console.log(r.join(""));
  });
}