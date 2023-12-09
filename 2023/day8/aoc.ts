import { readInputs } from "../../util/input";
import "../../util/helpers";

const [input, testInput] = readInputs(__dirname);
const TEST = false;

const [instructions, _, ...nodesRaw] = TEST ? testInput : input;
const nodes = nodesRaw.toObject(
  (node) => node.substring(0, 3),
  (node) => ({ L: node.substring(7, 10), R: node.substring(12, 15) })
);

const getLoopLength = (node: string) => {
  let traversed = 0;
  for (; node[2] !== "Z"; traversed++) node = nodes[node][instructions[traversed % instructions.length] as "L" | "R"];
  return traversed;
};

export const func1 = () => getLoopLength("AAA");

export const func2 = () =>
  Object.keys(nodes)
    .filter((node) => node[2] === "A")
    .lcm(getLoopLength);
