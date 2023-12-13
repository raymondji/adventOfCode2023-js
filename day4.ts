import { readFileSync } from 'fs';

export function day4() {
  pt1();
  pt2();
}

function pt1() {
  const data = readFileSync('inputs/day4.txt', 'utf8');
  const lines = data.split("\n");
  const cardPoints = lines.map(computePoints);
  const sum = cardPoints.reduce((acc, curr) => acc + curr, 0);
  console.log(sum);
}

function pt2() {
  const data = readFileSync('inputs/day4.txt', 'utf8');
  let lines = data.split("\n");
  // each index i corresponds to the card i+1
  const cardCounts: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    cardCounts[i] = 1;
  }
  for (let i = 0; i < lines.length; i++) {
    const numWinners = computeNumWinners(lines[i]);
    for (let j = 1; j <= numWinners; ++j) {
      cardCounts[i + j] += cardCounts[i];
    }
  }
  const total = cardCounts.reduce((acc, curr) => acc + curr);
  console.log(total);
}

function computePoints(line: string): number {
  const [idStr, numsStr] = line.split(":").map(p => p.trim());
  const id = parseInt(idStr.split(/\s+/)[1]);
  const [winningStr, haveStr] = numsStr.split("|").map(p => p.trim());
  const winning = winningStr.split(/\s+/).map(n => parseInt(n));
  const have = haveStr.split(/\s+/).map(n => parseInt(n));
  const winningSet = new Set(winning);
  const haveWinners = have.filter(n => winningSet.has(n));
  if (haveWinners.length === 0) {
    return 0;
  } else {
    return 1 * Math.pow(2, haveWinners.length - 1);
  }
}

function computeNumWinners(line: string): number {
  const [idStr, numsStr] = line.split(":").map(p => p.trim());
  const id = parseInt(idStr.split(/\s+/)[1]);
  const [winningStr, haveStr] = numsStr.split("|").map(p => p.trim());
  const winning = winningStr.split(/\s+/).map(n => parseInt(n));
  const have = haveStr.split(/\s+/).map(n => parseInt(n));
  const winningSet = new Set(winning);
  const haveWinners = have.filter(n => winningSet.has(n));
  return haveWinners.length;
}