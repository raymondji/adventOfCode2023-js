import { readFileSync } from 'fs';

const DEBUG = false;

export {
  pt1,
  pt2,
  tests,
}

function pt1() {
  const data = readFileSync("day14.txt", 'utf8');
  const grid: string[][] = data.split('\n').map(l => l.split(""));
  // console.log("initial grid");
  // printGrid(grid);

  // console.time("tilt");
  tiltNorth(grid);
  // console.timeEnd("tilt");
  // console.log("tilted grid");
  // printGrid(grid);

  let load = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === "O") {
        load += grid.length-r;
      }
    }
  }
  console.log(load);
}

// O(n)
function tiltNorth(grid: string[][]) {
  for (let c = 0; c < grid[0].length; c++) {
    let prevStopRow = grid.length;
    let roundRocks = 0;
    for (let r = grid.length-1; r >= -1; r--) {
      if (r === -1 || grid[r][c] === "#") {
        for (let r2 = r+1; r2 < prevStopRow; r2++) {
          if (roundRocks > 0 ) {
            grid[r2][c] = "O";
            roundRocks--;
          } else {
            grid[r2][c] = ".";
          }
        }
        prevStopRow = r;
      } else if (grid[r][c] === "O") {
        roundRocks++;
      }
    }
  }
}

function rotateRight(grid: string[][]) {
  if (grid.length != grid[0].length) {
    throw new Error("cannot rotate, non-square matrix");
  }
  const g2: string[][] = JSON.parse(JSON.stringify(grid));
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      grid[c][grid.length-r-1] = g2[r][c];
    }
  }
}

function cycle(grid: string[][]) {
  for (let i = 0; i < 4; i++) {
    // console.log("--------------------------------");
    tiltNorth(grid);
    // console.log("after tilt");
    // printGrid(grid);
    
    rotateRight(grid);
    // console.log("after rotate");
    // printGrid(grid);
  }
}

function printGrid(grid: string[][]) {
  grid.forEach(r => {
    console.log(r.join(""));
  });
}

function pt2() {
  const data = readFileSync("day14.txt", 'utf8');
  const grid: string[][] = data.split('\n').map(l => l.split(""));
  // console.log("initial grid");
  // printGrid(grid);

  console.time("cycles");
  const numCycles = 1100;
  for (let i = 0; i < numCycles; i++) {
    cycle(grid);
    if (i < 1000) {
      continue;
    }

    let load = 0;
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[0].length; c++) {
        if (grid[r][c] === "O") {
          load += grid.length-r;
        }
      }
    }
    console.log("cycle", i, i%9, "load", load);
  }
  console.timeEnd("cycles");
  console.log("completed cycles: ", numCycles);
  // console.log("after cycles");
  // printGrid(grid);

  let load = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === "O") {
        load += grid.length-r;
      }
    }
  }
  console.log(load);
}

function tests() {
  const data = readFileSync("day14short.txt", 'utf8');
  const grid: string[][] = data.split('\n').map(l => l.split(""));
  const orig = JSON.parse(JSON.stringify(grid));
  console.log("orig");
  printGrid(orig);
  console.log("grid");
  printGrid(grid);
  console.log("-----NOW ROTATING----")
  rotateRight(grid);
  console.log("after one rotation");
  printGrid(grid);
  rotateRight(grid);
  rotateRight(grid);
  rotateRight(grid);
  console.log("orig");
  printGrid(orig);
  console.log("after rotations");
  printGrid(grid);
}