import { readInputs } from "../../util/input";
import "../../util/helpers";

const [input, testInput] = readInputs(__dirname);
const TEST = false;

const raw = TEST ? testInput : input;

const games = raw.map((gameRaw) => {
  const [roundId, setsRaw] = gameRaw.split(": ");

  return {
    roundId: roundId.split("Game ")[1].toNumber(),
    sets: setsRaw.split("; ").map((set) => {
      const setParsed = set.split(", ").map((cubes) => {
        const [quantity, color] = cubes.split(" ");
        return { quantity, color };
      });

      return {
        red: setParsed.filter((cube) => cube.color === "red")[0]?.quantity?.toNumber() ?? 0,
        green: setParsed.filter((cube) => cube.color === "green")[0]?.quantity?.toNumber() ?? 0,
        blue: setParsed.filter((cube) => cube.color === "blue")[0]?.quantity?.toNumber() ?? 0,
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
    .sum((round) => round.roundId);

export const func2 = () => games.sum(({ sets }) => sets.max((set) => set.red) * sets.max((set) => set.green) * sets.max((set) => set.blue));
