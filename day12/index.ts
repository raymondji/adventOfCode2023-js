import { readFileSync } from 'fs';

const DEBUG = false;

export {
  pt1,
  pt2,
  tests,
}

function pt1() {
  const data = readFileSync("day12.txt", 'utf8');
  const lines = data.split('\n');
  const records: Record[] = lines.map(l => {
    const [springs, damagedStr] = l.split(" ");
    const damagedCounts = damagedStr.split(",").map(x => parseInt(x));
    return {
      springs,
      damagedCounts,
    };
  });
  // console.log("records", records);
  const arrangements = records.map(r => {
    // console.log("------");
    return countArrangements(r, 0);
  });
  // console.log("arrangements", arrangements);
  const sum = arrangements.reduce((acc, x) => acc + x, 0);
  console.log("sum", sum);
}

type Record = {
  springs: string;
  damagedCounts: number[];
}

function sub(s: string, i: number, c: string): string {
  return s.slice(0, i) + c + s.slice(i+1, s.length);
}

function countArrangements(record: Record, i: number): number {
  if (i === record.springs.length) {
    return isValid(record) ? 1 : 0;
  }

  if (record.springs[i] === "?") {
    const variantA: Record = {
      springs: sub(record.springs, i, "."),
      damagedCounts: record.damagedCounts,
    };
    const variantB: Record = {
      springs: sub(record.springs, i, "#"),
      damagedCounts: record.damagedCounts,
    };
    return countArrangements(variantA, i+1) + countArrangements(variantB, i+1);
  } else {
    return countArrangements(record, i+1);
  }
}

let numFinal = 0;
function isValid(record: Record): boolean {
  numFinal++;
  // console.log("---");
  // console.log("got final", record.springs);
  const damagedGroups = record.springs.split(/\.+/).filter(g => g !== "");
  if (record.damagedCounts.length !== damagedGroups.length) {
    // console.log("not valid");
    return false;
  }
  for (let i = 0; i < damagedGroups.length; i++) {
    if (damagedGroups[i].length != record.damagedCounts[i]) {
      // console.log("not valid");
      return false;
    }
  }
  // console.log("is valid");
  return true;
}

function pt2() {
  const data = readFileSync("day12.txt", 'utf8');
  const lines = data.split('\n');
  const records: Record[] = lines.map(l => {
    const [springsStr, damagedStr] = l.split(" ");
    const springs = [springsStr, springsStr, springsStr, springsStr, springsStr].join("?");
    const damagedCounts = [damagedStr, damagedStr, damagedStr, damagedStr, damagedStr].join(",").split(",").map(x => parseInt(x));
    return {
      springs,
      damagedCounts,
    };
  });
  // console.log("records", records);
  let i = 0;
  const arrangements = records.map(r => {
    let cache = new Map<string, number>();
    // console.log("------");
    console.log("record", i);
    i++;
    return countArrangementsPt2(r, 0, 0, cache);
  });
  console.log("num final checks", numFinal);
  console.log("arrangements", arrangements);
  const sum = arrangements.reduce((acc, x) => acc + x, 0);
  console.log("sum", sum);
}


let cacheHits = 0;
function getCacheKey(springIdx: number, damagedIdx: number): string {
  return `${springIdx}-${damagedIdx}`;
}

function countArrangementsPt2(record: Record, springIdx: number, damagedIdx: number, cache: Map<string, number>): number {
  // console.log("count arr called with", record, springIdx, damagedIdx);
  const cacheKey = getCacheKey(springIdx, damagedIdx);
  if (cache.has(cacheKey)) {
    cacheHits++;
    if (cacheHits % 10000 === 0) {
      console.log("cacheHits", cacheHits);
    }
    return cache.get(cacheKey)!;
  }
  if (isNaN(springIdx)) {
    // console.log("WTF got NaN")
    throw new Error("WTF got NaN");
  }
  if (springIdx >= record.springs.length) {
    return 1;
  }

  let count = 0;

  let sumRemainingDamaged = 0;
  for (let i = damagedIdx; i < record.damagedCounts.length; i++) {
    sumRemainingDamaged += record.damagedCounts[i];
    if (i != record.damagedCounts.length - 1) {
      sumRemainingDamaged++;
    }
  }
  if (record.springs.length - springIdx > sumRemainingDamaged) {
    if (record.springs[springIdx] === "." || record.springs[springIdx] === "?") {
      // console.log("variant A");
      count += countArrangementsPt2(record, springIdx+1, damagedIdx, cache);
    }
  }

  const infoB = getDamagedInfo(record, springIdx, damagedIdx);
  if (infoB !== undefined) {
    // console.log("variant B");
    const [_, nextSpringIdx, nextDamagedIdx] = infoB;
    count += countArrangementsPt2(record, nextSpringIdx, nextDamagedIdx, cache);
  } else {
    // console.log("variant B undefined");
  }

  cache.set(cacheKey, count);
  return count;
}

function getDamagedInfo(
  record: Record, springIdx: number, damagedIdx: number,
): [Record, number,number]|undefined {
  if (damagedIdx >= record.damagedCounts.length) {
    return undefined;
  }
  const damagedCount = record.damagedCounts[damagedIdx];
  if (springIdx + damagedCount > record.springs.length) {
    // console.log("past index");
    return undefined;
  }
  let newSprings = "";
  for (let i = 0; i < record.springs.length; i++) {
    if (i >= springIdx && i < springIdx + damagedCount) {
      if (record.springs[i] === ".") {
        return undefined;
      } else {
        newSprings += "#";
      }
    } else if (i === springIdx + damagedCount) {
      if (record.springs[i] === "#") {
        return undefined;
      } else {
        newSprings += ".";
      }
    } else {
      newSprings += record.springs[i];
    }
  }
  return [{
    springs: newSprings,
    damagedCounts: record.damagedCounts,
  }, springIdx + damagedCount + 1, damagedIdx + 1];
}

function tests() {
  console.log("--- test 1 ---");
  console.log(getDamagedInfo({
    springs: "???.###????.###????.###????.###????.###",
    damagedCounts: [1,1,3,1,1,3,1,1,3,1,1,3,1,1,3],
  }, 0, 0));

  console.log("--- test 2 ---");
  console.log(getDamagedInfo({
    springs: "#.??.###????.###????.###????.###????.###",
    damagedCounts: [1,1,3,1,1,3,1,1,3,1,1,3,1,1,3],
  }, 2, 1));

  console.log("--- test 3 ---");
  console.log(getDamagedInfo({
    springs: "#..?.###????.###????.###????.###????.###",
    damagedCounts: [1,1,3,1,1,3,1,1,3,1,1,3,1,1,3],
  }, 3, 1));

  console.log("--- test 4 ---");
  console.log(getDamagedInfo({
    springs: "#.#..###????.###????.###????.###????.###",
    damagedCounts: [1,1,3,1,1,3,1,1,3,1,1,3,1,1,3],
  }, 5, 2));

  console.log("--- test 5 ---");
  console.log(getDamagedInfo({
    springs: "#.#..#?.",
    damagedCounts: [1,1,3,1,1,3,1,1,3,1,1,3,1,1,3],
  }, 5, 2));

  console.log("--- test NaN ---");
  console.log(getDamagedInfo({
    springs: '####.#...#....####.#...#....####.#...#....####.#...#....####.#...#...',
    damagedCounts: [1,1,3,1,1,3,1,1,3,1,1,3,1,1,3],
  }, 68,15));
}