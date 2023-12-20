import { readInputs } from "../../util/input";
import "../../util/helpers";

const [input, testInput] = readInputs(__dirname);
const TEST = false;
const raw = TEST ? testInput : input;

type Signal = "LOW" | "HIGH";
type ModuleType = "&" | "b" | "%";
const modules = new Map<string, { type: ModuleType; destinations: string[] }>();

raw.forEach((module) => {
  const [prefix, destinations] = module.split(" -> ");
  const [type, ...name] = prefix.split("");
  modules.set(name.join(""), { type: type as ModuleType, destinations: destinations.split(", ") });
});

export const func1 = () => {
  let flipFlopStates = [...modules]
    .filter((module) => module[1].type === "%")
    .toObject(
      ([name]) => name,
      () => false
    );
  let conjunctionStates = [...modules]
    .filter((module) => module[1].type === "&")
    .toObject(
      ([name]) => name,
      ([name]) =>
        [...modules]
          .filter((module) => module[1].destinations.includes(name))
          .toObject(
            ([name]) => name,
            () => "LOW" as Signal
          )
    );

  console.log(flipFlopStates, conjunctionStates);

  let high = 0;
  let low = 0;

  for (let i = 0; i < 1000; i++) {
    low++;
    let queue = [{ from: "", destination: "roadcaster", signal: "LOW" }] as { from: string; destination: string; signal: Signal }[];
    while (queue.length) {
      const { from, destination, signal } = queue.shift()!;

      const module = modules.get(destination);

      if (!module) continue;

      const { type, destinations } = module;

      if (type === "%" && signal !== "HIGH") {
        flipFlopStates[destination] = !flipFlopStates[destination];
        const signalToSend = flipFlopStates[destination] ? "HIGH" : ("LOW" as Signal);
        if (signalToSend === "HIGH") {
          high += destinations.length;
        } else {
          low += destinations.length;
        }
        queue.push(
          ...destinations.map((module) => ({
            from: destination,
            destination: module,
            signal: signalToSend,
          }))
        );
        continue;
      }

      if (type === "&") {
        conjunctionStates[destination][from] = signal;
        const signalToSend = Object.values(conjunctionStates[destination]).some((pulse) => pulse === "LOW") ? "HIGH" : ("LOW" as Signal);
        if (signalToSend === "HIGH") {
          high += destinations.length;
        } else {
          low += destinations.length;
        }
        queue.push(
          ...destinations.map((module) => ({
            from: destination,
            destination: module,
            signal: signalToSend,
          }))
        );
      }

      if (type === "b") {
        if (signal === "HIGH") {
          high += destinations.length;
        } else {
          low += destinations.length;
        }
        queue.push(
          ...destinations.map((module) => ({
            from: destination,
            destination: module,
            signal,
          }))
        );
      }
    }
  }

  return high * low;
};

const getLoop = (node: string) => {
  let flipFlopStates = new Map<string, boolean>();
  let conjunctionStates = new Map<string, Map<string, Signal>>();
  [...modules].filter((module) => module[1].type === "%").forEach(([name]) => flipFlopStates.set(name, false));
  [...modules]
    .filter((module) => module[1].type === "&")
    .forEach(([name]) => {
      const map = new Map<string, Signal>();
      [...modules].filter((module) => module[1].destinations.includes(name)).forEach(([name]) => map.set(name, "LOW"));
      conjunctionStates.set(name, map);
    });

  let buttonPresses = 0;

  while (true) {
    buttonPresses++;
    const queue = [{ from: "", destination: "roadcaster", signal: "LOW" }] as { from: string; destination: string; signal: Signal }[];

    while (queue.length) {
      const { from, destination, signal } = queue.shift()!;

      const module = modules.get(destination);

      if (!module) continue;

      const { type, destinations } = module;

      if (type === "%" && signal !== "HIGH") {
        const currState = flipFlopStates.get(destination);
        flipFlopStates.set(destination, !currState);
        const signalToSend = currState ? "LOW" : ("HIGH" as Signal);

        queue.push(
          ...destinations.map((module) => ({
            from: destination,
            destination: module,
            signal: signalToSend,
          }))
        );
        continue;
      }

      if (type === "&") {
        const conjunctionState = conjunctionStates.get(destination)!;
        conjunctionState.set(from, signal);
        const signalToSend = [...conjunctionState.values()].some((pulse) => pulse === "LOW") ? "HIGH" : ("LOW" as Signal);
        if (signalToSend === "HIGH" && destination === node) return buttonPresses;

        queue.push(
          ...destinations.map((module) => ({
            from: destination,
            destination: module,
            signal: signalToSend,
          }))
        );
        continue;
      }

      if (type === "b") {
        queue.push(
          ...destinations.map((module) => ({
            from: destination,
            destination: module,
            signal,
          }))
        );
        continue;
      }
    }
  }
};

export const func2 = () => {
  return [...modules].filter((module) => module[1].destinations.includes("kj")).lcm(([name]) => getLoop(name));
};
