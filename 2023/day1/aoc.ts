import { readInputs } from "../../util/input";
import "../../util/helpers";

const [input, testInput] = readInputs(__dirname);
const TEST = false;

const chars = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

const parseInput = () => {
  const raw = TEST ? testInput : input;

  return raw;
};
const parsed = parseInput();

export const func1 = () =>
  parsed.reduce((acc, curr) => {
    const filtered = curr.split("").filter((char) => char.isNumber());
    return acc + parseInt(filtered[0] + filtered.last());
  }, 0);

export const func2 = () =>
  parsed.reduce((sum, row) => {
    const firstDigit = chars.reduce(
      (winner, char) =>
        (row.indexOf(char) !== -1 && row.indexOf(char) < row.indexOf(winner)) || row.indexOf(winner) === -1 ? char : winner,
      "1"
    );
    const secondDigit = chars.reduce((winner, char) => (row.lastIndexOf(char) > row.lastIndexOf(winner) ? char : winner), "1");

    return sum + parseInt(`${(chars.indexOf(firstDigit) % 9) + 1}` + `${(chars.indexOf(secondDigit) % 9) + 1}`);
  }, 0);
