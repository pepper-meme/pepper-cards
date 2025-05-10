import Image from "next/image";

export const shortenString = (str, startChars = 6, endChars = 4) => {
  if (!str) return "";
  if (str.length <= startChars + endChars) return str;

  return str.slice(0, startChars) + "..." + str.slice(-endChars);
};

export const toNiceString = (value) => {
  if (value == null) {
    return "0";
  }
  value = BigInt(value);
  const length = BigInt(value.toString().length);
  if (length < 4n) {
    return value.toString();
  } else if (length === 4n) {
    return (value / 1000n).toString() + "." + (value % 1000n).toString();
  }
  const digits = value / 10n ** (length - 3n);
  const letter = "KMBT"[Number((length - 1n) / 3n - 1n)];
  const d3 = ((length - 1n) / 3n) * 3n;
  const afterDot = 3n - length + d3;
  if (afterDot === 0n) {
    return digits.toString() + letter;
  } else if (afterDot === 1n) {
    if (digits % 10n > 0n) {
      return (
        (digits / 10n).toString() + "." + (digits % 10n).toString() + letter
      );
    } else {
      return (digits / 10n).toString() + letter;
    }
  } else {
    if (digits % 100n > 9n) {
      if (digits % 10n > 0n) {
        return (
          (digits / 100n).toString() + "." + (digits % 100n).toString() + letter
        );
      } else {
        return (
          (digits / 100n).toString() +
          "." +
          ((digits % 100n) / 10n).toString() +
          letter
        );
      }
    } else if (digits % 100n > 0n) {
      return (
        (digits / 100n).toString() + ".0" + (digits % 10n).toString() + letter
      );
    } else {
      return (digits / 100n).toString() + letter;
    }
  }
};

export const generateMultipleCards = (totalCards, cards) => {
  const dices = [];
  const cardImages = [];

  Array.from({ length: 6 }, (_, dice) => {
    const diceNum = dice + 1;
    const index = (diceNum % totalCards || totalCards) - 1;

    dices[index] = dices[index] || [];

    if (dices[index].length > 0) {
      dices[index].push(<span key={`span${diceNum}`}>/</span>);
    }

    dices[index].push(
      <Image
        key={diceNum}
        src={`/assets/dice/dice-${diceNum}.svg`}
        alt=""
        width={24}
        height={24}
      />,
    );

    if (!cardImages[index] && cards?.[index]) {
      cardImages[index] = (
        <Image
          src={`/assets/cards/${cards[index]}.png`}
          alt=""
          width={600}
          height={0}
        />
      );
    }
  });

  return { dices, cards: cardImages };
};

export const generateSingleCard = (cards) => {
  const dices = ["All"];
  const cardImages = [];

  if (cards?.[0]) {
    cardImages[0] = (
      <Image
        src={`/assets/cards/${cards[0]}.png`}
        alt=""
        width={600}
        height={0}
      />
    );
  }

  return { dices, cards: cardImages };
};

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const isRolledCard = (i, totalCards, rolledDice, hasRolled) => {
  if (!hasRolled || !rolledDice) return false;

  switch (totalCards) {
    case 5: // 5 cards: dice 1/6 → card 0, dice 2 → card 1, dice 3 → card 2, dice 4 → card 3, dice 5 → card 4
      return (
        ((rolledDice === 1 || rolledDice === 6) && i === 0) ||
        (rolledDice === 2 && i === 1) ||
        (rolledDice === 3 && i === 2) ||
        (rolledDice === 4 && i === 3) ||
        (rolledDice === 5 && i === 4)
      );

    case 4: // 4 cards: dice 1/5 → card 0, dice 2/6 → card 1, dice 3 → card 2, dice 4 → card 3
      return (
        ((rolledDice === 1 || rolledDice === 5) && i === 0) ||
        ((rolledDice === 2 || rolledDice === 6) && i === 1) ||
        (rolledDice === 3 && i === 2) ||
        (rolledDice === 4 && i === 3)
      );

    case 3: // 3 cards: dice 1/4 → card 0, dice 2/5 → card 1, dice 3/6 → card 2
      return (
        ((rolledDice === 1 || rolledDice === 4) && i === 0) ||
        ((rolledDice === 2 || rolledDice === 5) && i === 1) ||
        ((rolledDice === 3 || rolledDice === 6) && i === 2)
      );

    case 2: // 2 cards: dice 1/3/5 → card 0, dice 2/4/6 → card 1
      return (
        ((rolledDice === 1 || rolledDice === 3 || rolledDice === 5) &&
          i === 0) ||
        ((rolledDice === 2 || rolledDice === 4 || rolledDice === 6) && i === 1)
      );

    case 1: // 1 card: All dice → card 0
      return i === 0;

    default:
      return false;
  }
};
