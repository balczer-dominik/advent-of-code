import { readInputs } from "../../util/input";
import "../../util/helpers";
import { Quartet } from "../../util/Tuple";
import { cond } from "lodash";
import _ from "lodash";

const [input, testInput] = readInputs(__dirname);
const TEST = false;
const raw = TEST ? testInput : input;

type Rule = { condition?: string; destination: string };
const workflows = new Map<string, Rule[]>();
const parts: Quartet[] = [];

let isParts = false;
raw.forEach((row) => {
  if (!isParts && row === "") {
    isParts = true;
    return;
  }

  if (!isParts) {
    const [name, rest] = row.split("{");
    const rules = rest
      .split(",")
      .map((rule) =>
        rule
          .split("")
          .filter((c) => c !== "}")
          .join("")
          .split(":")
      )
      .map(([first, second]) => (!second ? { destination: first } : { condition: first, destination: second }));
    workflows.set(name, rules);
    return;
  }

  const trimmed = row
    .split("")
    .filter((c) => c !== "{" && c !== "}")
    .join("")
    .split(",")
    .map((s) => parseInt(s.split("=")[1]));
  parts.push(trimmed as Quartet);
});

export const func1 = () => {
  const accepted: Quartet[] = [];
  parts.forEach(([x, m, a, s]) => {
    let rules = workflows.get("in")!;
    partCheck: while (true) {
      workflowCheck: for (var { condition, destination } of rules) {
        if (!condition || eval(condition)) {
          if (destination === "R") break partCheck;
          if (destination === "A") {
            accepted.push([x, m, a, s]);
            break partCheck;
          }
          rules = workflows.get(destination)!;
          break workflowCheck;
        }
      }
    }
  });

  return accepted.sum((q) => q.sum());
};

export const func2 = () => {
  const queue = [
    { node: "in", bounds: { x: { lb: 1, ub: 4000 }, m: { lb: 1, ub: 4000 }, a: { lb: 1, ub: 4000 }, s: { lb: 1, ub: 4000 } } },
  ];

  const result = [] as Array<(typeof queue)[number]["bounds"]>;

  while (queue.length) {
    const { node, bounds } = queue.shift()!;
    console.log(node, bounds);

    if (node === "R") {
      continue;
    }
    if (node === "A") {
      result.push(bounds);
      continue;
    }

    const rules = workflows.get(node)!;

    let boundsAcc = _.cloneDeep(bounds);
    rules.forEach(({ condition, destination }) => {
      if (!condition) {
        queue.push({ node: destination, bounds: boundsAcc });
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
        bounds: { ...boundsAcc, [param]: { lb: upper ? boundsAcc[param].lb : lb, ub: upper ? ub : boundsAcc[param].ub } },
      });

      boundsAcc = { ...boundsAcc, [param]: { lb: upper ? lb - 1 : boundsAcc[param].lb, ub: upper ? boundsAcc[param].ub : ub + 1 } };
    });
  }

  return result.sum((r) => (r.a.ub - r.a.lb + 1) * (r.m.ub - r.m.lb + 1) * (r.x.ub - r.x.lb + 1) * (r.s.ub - r.s.lb + 1));
};
