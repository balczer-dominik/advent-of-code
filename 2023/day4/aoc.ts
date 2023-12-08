import { readInputs } from "../../util/input";
import { simpleParseInt, sumNumbers } from "../../util/helpers";

const [input, testInput] = readInputs(__dirname);
const TEST = false;

const raw = TEST ? testInput : input;

const cards = raw.map((row) => {
  const [cardIdRaw, numbersRaw] = row.split(":");
  const [winningNumbersRaw, myNumbersRaw] = numbersRaw.split("|");
  return {
    cardId: cardIdRaw.split("Card")[1].trim().toNumber(),
    winningNumbers: winningNumbersRaw
      .split(" ")
      .filter((x) => x !== "")
      .map(simpleParseInt),
    myNumbers: myNumbersRaw
      .split(" ")
      .filter((x) => x !== "")
      .map(simpleParseInt),
  };
});

export const func1 = () =>
  cards.reduce((acc, card) => {
    const value = card.myNumbers.filter((number) => card.winningNumbers.includes(number)).length;
    return acc + (value === 0 ? 0 : Math.pow(2, value - 1));
  }, 0);

export const func2 = () => {
  const cardValues = cards.reduce(
    (acc, card) => ({ ...acc, [card.cardId]: card.myNumbers.filter((number) => card.winningNumbers.includes(number)).length }),
    {} as { [key: number]: number }
  );
  const resultCards = new Map<number, number>();
  cards.forEach((card) => resultCards.set(card.cardId, 1));

  cards.forEach((card) => {
    const value = cardValues[card.cardId]!;
    if (value === 0) return;

    cards
      .slice(card.cardId, card.cardId + value)
      .map((c) => c.cardId)
      .forEach((cardId) => resultCards.set(cardId, resultCards.get(cardId)! + resultCards.get(card.cardId)!));
  });

  return [...resultCards.values()].sum();
};
