import { readFileSync } from 'fs';

const DEBUG = false;
const file = "inputs/day8.txt";

export {
  pt1,
  pt2,
}

function pt1() {
  const data = readFileSync(file, 'utf8');
  const lines = data.split('\n');
  const instructions = lines[0];
  const network = new Map<string, [string, string]>();
  lines.slice(2).forEach(nodeStr => {
    const [node, connectionsStr] = nodeStr.split(" = ");
    const [leftStr, rightStr] = connectionsStr.split(", ");
    const left = leftStr.slice(1);
    const right = rightStr.slice(0, 3);
    network.set(node, [left, right]);
  });

  let steps = 0;
  let curr = "RPZ";
  while (true) {
    if (steps > 0 && curr[2] === "Z") {
      break;
    }
    const i = steps % instructions.length;
    if (instructions[i] === "L") {
      curr = network.get(curr)[0]!;
    } else {
      curr = network.get(curr)[1]!;
    }
    steps++;
  }
  console.log(steps);
}

function pt2() {
  const data = readFileSync(file, 'utf8');
  const lines = data.split('\n');
  const instructions = lines[0];
  const network = new Map<string, [string, string]>();
  lines.slice(2).forEach(nodeStr => {
    const [node, connectionsStr] = nodeStr.split(" = ");
    const [leftStr, rightStr] = connectionsStr.split(", ");
    const left = leftStr.slice(1);
    const right = rightStr.slice(0, 3);
    network.set(node, [left, right]);
  });

  const currNodes = Array.from(network.keys()).filter(node => node[2] === "A");
  const currSteps = [];
  for (const _ of currNodes) {
    currSteps.push(0);
  }

  let iters = 0;
  while (true) {
    if (DEBUG) {
      console.log("-----");
      console.log("currNodes: ", currNodes, "currSteps: ", currSteps);
    }
    if (isTerminal(currNodes, currSteps)) {
      break;
    }
    const i = currSteps.indexOf(Math.min(...currSteps));
    console.log("min ste is now", currSteps[i]);
    const [numSteps, nextNode] = toNextTerminalNode(
      network, instructions, currNodes[i], currSteps[i]);
    currSteps[i] += numSteps;
    currNodes[i] = nextNode;
    if (DEBUG) console.log("cache", cache);
    if (DEBUG) {
      iters++
      if (iters > 200000) {
        break;
      }
    }
  }
  console.log(currSteps[0]);
}

function isTerminal(currNodes: string[], currSteps: number[]): boolean {
  if (currNodes.filter(node => node[2] === "Z").length !== currNodes.length) {
    if (DEBUG) console.log("not all Z");
    return false;
  }
  for (let i = 1; i < currSteps.length; i++) {
    if (currSteps[i] != currSteps[0]) {
      if (DEBUG) console.log("steps don't equal");
      return false;
    }
  }
  return true;
}

// Key is ${node}-${instruction index}, value is [num steps taken to get to the next terminal node, the next terminal node]
const cache = new Map<string, [number, string]>();

// toNextTerminalNode returns [num steps taken to get to the next terminal node, the next terminal node]
function toNextTerminalNode(
  network: Map<string, [string, string]>, instructions: string[],
  startNode: string, startStep: number,
): [number, string] {
  if (DEBUG) console.log(`toNextTerminalNode called with ${startNode} ${startStep} instructions.length: ${instructions.length}`);
  const cacheKey = `${startNode}-${startStep % instructions.length}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  const path = [startNode];
  let currNode = startNode;
  let currStep = startStep;
  while (true) {
    // console.log("currNode", currNode, "currStep", currStep, "currInstructionsIndex", currInstructionIndex);
    const [left, right] = network.get(currNode)!;
    const instruction = instructions[currStep % instructions.length];
    if (instruction === "L") {
      currNode = left;
    } else {
      currNode = right;
    }
    path.push(instruction);
    path.push(currNode);
    currStep++;
    if (currNode[2] === "Z") {
      break;
    }
  }
  console.log("path", path);
  cache.set(cacheKey, [currStep - startStep, currNode]);
  return cache.get(cacheKey)!;
}