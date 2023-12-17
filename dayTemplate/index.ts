import { readFileSync } from 'fs';
import { run } from "../run";
import { fileURLToPath } from 'url';
import { dirname } from "path";

const DEBUG = false;
function debugLog(...args: any[]) {
  if (DEBUG) console.log(...args);
}

function pt1(data: string) {}

function pt2(data: string) {}

run({pt1, pt2}, dirname(fileURLToPath(import.meta.url)));