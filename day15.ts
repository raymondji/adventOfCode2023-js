import { readFileSync } from 'fs';

const DEBUG = false;

export {
  pt1,
  pt2,
  tests,
}

function pt1(input: string) {
  const data = readFileSync(input, 'utf8');
  const lines: string[] = data.split('\n');
  if (lines.length != 1) {
    throw new Error("too many lines" + lines.length);
  }
  const steps = lines[0].split(",");
  let sum = 0;
  for (const step of steps) {
    const hashVal = hash(step);
    console.log("step", step, "hash", hashVal);
    sum += hashVal;
  }
  console.log(sum);
}

function hash(str: string): number {
  let val = 0;
  for (let i =0; i <str.length; i++) {
    val += str.charCodeAt(i);
    val *= 17;
    val %= 256;
  }
  return val;
}

type Lens = {
  label: string;
  fl: number;
}

function pt2(input: string) {
  const data = readFileSync(input, 'utf8');
  const lines: string[] = data.split('\n');
  if (lines.length != 1) {
    throw new Error("too many lines" + lines.length);
  }
  // values should remain sorted
  const boxes = new Map<number, Lens[]>();
  const steps = lines[0].split(",");
  for (const step of steps) {
    if (step[step.length-1] === "-") {
      const label = step.slice(0, step.length-1)
      removeLabel(boxes, label);
    } else {
      const [label, flStr] = step.split("=");
      const fl = parseInt(flStr);
      updateLabel(boxes, label, fl);
    }
  }
  console.log(boxes);

  let sum = 0;
  for (const [box, lenses] of boxes) {
    for (let i = 0; i<lenses.length; i++) {
      const fp = (box+1) * (i+1) * lenses[i].fl;
      console.log(`box ${box}, label: ${lenses[i].label}, slot: ${i+1}, fl: ${lenses[i].fl}, fp: ${fp}`);
      sum += fp;
    }
  }
  console.log(sum);
}

function removeLabel(boxes: Map<number, Lens[]>, label: string) {
  const hv = hash(label);
  if (!boxes.has(hv)) {
    return;
  }
  const lenses = boxes.get(hv)!;
  for (let i = 0; i < lenses.length; i++) {
    if (lenses[i].label === label) {
      lenses.splice(i, 1);
      return;
    }
  }
}

function updateLabel(boxes: Map<number, Lens[]>, label: string, fl: number) {
  const hv = hash(label);
  if (!boxes.has(hv)) {
    boxes.set(hv, []);
  }
  const lenses = boxes.get(hv)!;
  for (let i = 0; i < lenses.length; i++) {
    if (lenses[i].label === label) {
      lenses[i].fl = fl;
      return;
    }
  }
  lenses.push({
    label, fl,
  });
}

function tests() {}