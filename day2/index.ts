import { readFileSync } from 'fs';

export function day2() {
  pt1();
  pt2();
}

type Game = {
  Id: number;
  // [# cubes, color]
  Sets: [number, string][][];
}

function parseLine(line: string): Game {
  const [idStr, setsStr] = line.split(": ")
  return {
    Id: parseInt(idStr.split(" ")[1]),
    Sets: setsStr.split("; ").map(set => {
      return set.split(", ").map(subset => {
        const parts = subset.split(" ");
        return [parseInt(parts[0]), parts[1]];
      });
    }),
  };
}

function isPossible(game: Game): boolean {
  for (const subset of game.Sets) {
    for (const [num, colour] of subset) {
      if (colour == "red" && num > 12) {
        return false;
      }
      if (colour == "green" && num > 13) {
        return false;
      }
      if (colour == "blue" && num > 14) {
        return false;
      }
    }
  }
  return true;
}

function minPossiblePower(game: Game): number {
  const required = new Map<string, number>();

  for (const subset of game.Sets) {
    for (const [num, colour] of subset) {
      if (num > (required.get(colour) ?? 0)) {
        required.set(colour, num);
      }
    }
  }

  const power = (required.get("red") ?? 0) * (required.get("blue") ?? 0) * (required.get("green") ?? 0);
  return power;
}

function pt1() {
  const data = readFileSync('inputs/day2.txt', 'utf8');
  const games = data.split("\n").map(parseLine);
  const sum = games.filter(isPossible).map(g => g.Id).reduce((a, b) => a + b);
  console.log(sum);
}

function pt2() {
  const data = readFileSync('inputs/day2.txt', 'utf8');
  const games = data.split("\n").map(parseLine);
  const sum = games.map(minPossiblePower).reduce((a, b) => a + b);
  console.log(sum);
}