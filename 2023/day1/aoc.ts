import { readInputs } from "../../util/input";
import "../../util/helpers";

const [input, testInput] = readInputs(__dirname);
const TEST = false;

const chars = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

const rows = TEST ? testInput : input;

export const func1 = () =>
  rows.sum((row) => {
    const filtered = row.split("").filter((char) => char.isNumber());
    return parseInt(filtered[0] + filtered.last());
  });

export const func2 = () =>
  rows.sum((row) => {
    const firstDigit = chars.reduce(
      (winner, char) =>
        (row.indexOf(char) !== -1 && row.indexOf(char) < row.indexOf(winner)) || row.indexOf(winner) === -1 ? char : winner,
      "1"
    );
    const secondDigit = chars.reduce((winner, char) => (row.lastIndexOf(char) > row.lastIndexOf(winner) ? char : winner), "1");
    return parseInt(`${(chars.indexOf(firstDigit) % 9) + 1}` + `${(chars.indexOf(secondDigit) % 9) + 1}`);
  });
