import { readInputs } from "../../util/input";
import { maxReduce, sumNumbers } from "../../util/helpers";

const [input, testInput] = readInputs(__dirname);
const TEST = false;

const raw = TEST ? testInput : input;

const games = raw.map((gameRaw) => {
  const [roundId, setsRaw] = gameRaw.split(": ");

  return {
    roundId: parseInt(roundId.split("Game ")[1]),
    sets: setsRaw.split("; ").map((set) => {
      const setParsed = set.split(", ").map((cubes) => {
        const [quantity, color] = cubes.split(" ");
        return { quantity, color };
      });

      return {
        red: parseInt(setParsed.filter((cube) => cube.color === "red")[0]?.quantity ?? 0),
        green: parseInt(setParsed.filter((cube) => cube.color === "green")[0]?.quantity ?? 0),
        blue: parseInt(setParsed.filter((cube) => cube.color === "blue")[0]?.quantity ?? 0),
      };
    }),
  };
});

const max = {
  red: 12,
  green: 13,
  blue: 14,
};

export const func1 = () =>
  games
    .filter((round) => round.sets.every((set) => set.blue <= max.blue && set.green <= max.green && set.red <= max.red))
    .map((round) => round.roundId)
    .reduce(sumNumbers);

export const func2 = () =>
  games.reduce(
    (acc, curr) =>
      acc +
      curr.sets.map((set) => set.red).reduce(maxReduce) *
        curr.sets.map((set) => set.green).reduce(maxReduce) *
        curr.sets.map((set) => set.blue).reduce(maxReduce),
    0
  );
