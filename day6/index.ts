import { readFileSync } from 'fs';

export {
  pt1,
  pt2,
}

function pt1() {
  const times = [4680786600000000];
  const records = [214117714021024];
  const ways = [0];
  
  for (let i =0; i<1; ++i) {
    const t = times[i];
    for (let n = 1; n < t; ++n) {
      const dist = (t-n)*n;
      if (dist > records[i]) {
        ways[i]++;
      }
    }
  }
  const total = ways.reduce((acc, x) => acc * x, 1);
  console.log(total);
}

function pt2() {

}