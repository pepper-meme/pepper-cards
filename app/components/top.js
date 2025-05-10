"use client";

import { useGameContext } from "@/context/game-context";
import {
  generateMultipleCards,
  generateSingleCard,
  isRolledCard,
} from "@/utils/utils";

export const Top = () => {
  const { gameData, flow, visualGameData } = useGameContext();

  const displayData = flow.rolled ? visualGameData : gameData;

  const totalCards =
    displayData.opponent?.cards.length > 0 &&
    displayData.opponent.cards[0] !== ""
      ? displayData.opponent.cards.length
      : 5;

  const { dices, cards } =
    totalCards > 1
      ? generateMultipleCards(totalCards, displayData.opponent?.cards)
      : generateSingleCard(displayData.opponent?.cards);

  const checkIfRolledCard = (i) => {
    if (!flow.rolled || !gameData.opponent?.rolled) return false;
    return isRolledCard(
      i,
      totalCards,
      parseInt(gameData.opponent.rolled),
      flow.rolled,
    );
  };

  return (
    <div className="wrapper__game__top__cards-bg">
      <div className="wrapper__game__top__cards">
        {Array.from(
          { length: process.env.NEXT_PUBLIC_MAX_CARD_AMOUNT },
          (_, i) => (
            <div key={i} className="wrapper__game__top__item-bg">
              <div
                className={`wrapper__game__bottom__item-bg__card ${checkIfRolledCard(i) ? "rolled-card" : ""}`}
              >
                {cards[i]}
              </div>
              <div className="w-full h-[30px] flex justify-center absolute top-[-14px]">
                <div
                  className={`wrapper__game__top__item-bg ${totalCards === 2 ? "dice-big" : "dice"} ${checkIfRolledCard(i) ? "rolled" : ""} : ""}`}
                >
                  {dices[i]}
                </div>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
};
