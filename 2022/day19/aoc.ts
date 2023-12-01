import _ from "lodash";
import { maxReduce, multiplyNumbers, simpleParseInt } from "../../util/helpers";
import { readInputs } from "../../util/input";
import { Quartet } from "../../util/Tuple";

const [input, testInput] = readInputs(__dirname);

const ORE = 0;
const CLAY = 1;
const OBSIDIAN = 2;
const GEODE = 3;

type Blueprint = Quartet<Quartet>;

type State = {
  resources: Quartet;
  robots: Quartet;
  minute: number;
};

const parseBlueprints = (rows: string[]): Blueprint[] => {
  return rows.map((row) => {
    const [oreRobotCost, rest1] = row
      .split("Each ore robot costs ")[1]
      .split(" ore. Each clay robot costs ");
    const [clayRobotCost, rest2] = rest1.split(
      " ore. Each obsidian robot costs "
    );
    const [obsidianRobotCosts, rest3] = rest2.split(
      " clay. Each geode robot costs "
    );
    const geodeRobotCosts = rest3
      .split(" obsidian.")[0]
      .split(" ore and ")
      .map(simpleParseInt);

    return [
      [parseInt(oreRobotCost), 0, 0, 0],
      [parseInt(clayRobotCost), 0, 0, 0],
      [...obsidianRobotCosts.split(" ore and ").map(simpleParseInt), 0, 0],
      [geodeRobotCosts[0], 0, geodeRobotCosts[1], 0],
    ] as Blueprint;
  });
};

const mostCollectable = (blueprint: Blueprint, timeLeft: number) => {
  const startingState: State = {
    resources: [0, 0, 0, 0],
    robots: [1, 0, 0, 0],
    minute: 1,
  };

  const oreLimit = blueprint
    .map((robotCost) => robotCost[ORE])
    .reduce(maxReduce);

  let queue = [startingState];
  let bestOutcome: State = startingState;

  while (!queue.isEmpty()) {
    const curr = queue.shift()!;

    const steps = [
      { toBuild: GEODE, canBuild: curr.robots[OBSIDIAN] > 0 },
      {
        toBuild: OBSIDIAN,
        canBuild:
          curr.robots[CLAY] > 0 &&
          curr.robots[OBSIDIAN] < blueprint[GEODE][OBSIDIAN],
      },
      {
        toBuild: CLAY,
        canBuild:
          blueprint[OBSIDIAN][CLAY] > curr.robots[CLAY] &&
          curr.robots[GEODE] === 0,
      },
      {
        toBuild: ORE,
        canBuild: oreLimit > curr.robots[ORE] && curr.robots[OBSIDIAN] === 0,
      },
    ].filter((step) => step.canBuild);

    for (const step of steps) {
      const newState = createNewState(
        curr,
        step.toBuild,
        blueprint[step.toBuild],
        timeLeft
      );
      if (newState.minute === timeLeft + 1) {
        bestOutcome =
          bestOutcome.resources[GEODE] > newState.resources[GEODE]
            ? bestOutcome
            : _.cloneDeep(newState);
      } else {
        queue.push(newState);
        if (step.toBuild === GEODE && newState.minute === curr.minute + 1) {
          break;
        }
      }
    }
  }

  return bestOutcome;
};

const createNewState = (
  oldState: State,
  robotType: number,
  robotCosts: Quartet,
  maxTime: number
) => {
  const newState = _.cloneDeep(oldState);

  const canBuildNow = oldState.resources.every(
    (count, type) => robotCosts[type] <= count
  );

  let jump =
    1 +
    (canBuildNow
      ? 0
      : robotCosts
          .map((matCost, matType) =>
            oldState.robots[matType] === 0
              ? 0
              : Math.ceil(
                  (matCost - oldState.resources[matType]) /
                    oldState.robots[matType]
                )
          )
          .reduce(maxReduce));

  const worthBuilding = newState.minute + jump < maxTime + 1;

  if (worthBuilding) {
    newState.resources[ORE] -= robotCosts[ORE];
    newState.resources[CLAY] -= robotCosts[CLAY];
    newState.resources[OBSIDIAN] -= robotCosts[OBSIDIAN];
  } else {
    jump = maxTime + 1 - newState.minute;
  }

  newState.resources[ORE] += newState.robots[ORE] * jump;
  newState.resources[CLAY] += newState.robots[CLAY] * jump;
  newState.resources[OBSIDIAN] += newState.robots[OBSIDIAN] * jump;
  newState.resources[GEODE] += newState.robots[GEODE] * jump;

  if (worthBuilding) {
    newState.robots[robotType]++;
  }

  newState.minute += jump;

  return newState;
};

const func1 = (input: string[]) =>
  parseBlueprints(input)
    .map((blueprint) => mostCollectable(blueprint, 24).resources[GEODE])
    .reduce((acc, curr, i) => acc + curr * (i + 1));

const func2 = (input: string[]) =>
  parseBlueprints(input)
    .slice(0, 3)
    .map((blueprint) => mostCollectable(blueprint, 32).resources[GEODE])
    .reduce(multiplyNumbers);

console.log(1, func1(input));
console.log(2, func2(input));
