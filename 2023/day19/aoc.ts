import { readInputs } from "../../util/input";
import "../../util/helpers";
import { Quartet } from "../../util/Tuple";

const [input, testInput] = readInputs(__dirname);
const TEST = false;
const raw = TEST ? testInput : input;

const workflows = new Map<string, { condition?: string; destination: string }[]>();
const parts: Quartet[] = [];

raw
  .filter((row) => row[0])
  .forEach((row) => {
    if (row[0] !== "{") {
      const [name, rest] = row.split("{");
      const rules = rest
        .slice(0, -1)
        .split(",")
        .map((rule) => rule.split(":"))
        .map(([first, second]) => (!second ? { destination: first } : { condition: first, destination: second }));
      workflows.set(name, rules);
    } else {
      const part = row
        .slice(1, -1)
        .split(",")
        .map((s) => parseInt(s.split("=")[1]));
      parts.push(part as Quartet);
    }
  });

export const func1 = () =>
  parts.sum(([x, m, a, s]) => {
    let rules = workflows.get("in")!;
    while (true) {
      for (var { condition, destination } of rules) {
        if (!condition || eval(condition)) {
          if (destination === "R") return 0;
          if (destination === "A") return [x, m, a, s].sum();
          rules = workflows.get(destination)!;
          break;
        }
      }
    }
  });

export const func2 = () => {
  const queue = [
    { node: "in", bounds: { x: { lb: 1, ub: 4000 }, m: { lb: 1, ub: 4000 }, a: { lb: 1, ub: 4000 }, s: { lb: 1, ub: 4000 } } },
  ];
  const results = [];

  while (queue.length) {
    let { node, bounds } = queue.shift()!;

    if (node === "R") continue;
    if (node === "A") {
      results.push(bounds);
      continue;
    }

    workflows.get(node)!.forEach(({ condition, destination }) => {
      if (!condition) {
        queue.push({ node: destination, bounds });
        return;
      }

      const upper = condition.includes("<");
      const split = condition.split(/[<>]/);
      const param = split[0] as keyof (typeof queue)[number]["bounds"];
      const parsedValue = parseInt(split[1]);

      const lb = parsedValue + 1 > bounds[param].lb ? parsedValue + 1 : bounds[param].lb;
      const ub = parsedValue - 1 < bounds[param].ub ? parsedValue - 1 : bounds[param].ub;

      queue.push({
        node: destination,
        bounds: { ...bounds, [param]: { lb: upper ? bounds[param].lb : lb, ub: upper ? ub : bounds[param].ub } },
      });

      bounds = { ...bounds, [param]: { lb: upper ? lb - 1 : bounds[param].lb, ub: upper ? bounds[param].ub : ub + 1 } };
    });
  }

  return results.sum((result) => Object.values(result).product((v) => v.ub - v.lb + 1));
};
