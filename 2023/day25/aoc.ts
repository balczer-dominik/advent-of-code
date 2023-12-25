import { readInputs } from "../../util/input";
import "../../util/helpers";
import path from "path";
import { writeFileSync } from "fs";

const [input, testInput] = readInputs(__dirname);
const TEST = false;
const raw = TEST ? testInput : input;

const components = raw
  .map((row) => row.split(": "))
  .toObject(
    ([name]) => name,
    ([_, connected]) => {
      const set = new Set<string>();
      connected.split(" ").forEach((c) => set.add(c));
      return set;
    }
  );

Object.entries(components).forEach(([from, connected]) =>
  connected.forEach((to) => {
    let set = components[to];
    if (set === undefined) {
      set = new Set<string>();
      components[to] = set;
    }
    set.add(from);
  })
);

export const func1 = () => {
  let buffer = "";

  Object.entries(components).forEach(([from, connections]) => connections.forEach((to) => (buffer += `${from} -> ${to}\n`)));
  writeFileSync(path.join(__dirname, "out.txt"), buffer, { flag: "w" });

  // graphviz magic goes here

  components["ncg"].delete("gsk");
  components["gsk"].delete("ncg");
  components["ntx"].delete("gmr");
  components["gmr"].delete("ntx");
  components["mrd"].delete("rjs");
  components["rjs"].delete("mrd");

  const visitedLeft = new Set<string>();
  visitedLeft.add("mrd");
  const visitedRight = new Set<string>();
  visitedRight.add("rjs");
  let queue = ["mrd"];

  while (queue.length) {
    const curr = queue.shift()!;

    components[curr].forEach((n) => {
      if (!visitedLeft.has(n)) queue.push(n);
      visitedLeft.add(n);
    });
  }

  queue = ["rjs"];

  while (queue.length) {
    const curr = queue.shift()!;

    components[curr].forEach((n) => {
      if (!visitedRight.has(n)) queue.push(n);
      visitedRight.add(n);
    });
  }

  return visitedLeft.size * visitedRight.size;
};
