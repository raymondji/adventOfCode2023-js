import { readFileSync } from 'fs';

const DEBUG = false;
const file = "day11.txt";

export {
  pt1,
  pt2,
}

function pt1() {
  const data = readFileSync(file, 'utf8');
  const lines = data.split('\n');
  const grid: string[][] = lines.map(l => l.split(""));

  // expand the galaxy
  const expandRows = new Set<number>();
  const expandCols = new Set<number>();
  for (let r = 0; r < grid.length; r++) {
    if (grid[r].every(x => x === ".")) {
      expandRows.add(r);
    }
  }
  for (let c = 0; c < grid[0].length; c++) {
    let allSpace = true;
    for (let r = 0; r < grid.length; r++) {
      if (grid[r][c] !== ".") {
        allSpace = false;
        break;
      }
    }
    if (allSpace) {
      expandCols.add(c);
    }
  }
  const expandedGrid: string[][] = [];
  for (let r = 0; r < grid.length; r++) {
    const expandedRow: string[] = [];
    for (let c = 0; c < grid[0].length; c++) {
      expandedRow.push(grid[r][c]);
      if (expandCols.has(c)) {
        expandedRow.push(grid[r][c]);
      }
    }
    expandedGrid.push(expandedRow);
    if (expandRows.has(r)) {
      expandedGrid.push(expandedRow);
    }
  }
  // console.log("--- original grid");
  // printGrid(grid, 1);
  console.log("--- expanded grid");
  printGrid(expandedGrid, 1);

  const paths = getShortestPaths(expandedGrid);
  console.log("paths", paths);
  console.log(paths.reduce((acc, x) => acc + x, 0));
}

function getShortestPaths(grid: string[][]): number[] {
  const stars: [number, number][] = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === "#") {
        stars.push([r, c]);
      }
    }
  }
  console.log("expanded stars", stars);

  const paths: number[] = [];
  for (let i = 0; i < stars.length; i++) {
    for (let j = i+1; j < stars.length; j++) {
      const dist = Math.abs(stars[i][0] - stars[j][0]) + Math.abs(stars[i][1]-stars[j][1]);
      paths.push(dist);
    }
  }
  return paths;
}

function pt2() {
  const data = readFileSync(file, 'utf8');
  const lines = data.split('\n');
  const grid: string[][] = lines.map(l => l.split(""));

  const expandRows: number[] = [];
  const expandCols: number[] = [];
  for (let r = 0; r < grid.length; r++) {
    if (grid[r].every(x => x === ".")) {
      expandRows.push(r);
    }
  }
  for (let c = 0; c < grid[0].length; c++) {
    let allSpace = true;
    for (let r = 0; r < grid.length; r++) {
      if (grid[r][c] !== ".") {
        allSpace = false;
        break;
      }
    }
    if (allSpace) {
      expandCols.push(c);
    }
  }
  console.log("expandCols", expandCols);
  console.log("expandRows", expandRows);

  const stars: [number, number][] = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === "#") {
        stars.push([r, c]);
      }
    }
  }

  console.log("original stars", stars)

  const expandedStars: [number, number][] = [];
  const expansionFactor = 1000000-1;
  for (let i = 0; i < stars.length; i++) {
    const rowExpansions = expandRows.filter(r => r < stars[i][0]).length;
    const colExpansions = expandCols.filter(c => c < stars[i][1]).length;
    expandedStars.push([expansionFactor * rowExpansions + stars[i][0], expansionFactor * colExpansions + stars[i][1]]);
  }
  console.log("expanded stars", expandedStars, "len", expandedStars.length)

  const paths: number[] = [];
  for (let i = 0; i < expandedStars.length; i++) {
    for (let j = i+1; j < expandedStars.length; j++) {
      const dist = Math.abs(expandedStars[i][0] - expandedStars[j][0]) + Math.abs(expandedStars[i][1]-expandedStars[j][1]);
      paths.push(dist);
    }
  }
  console.log("paths", paths, "len", paths.length);
  console.log(paths.reduce((acc, x) => acc + x, 0));
}

function printGrid(grid: string[][], padding: number) {
  const str = grid.map(r => r.map(c => {
    return c.toString().padEnd(padding);
  }).join("")).join("\n");
  console.log(str);
}