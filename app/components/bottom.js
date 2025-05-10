"use client";

import { useGameContext } from "@/context/game-context";
import {
  generateMultipleCards,
  generateSingleCard,
  isRolledCard,
} from "@/utils/utils";

export const Bottom = () => {
  const { gameData, visualGameData, flow } = useGameContext();

  const displayData = flow.rolled ? visualGameData : gameData;

  const totalCards =
    displayData.player?.cards.length > 0 && displayData.player.cards[0] !== ""
      ? displayData.player.cards.length
      : 5;

  const { dices, cards } =
    totalCards > 1
      ? generateMultipleCards(totalCards, displayData.player?.cards)
      : generateSingleCard(displayData.player?.cards);

  const style = totalCards === 2 ? "dice-big" : "dice";

  const checkIfRolledCard = (i) => {
    if (!flow.rolled || !gameData.player?.rolled) return false;
    return isRolledCard(
      i,
      totalCards,
      parseInt(gameData.player.rolled),
      flow.rolled,
    );
  };

  return (
    <div className="wrapper__game__bottom">
      {Array.from(
        { length: process.env.NEXT_PUBLIC_MAX_CARD_AMOUNT },
        (_, i) => (
          <div key={i} className="wrapper__game__bottom__item-bg">
            <div
              className={`wrapper__game__bottom__item-bg__card ${checkIfRolledCard(i) ? "rolled-card" : ""}`}
            >
              {cards[i]}
            </div>
            <div className="absolute bottom-[-14px] w-full h-[30px] flex justify-center">
              <div
                className={`wrapper__game__bottom__item-bg ${style} ${checkIfRolledCard(i) ? "rolled" : ""}`}
              >
                {dices[i]}
              </div>
            </div>
          </div>
        ),
      )}
    </div>
  );
};
