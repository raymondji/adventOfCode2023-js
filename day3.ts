import { readFileSync } from 'fs';

export function day3() {
  pt1();
}

function pt1() {
  const data = readFileSync('inputs/day3.txt', 'utf8');
  const lines = data.split("\n");
  const nums = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let currNum = 0;
    let currNumSet = false;
    let currNumAdjacentSymbol = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      const digit = parseInt(char);
      if (!isNaN(digit)) {
        currNum = currNum * 10 + digit;
        currNumSet = true;
        currNumAdjacentSymbol = currNumAdjacentSymbol || isAdjacentSymbol(lines, i, j);
      } else {
        if (currNumSet && currNumAdjacentSymbol) {
          nums.push(currNum);
        }
        // reset
        currNum = 0;
        currNumSet = false;
        currNumAdjacentSymbol = false;
      }
    }
    if (currNumSet && currNumAdjacentSymbol) {
      nums.push(currNum);
    }
    // reset
    currNum = 0;
    currNumSet = false;
    currNumAdjacentSymbol = false;
  }
  console.log(JSON.stringify(nums));
  const sum = nums.reduce((a, b) => a + b);
  console.log(sum);
}

function isAdjacentSymbol(lines: string[], i: number, j: number): boolean {
  return isSymbol(lines, i + 1, j) || isSymbol(lines, i - 1, j) || isSymbol(lines, i, j + 1) || isSymbol(lines, i, j - 1) || isSymbol(lines, i + 1, j + 1) || isSymbol(lines, i - 1, j - 1) || isSymbol(lines, i - 1, j + 1) || isSymbol(lines, i + 1, j - 1);
}

function isSymbol(lines: string[], i: number, j: number): boolean {
  if (lines[i] === undefined || lines[i][j] === undefined) {
    return false;
  }
  const char = lines[i][j];
  return char !== undefined && isNaN(parseInt(char)) && char !== ".";
}

function pt2() {
  const data = readFileSync('inputs/day3.txt', 'utf8');
  const lines = data.split("\n");
  const gearRatios = [];
  for (let i = 0; i < lines.length; i++) {
    const nums = [].concat(getNums(lines[i - 1])).concat(getNums(lines[i])).concat(getNums(lines[i + 1]));

    for (let j = 0; j < lines[i].length; j++) {
      if (lines[i][j] !== "*") {
        continue;
      }
      const adjNums = getAdjacentNums(nums, j);
      if (adjNums.length == 2) {
        gearRatios.push(adjNums[0] * adjNums[1]);
      }
    }
  }
  console.log(gearRatios);
  const sum = gearRatios.reduce((a, b) => a + b);
  console.log(sum);
}

function getAdjacentNums(nums: Num[], j: number): number[] {
  return nums.filter(n => (n.end + 1) >= j && (n.start - 1) <= j).map(n => n.value);
}

type Num = {
  value: number;
  // [start, end] are both inclusive
  start: number;
  end: number;
}
function getNums(line: string | undefined): Num[] {
  if (line === undefined) {
    return [];
  }
  const nums = [];
  let currNum = 0;
  let currNumStart = -1;
  let currNumSet = false;

  for (let i = 0; i < line.length; i++) {
    const digit = parseInt(line[i]);
    if (!isNaN(digit) && !currNumSet) {
      currNum = digit;
      currNumSet = true;
      currNumStart = i;
    } else if (!isNaN(digit)) {
      currNum = currNum * 10 + digit;
    } else {
      if (currNumSet) {
        nums.push({
          value: currNum,
          start: currNumStart,
          end: i - 1
        });
      }
      // reset
      currNum = 0;
      currNumSet = false;
      currNumStart = -1;
    }
  }
  if (currNumSet) {
    nums.push({
      value: currNum,
      start: currNumStart,
      end: line.length - 1,
    });
  }
  // reset
  currNum = 0;
  currNumSet = false;
  currNumStart = -1;

  return nums;
}