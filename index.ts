import { parseArgs } from "node:util";
import { pt1, pt2, tests } from "./day15";
const {
    values: { cmd, input  },
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

if (cmd === "pt1") {
    console.log("---- PT.1 ----");
    pt1(input);
} else if (cmd === "pt2") {
    console.log("---- PT.2 ----");
    pt2(input);
} else if (cmd === "tests") {
    console.log("---- Tests ----");
    tests();
} else {
    console.error("Invalid command");
}
