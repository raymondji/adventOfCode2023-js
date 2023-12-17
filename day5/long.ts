import { readFileSync } from 'fs';

export function day5() {
  pt1();
  pt2();
}

type Mapping = {
  dstStart: number;
  srcStart: number; // inclusive
  srcEnd: number; // exclusive
  rangeLength: number;
}

function pt1() {
  const data = readFileSync('inputs/day5.txt', 'utf8');
  const lines = data.split("\n");
  const seeds = lines[0].split("seeds: ")[1].split(" ").map(s => parseInt(s));
  console.log("seeds", seeds);

  const maps: Mapping[][] = [];
  for (let i = 2; i < lines.length; i++) {
    if (lines[i] == "") {
      continue;
    }
    if (lines[i].includes("map:")) {
      maps.push([]);
      continue;
    }
    const [dstStart, srcStart, rangeLength] = lines[i].split(" ");
    maps[maps.length - 1].push({
      dstStart: parseInt(dstStart),
      srcStart: parseInt(srcStart),
      srcEnd: parseInt(srcStart) + parseInt(rangeLength),
      rangeLength: parseInt(rangeLength)
    });
  }

  const locs = seeds.map(s => toLocation(s, maps));
  console.log(Math.min(...locs));
}

function toLocation(seed: number, maps: Mapping[][]): number {
  let n = seed;
  for (const map of maps) {
    for (const mapping of map) {
      if (n >= mapping.srcStart && n < mapping.srcStart + mapping.rangeLength) {
        n = mapping.dstStart + (n - mapping.srcStart);
        break;
      }
    }
  }
  return n;
}

function pt2() {
  const data = readFileSync('inputs/day5.txt', 'utf8');
  const lines = data.split("\n");
  const seedLine = lines[0].split("seeds: ")[1].split(" ").map(s => parseInt(s));
  let seedRanges: Range[] = [];
  while (seedLine.length > 0) {
    const [start, length] = [seedLine.shift()!, seedLine.shift()!];
    seedRanges.push({
      start,
      end: start + length,
    });
  }
  console.log("seedRanges", seedRanges);

  const maps: Mapping[][] = [];
  for (let i = 2; i < lines.length; i++) {
    if (lines[i] == "") {
      continue;
    }
    if (lines[i].includes("map:")) {
      maps.push([]);
      continue;
    }
    const [dstStart, srcStart, rangeLen] = lines[i].split(" ");
    maps[maps.length - 1].push({
      dstStart: parseInt(dstStart),
      srcStart: parseInt(srcStart),
      srcEnd: parseInt(srcStart) + parseInt(rangeLen),
      rangeLength: parseInt(rangeLen),
    });
  }
  for (const m of maps) {
    m.sort((a, b) => a.srcStart - b.srcStart); // asc order
  }
  console.log("maps", maps);

  const locRanges = mapThroughRanges(seedRanges, maps);
  console.log("locRanges", locRanges);
  console.log(Math.min(...locRanges.map(lr => lr.start)));
}

type Range = {
  start: number; // inclusive
  end: number; // exclusive
}

function getOverlap(r1: Range, r2: Range): Range|undefined {
  // sort asc
  const [rLeft, rRight] = [r1, r2].sort((a, b) => a.start - b.start);
  if (rLeft.end <= rRight.start) {
    return undefined;
  }
  return {
    start: rRight.start,
    end: Math.min(rLeft.end, rRight.end),
  };
}

function subtract(r: Range, subRange: Range): Range[] {
  const candidates = [
    { start: r.start, end: subRange.start },
    { start: subRange.end, end: r.end },
  ];
  return candidates.filter(c => c.start < c.end);
}

function mapThroughRanges(ranges: Range[], maps: Mapping[][]): Range[] {
  let srcRanges = ranges;
  for (const map of maps) {
    // Gradually move everything from srcRanges to dstRanges
    const dstRanges = [];
    while (srcRanges.length > 0) {
      const srcRange = srcRanges.pop();
      let usedUp = false;
      for (const mapping of map) {
        if (srcRange.end <= mapping.srcStart) {
          // Since the mappings are sorted, it's impossible for 
          // any remaining mappings to overlap with srcRange.
          // So map srcRange unchanged to dstRange and move on.
          dstRanges.push(srcRange);
          usedUp = true;
          break;
        }
        const overlap = getOverlap(srcRange, {
          start: mapping.srcStart,
          end: mapping.srcStart + mapping.rangeLength,
        });
        if (overlap !== undefined) {
          srcRanges = srcRanges.concat(subtract(srcRange, overlap));

          const mappedStart = mapping.dstStart + overlap.start - mapping.srcStart;
          dstRanges.push({
            start: mappedStart,
            end: mappedStart + overlap.end - overlap.start,
          });
          usedUp = true;
          break;
        }
      }
      if (!usedUp) {
        // Since we didn't match any mappings, map srcRange unchanged to dstRange.
        dstRanges.push(srcRange);
      }
    }
    srcRanges = dstRanges;
  }
  return srcRanges;
}