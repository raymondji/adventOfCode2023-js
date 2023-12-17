import { readFileSync } from 'fs';

export function day1() {
  pt1();
  pt2();
}

function pt1() {
  const data = readFileSync('inputs/day1.txt', 'utf8');
  const lines = data.split("\n");
  const calibValues = lines.map(l => {
    const digits = l.split("").map(c => parseInt(c)).filter(d => !isNaN(d));
    return digits[0] * 10 + digits[digits.length - 1];
  });
  const sum = calibValues.reduce((a, b) => a + b);
  console.log(sum);
}

function pt2() {
  const data = readFileSync('inputs/day1.txt', 'utf8');
  const lines = data.split("\n");
  const calibValues = lines.map(l => getCalibrationValuePt2(l));
  const sum = calibValues.reduce((a, b) => a + b);
  console.log(sum);
}

const strDigits = new Map([
  ["one", 1],
  ["two", 2],
  ["three", 3],
  ["four", 4],
  ["five", 5],
  ["six", 6],
  ["seven", 7],
  ["eight", 8],
  ["nine", 9]
]);

function getCalibrationValuePt2(text: string): number {
  let firstI = text.length;
  let lastI = -1;
  let firstDigit = 0;
  let lastDigit = 0;

  for (const [str, digit] of strDigits) {
    let strI = text.indexOf(str);
    let digitI = text.indexOf(digit.toString());
    [strI, digitI].filter(i => i !== -1).forEach(i => {
      if (i < firstI) {
        firstI = i;
        firstDigit = digit;
      }
    })

    strI = text.lastIndexOf(str);
    digitI = text.lastIndexOf(digit.toString());
    [strI, digitI].filter(i => i !== -1).forEach(i => {
      if (i > lastI) {
        lastI = i;
        lastDigit = digit;
      }
    })
  }
  return firstDigit * 10 + lastDigit;
}
