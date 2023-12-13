import { readFileSync } from 'fs';

const DEBUG = true;
const file = "inputs/day9.txt";

export {
  pt1,
  pt2,
}

function pt1() {
  const data = readFileSync(file, 'utf8');
  const lines = data.split('\n');
  const histories = lines.map(line => line.split(" ").map(s => parseInt(s)));
  if (DEBUG) console.log("histories", histories);
  const nextValues = histories.map(getNextValue);
  if (DEBUG) console.log("nextValues", nextValues);
  const sum = nextValues.reduce((acc,x) => acc + x);
  console.log(sum);
}

function getNextValue(history: number[]): number {
  if (DEBUG) console.log("----- original history", history);
  let end = history.length - 1;
  for (let j = 0; j < history.length; ++j) {
    // if (DEBUG) console.log("history", history, "end", end);
    let allZero = true;
    for (let i = 0; i < end; i++) {
      history[i] = history[i+1] - history[i];
      if (history[i] !== 0) {
        allZero = false;
      }
    }

    if (allZero) {
      break;
    }
    end--;
  }

  console.log("final", history);
  return history.reduce((acc,x) => acc + x);
}

function getPrevValue(history: number[]): number {
  if (DEBUG) console.log("----- original history", history);
  let start = 0;
  while (true) {
    if (DEBUG) console.log("history", history, "start", start);
    let allZero = true;
    for (let i = history.length - 1; i > start; i--) {
      history[i] = history[i] - history[i-1];
      if (history[i] !== 0) {
        allZero = false;
      }
    }

    if (allZero) {
      break;
    }
    start++;
  }

  console.log("final", history);
  let prev = 0;
  for (let i = history.length-1; i >=0; i--) {
    prev = history[i] - prev;
  }
  return prev;
}

function pt2() {
  const data = readFileSync(file, 'utf8');
  const lines = data.split('\n');
  const histories = lines.map(line => line.split(" ").map(s => parseInt(s)));
  if (DEBUG) console.log("histories", histories);
  const prevValues = histories.map(getPrevValue);
  if (DEBUG) console.log("prevValues", prevValues);
  const sum = prevValues.reduce((acc,x) => acc + x);
  console.log(sum);
}