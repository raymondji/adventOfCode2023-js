import { readFileSync } from 'fs';

const DEBUG = false;

export {
  pt1,
  pt2,
  tests,
}

function pt1() {
  const data = readFileSync("day13.txt", 'utf8');
  const lines = data.split('\n');

  const patterns: string[][] = [];
  patterns.push([]);
  for (const l of lines) {
    if (l === "") {
      patterns.push([]);
      continue;
    }

    patterns[patterns.length-1].push(l);
  }
  console.log("patterns", patterns);

  let sum = 0;
  for (const p of patterns) {
    const summary = getLineOfReflectionSummary(p);
    sum += summary;
    console.log("pattern", p, "summary", summary);
  }
  console.log(sum);
}

function getLineOfReflectionSummary(pattern: string[]): number {
  // check horizontal
  for (let r = 0; r < pattern.length-1; r++) {
    // line of relection is b/w r and r + 1
    let above = r;
    let below = r + 1;
    let smudges = 0;
    while (above >= 0 && below < pattern.length && smudges <= 1) {
      smudges += rowsNotEqual(pattern, above, below);
      above--;
      below++;
    }
    if (smudges == 1) {
      return 100*(r+1);
    }
  }

  // check vertical
  for (let c = 0; c < pattern[0].length-1; c++) {
    // line of relection is b/w c and c + 1
    let left = c;
    let right = c+1;
    let smudges = 0;
    while (left >= 0 && right < pattern[0].length && smudges <= 1) {
      smudges += colsNotEqual(pattern, left, right);
      left--;
      right++;
    }
    if (smudges == 1) {
      return c+1;
    }
  }

  console.log("no reflection found", pattern);
  throw new Error(`no reflection found`);
}

function rowsNotEqual(pattern: string[], above: number, below: number): number {
  let notEqual = 0;
  for (let c = 0; c < pattern[0].length; c++) {
    if (pattern[above][c] != pattern[below][c]) {
      notEqual++;
    }
  }
  return notEqual;
}

function colsNotEqual(pattern: string[], left: number, right: number): number {
  let notEqual = 0;
  for (let r = 0; r < pattern.length; r++) {
    if (pattern[r][left] != pattern[r][right]) {
      notEqual++;
    }
  }
  return notEqual;
}

function colsEqual(pattern: string[], left: number, right: number): boolean {
  for (let r = 0; r < pattern.length; r++) {
    if (pattern[r][left] != pattern[r][right]) {
      return false;
    }
  }
  return true;
}

function pt2() {

}

function tests() {

}