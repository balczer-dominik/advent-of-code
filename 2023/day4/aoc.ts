import { readInputs } from "../../util/input";
import { simpleParseInt } from "../../util/helpers";

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
  cards.sum((card) => {
    const value = card.myNumbers.filter((number) => card.winningNumbers.includes(number)).length;
    return value === 0 ? 0 : Math.pow(2, value - 1);
  });

export const func2 = () => {
  const cardValues = cards.toObject(
    (card) => card.cardId,
    (card) => card.myNumbers.filter((number) => card.winningNumbers.includes(number)).length
  );
  const resultCards = new Map<number, number>();
  cards.forEach((card) => resultCards.set(card.cardId, 1));

  cards.forEach(({ cardId }) => {
    const value = cardValues[cardId]!;
    if (value === 0) return;

    cards
      .slice(cardId, cardId + value)
      .forEach(({ cardId: cId }) => resultCards.set(cId, resultCards.get(cId)! + resultCards.get(cardId)!));
  });

  return [...resultCards.values()].sum();
};
