import { readInputs } from "../../util/input";
import "../../util/helpers";

const [input, testInput] = readInputs(__dirname);
const TEST = false;

const [instructions, _, ...nodesRaw] = TEST ? testInput : input;
const nodes = nodesRaw.reduce(
  (acc, node) => ({ ...acc, [node.substring(0, 3)]: { L: node.substring(7, 10), R: node.substring(12, 15) } }),
  {} as { [key: string]: { [key: string]: string } }
);

const getLoopLength = (node: string) => {
  let traversed = 0;
  while (node[2] !== "Z") {
    node = nodes[node][instructions[traversed % instructions.length]];
    traversed++;
  }
  return traversed;
};

export const func1 = () => getLoopLength("AAA");

export const func2 = () =>
  Object.keys(nodes)
    .filter((node) => node[2] === "A")
    .reduce((sum, start) => sum.lcm(getLoopLength(start)), 1);
