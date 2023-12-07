import { readInputs } from "../../util/input";

const [input, testInput] = readInputs(__dirname);
const TEST = false;

const cardStrengths = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
const cardStrengths2 = ["J", "2", "3", "4", "5", "6", "7", "8", "9", "T", "Q", "K", "A"];
const combos = ["HIGH", "1x2", "2x2", "3", "FH", "4", "5"];

const raw = TEST ? testInput : input;
const games = raw.map((game) => game.split(" "));

const getHighCard = (handA: string, handB: string, cardStrengths: string[]) => {
  for (let cardIdx = 0; cardIdx < handA.length; cardIdx++)
    if (handA[cardIdx] !== handB[cardIdx]) return cardStrengths.indexOf(handA[cardIdx]) - cardStrengths.indexOf(handB[cardIdx]);
  return 0;
};

const upgrade = (value: string) => {
  switch (value) {
    case "5":
    case "4":
      return "5";
    case "FH":
    case "3":
      return "4";
    case "2x2":
      return "FH";
    case "1x2":
      return "3";
    default:
      return "1x2";
  }
};

const getHandValue = (hand: string) => {
  if (/(.)\1{4}/g.test(hand)) return "5";
  if (/(.)\1{3}/g.test(hand.split("").sort().join(""))) return "4";
  const two =
    hand
      .split("")
      .sort()
      .join("")
      .match(/(.)\1{1}/g)?.length ?? 0;
  if (/(.)\1{2}/g.test(hand.split("").sort().join(""))) {
    if (two === 2) return "FH";
    return "3";
  }
  if (two === 2) return "2x2";
  if (two) return "1x2";
  return "HIGH";
};

const sortPlayers = ([handA, _A, valueA]: string[], [handB, _B, valueB]: string[], cardStrengths: string[]) =>
  combos.indexOf(valueA) - combos.indexOf(valueB)
    ? combos.indexOf(valueA) - combos.indexOf(valueB)
    : getHighCard(handA, handB, cardStrengths);

export const func1 = () =>
  games
    .map(([hand, bid]) => [hand, bid, getHandValue(hand)])
    .sort((a, b) => sortPlayers(a, b, cardStrengths))
    .reduce((acc, [_, bid], idx) => acc + parseInt(bid) * (idx + 1), 0);

export const func2 = () =>
  games
    .map(([hand, bid]) => [
      hand,
      bid,
      getHandValue(
        hand
          .split("")
          .filter((c) => c !== "J")
          .join("")
      ),
    ])
    .map(([hand, bid, value]) => {
      for (let index = 0; index < (hand.match(/J/g)?.length ?? 0); index++) value = upgrade(value);
      return [hand, bid, value];
    })
    .sort((a, b) => sortPlayers(a, b, cardStrengths2))
    .reduce((acc, [_, bid], idx) => acc + parseInt(bid) * (idx + 1), 0);
