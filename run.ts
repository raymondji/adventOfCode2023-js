import path from "node:path";
import { parseArgs } from "node:util";
import { fileURLToPath } from 'url';

export function run({
    pt1, pt2, tests,
}: {
    pt1?: (inputPath: string) => void,
    pt2?: (inputPath: string) => void,
    tests?: () => void,
}, dirname: string) {
    const {
        values: { cmd, input },
    } = parseArgs({
        options: {
            cmd: {
                type: "string",
            },
            input: {
                type: "string",
            },
        },
    });
    
    if (input === undefined) {
        throw new Error("Missing input");
    }
    console.log("got dirname", dirname);
    const inputPath = path.resolve(dirname, input);
    console.log("got inputPath", inputPath);
    if (cmd === "pt1" ) {
        console.log("---- PT.1 ----");
        if (pt1) {
            pt1(inputPath);
        } else {
            console.error("pt1 not defined");
        }
    } else if (cmd === "pt2") {
        console.log("---- PT.2 ----");
        if (pt2) {
            pt2(inputPath);
        } else {
            console.error("pt2 not defined");
        }
    } else if (cmd === "tests") {
        console.log("---- Tests ----");
        if (tests) {
            tests();
        } else {
            console.error("tests not defined");
        }
    } else {
        console.error("Invalid command");
    }    
}
