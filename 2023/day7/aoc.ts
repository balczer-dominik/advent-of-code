import { readInputs } from "../../util/input";
import "../../util/helpers";

const [input, testInput] = readInputs(__dirname);
const TEST = false;

const cardStrengths = "23456789TJQKA";
const cardStrengths2 = "J23456789TQKA";
const combos = ["HIGH", "1x2", "2x2", "3", "FH", "4", "5"];

const raw = TEST ? testInput : input;
const games = raw.map((game) => game.split(" "));

const getHighCard = (handA: string, handB: string, cardStrengths: string) => {
  for (let cardIdx = 0; cardIdx < handA.length; cardIdx++)
    if (handA[cardIdx] !== handB[cardIdx]) return cardStrengths.indexOf(handA[cardIdx]) - cardStrengths.indexOf(handB[cardIdx]);
  return 0;
};

const upgrade = (value: string) => {
  switch (value) {
    case "5":
    case "4":
      return "5";
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

const sortPlayers = ([handA, _A, valueA]: string[], [handB, _B, valueB]: string[], cardStrengths: string) =>
  combos.indexOf(valueA) - combos.indexOf(valueB)
    ? combos.indexOf(valueA) - combos.indexOf(valueB)
    : getHighCard(handA, handB, cardStrengths);

export const func1 = () =>
  games
    .map(([hand, bid]) => [hand, bid, getHandValue(hand)])
    .sort((a, b) => sortPlayers(a, b, cardStrengths))
    .sum(([_, bid], idx) => parseInt(bid) * (idx + 1));

export const func2 = () =>
  games
    .map(([hand, bid]) => {
      let value = getHandValue(
        hand
          .split("")
          .filter((c) => c !== "J")
          .join("")
      );
      for (let index = 0; index < (hand.match(/J/g)?.length ?? 0); index++) value = upgrade(value);
      return [hand, bid, value];
    })
    .sort((a, b) => sortPlayers(a, b, cardStrengths2))
    .sum(([_, bid], idx) => parseInt(bid) * (idx + 1));
