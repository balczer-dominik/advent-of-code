import { readInputs } from "../../util/input";
import "../../util/helpers";
import _ from "lodash";

const [input, testInput] = readInputs(__dirname);
const TEST = false;
const raw = TEST ? testInput : input;

type ModuleType = "&" | "b" | "%";
const modules = raw.toObject(
  (module) => module.split(" -> ")[0].substring(1),
  (module) => {
    const [prefix, destinations] = module.split(" -> ");
    return { type: prefix.charAt(0) as ModuleType, destinations: destinations.split(", ") };
  }
);

export const func1 = () => {
  const flipFlopStates = Object.entries(modules)
    .filter((module) => module[1].type === "%")
    .toObject(
      ([name]) => name,
      () => false
    );
  const conjunctionStates = Object.entries(modules)
    .filter((module) => module[1].type === "&")
    .toObject(
      ([name]) => name,
      ([name]) =>
        Object.entries(modules)
          .filter((module) => module[1].destinations.includes(name))
          .toObject(
            ([name]) => name,
            () => "LOW"
          )
    );

  return _.range(0, 1000)
    .reduce(
      ([low, high]) => {
        const queue = [{ from: "", destination: "roadcaster", signal: "LOW" }] as { from: string; destination: string; signal: string }[];

        while (queue.length) {
          const { from, destination, signal } = queue.shift()!;
          const module = modules[destination];
          if (!module) continue;
          const { type, destinations } = module;

          let signalToSend = "LOW";

          if (type === "%") {
            if (signal === "HIGH") continue;
            flipFlopStates[destination] = !flipFlopStates[destination];
            if (flipFlopStates[destination]) signalToSend = "HIGH";
          }

          if (type === "&") {
            conjunctionStates[destination][from] = signal;
            if (Object.values(conjunctionStates[destination]).some((pulse) => pulse === "LOW")) signalToSend = "HIGH";
          }

          if (type === "b") signalToSend = signal;

          signalToSend === "HIGH" ? (high += destinations.length) : (low += destinations.length);
          queue.push(
            ...destinations.map((module) => ({
              from: destination,
              destination: module,
              signal: signalToSend,
            }))
          );
        }
        return [low, high];
      },
      [1000, 0]
    )
    .product();
};

const getLoop = (node: string) => {
  const flipFlopStates = Object.entries(modules)
    .filter((module) => module[1].type === "%")
    .toObject(
      ([name]) => name,
      () => false
    );
  const conjunctionStates = Object.entries(modules)
    .filter((module) => module[1].type === "&")
    .toObject(
      ([name]) => name,
      ([name]) =>
        Object.entries(modules)
          .filter((module) => module[1].destinations.includes(name))
          .toObject(
            ([name]) => name,
            () => "LOW"
          )
    );

  let buttonPresses = 0;

  while (true) {
    buttonPresses++;
    const queue = [{ from: "", destination: "roadcaster", signal: "LOW" }] as { from: string; destination: string; signal: string }[];

    while (queue.length) {
      const { from, destination, signal } = queue.shift()!;
      const module = modules[destination];
      if (!module) continue;
      const { type, destinations } = module;

      let signalToSend = "LOW";

      if (type === "%") {
        if (signal === "HIGH") continue;
        flipFlopStates[destination] = !flipFlopStates[destination];
        if (flipFlopStates[destination]) signalToSend = "HIGH";
      }

      if (type === "&") {
        conjunctionStates[destination][from] = signal;
        if (Object.values(conjunctionStates[destination]).some((pulse) => pulse === "LOW")) signalToSend = "HIGH";
      }

      if (type === "b") signalToSend = signal;

      if (signalToSend === "HIGH" && destination === node) return buttonPresses;
      queue.push(
        ...destinations.map((module) => ({
          from: destination,
          destination: module,
          signal: signalToSend,
        }))
      );
    }
  }
};

export const func2 = () =>
  Object.entries(modules)
    .filter((module) => module[1].destinations.includes("kj"))
    .lcm(([name]) => getLoop(name));
