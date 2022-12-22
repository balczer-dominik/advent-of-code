import { readInputs } from "../util/input";

const [input, testInput] = readInputs(__dirname);

type ValveParsed = {
  name: string;
  flowRate: number;
  leadsTo: string[];
};

type Valve = {
  name: string;
  flowRate: number;
  leadsTo: { name: string; distance: number }[];
};

const parseValve = (input: string[]) => {
  const valvesParsed: ValveParsed[] = input.map((row) => {
    let split = row.substring("Valve ".length).split(" has flow rate=");
    const name = split[0];
    split = split[1].split(";");
    const flowRate = parseInt(split[0]);
    split = split[1]
      .substring("tunnels lead to valves ".length)
      .trim()
      .split(", ");
    const leadsTo = split;
    return { name, flowRate, leadsTo };
  });

  const valves: Valve[] = valvesParsed.map((valve) => {
    const leadsTo = valvesParsed
      .filter((v) => v !== valve)
      .map((v) => ({
        name: v.name,
        distance: getDistance(valvesParsed, valve, v),
      }));
    return { name: valve.name, flowRate: valve.flowRate, leadsTo };
  });

  let unopened = valves.filter((v) => v.flowRate > 0);
  let currentValve = valves.find((v) => v.name == "AA")!;

  return { unopened, currentValve };
};

const func1 = (input: string[]) => {
  const { unopened, currentValve } = parseValve(input);

  const candidates = unopened
    .map((destValve) => {
      console.log(destValve.name);
      return getScore(currentValve, destValve, unopened, 30);
    })
    .sort((a, b) => b.score - a.score);

  console.table(
    candidates.map((p) => ({
      name: p.destValve.name,
      dist: p.dist,
      flow: p.destValve.flowRate,
      score: p.score,
    }))
  );

  return candidates[0].score;
};

const func3 = (input: string[]) => {
  const { unopened, currentValve } = parseValve(input);

  const me = unopened
    .map((destValve) => {
      console.log(destValve.name);
      return getScore(currentValve, destValve, unopened, 26);
    })
    .sort((a, b) => b.score - a.score)[0];

  console.table(me);

  const elly = me.unopened
    .map((destValve) => {
      console.log(destValve.name);
      return getScore(currentValve, destValve, me.unopened, 26);
    })
    .sort((a, b) => b.score - a.score)[0];

  console.table(elly);
  return me.score + elly.score;
};

const traverse = (
  unopened: Valve[],
  workers: {
    minutesLeft: number;
    currentScore: number;
    at: Valve;
    done: boolean;
  }[]
): number => {
  if (unopened.length === 0 || workers.every((w) => w.done)) {
    return workers.reduce((acc, curr) => acc + curr.currentScore, 0);
  }

  const combinations = unopened.flatMap((valve) => {
    const workersWhoCanTakeIt = workers.filter(
      (worker) =>
        !worker.done && getDistFromTo(worker.at, valve) + 1 < worker.minutesLeft
    );
    return workersWhoCanTakeIt.map((worker) => ({ valve, worker }));
  });

  if (combinations.length === 0) {
    return workers.reduce((acc, curr) => acc + curr.currentScore, 0);
  }

  let bestScore = 0;
  for (const { worker, valve } of combinations) {
    const dist = getDistFromTo(worker.at, valve);
    const minutesLeft = worker.minutesLeft - dist - 1;
    const newWorker = {
      at: valve,
      minutesLeft,
      currentScore: worker.currentScore + minutesLeft * valve.flowRate,
      done: minutesLeft <= 1,
    };

    const score = traverse(
      unopened.filter((u) => u !== valve),
      [...workers.filter((w) => w !== worker), newWorker]
    );

    if (score > bestScore) {
      bestScore = score;
    }
  }

  return bestScore;
};

const traverseMain = (
  unopened: Valve[],
  workers: {
    minutesLeft: number;
    currentScore: number;
    at: Valve;
    done: boolean;
  }[]
): number => {
  const start = new Date();
  let i = 0;
  if (unopened.length === 0 || workers.every((w) => w.done)) {
    return workers.reduce((acc, curr) => acc + curr.currentScore, 0);
  }

  const combinations = unopened.flatMap((valve) => {
    const workersWhoCanTakeIt = workers.filter(
      (worker) =>
        !worker.done && getDistFromTo(worker.at, valve) + 1 < worker.minutesLeft
    );
    return workersWhoCanTakeIt.map((worker) => ({ valve, worker }));
  });

  if (combinations.length === 0) {
    return workers.reduce((acc, curr) => acc + curr.currentScore, 0);
  }

  let bestScore = 0;
  for (const { worker, valve } of combinations) {
    console.log(
      `${++i}/${combinations.length} in ${
        (new Date().getTime() - start.getTime()) / 1000
      }s`
    );

    const dist = getDistFromTo(worker.at, valve);
    const minutesLeft = worker.minutesLeft - dist - 1;
    const newWorker = {
      at: valve,
      minutesLeft,
      currentScore: worker.currentScore + minutesLeft * valve.flowRate,
      done: minutesLeft <= 1,
    };

    const score = traverse(
      unopened.filter((u) => u !== valve),
      [...workers.filter((w) => w !== worker), newWorker]
    );

    if (score > bestScore) {
      bestScore = score;
    }
  }

  return bestScore;
};

const func2 = (input: string[]) => {
  const { unopened, currentValve } = parseValve(input);

  return traverseMain(unopened, [
    { minutesLeft: 26, currentScore: 0, done: false, at: currentValve },
    { minutesLeft: 26, currentScore: 0, done: false, at: currentValve },
  ]);
};

const getScore = (
  from: Valve,
  to: Valve,
  unopened: Valve[],
  minutesLeft: number
): { destValve: Valve; dist: number; score: number; unopened: Valve[] } => {
  const dist = from.leadsTo.find((v) => v.name === to.name)!.distance;
  const score = (minutesLeft - dist - 1) * to.flowRate;

  if (score <= 0) {
    return { destValve: from, dist, score: 0, unopened };
  }

  const nextPoss = unopened.filter((v) => v !== to);
  const nextScore = nextPoss
    .map((nextValve) =>
      getScore(to, nextValve, nextPoss, minutesLeft - dist - 1)
    )
    .sort((a, b) => b.score - a.score)[0];

  return {
    destValve: to,
    dist,
    score: score + (nextScore?.score ?? 0),
    unopened: nextScore?.unopened ?? [],
  };
};

const getDistFromTo = (from: Valve, to: Valve) => {
  if (from === to) {
    throw Error(`CANNOT GO FROM ${from.name} TO ${to.name}.`);
  }

  return from.leadsTo.find((valve) => valve.name === to.name)!.distance;
};

const getDistance = (
  valves: ValveParsed[],
  from: ValveParsed,
  to: ValveParsed
) => {
  const queue: ValveParsed[][] = [];
  const visited: ValveParsed[] = [from];
  let curr: ValveParsed[] = [from];

  while (curr[curr.length - 1] !== to) {
    if (queue.length > 0) {
      curr = queue.shift()!;
    }

    const head = curr[curr.length - 1];

    head.leadsTo.forEach((n) => {
      const nValve = valves.find((v) => v.name === n)!;
      if (!visited.includes(nValve)) {
        visited.push(nValve);
        queue.push([...curr, nValve]);
      }
    });
  }

  return curr.length - 1;
};

function onlyUnique<T>(value: T, index: number, self: T[]) {
  return self.indexOf(value) === index;
}

console.log(func3(input));
