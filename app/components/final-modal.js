"use client";
import { useGameContext } from "@/context/game-context";
import { useModal } from "@/context/modal-context";
import Image from "next/image";

export const FinalModal = ({ surrender }) => {
  const { gameData, setFlow } = useGameContext();
  const { closeModal } = useModal();

  const handleTitle = () => {
    if (gameData.player.score > gameData.opponent.score) {
      return "You won!";
    }
    if (gameData.player.score < gameData.opponent.score || surrender) {
      return "You lost!";
    }
    if (gameData.player.score == gameData.opponent.score) {
      return "It's a draw!";
    }
    return "Game Over!";
  };

  return (
    <div className="wrapper__game__rolling">
      <div className="wrapper__game__rolling__top">{handleTitle()}</div>
      <div className="flex flex-col items-center justify-center gap-8">
        {!surrender && (
          <div className="flex items-center justify-center gap-8">
            <div className="wrapper__game__rolling__slot">
              <span>You</span>
              <div className="relative flex items-center justify-center">
                <div
                  className={`card-score card-score__final ${
                    gameData.player.score > gameData.opponent.score
                      ? "card-score__won"
                      : ""
                  }`}
                >
                  {gameData.player.score}
                </div>
              </div>
            </div>
            <span>-</span>
            <div className="wrapper__game__rolling__slot">
              <span>Opponent</span>
              <div className="relative">
                <div
                  className={`card-score card-score__final ${
                    gameData.opponent.score > gameData.player.score
                      ? "card-score__won"
                      : ""
                  }`}
                >
                  {gameData.opponent.score}
                </div>
              </div>
            </div>
          </div>
        )}
        {gameData.player.score > gameData.opponent.score && !surrender && (
          <div className="flex flex-col items-center gap-8">
            <span className="wrapper__game__rolling__title">
              Congratulations! you won the round
            </span>
            <div className="flex gap-4 items-center justify-center">
              <div className="wrapper__game__rolling__prize">
                <Image
                  src="/assets/coins/coin-pepper.svg"
                  alt=""
                  width={40}
                  height={0}
                />
                {gameData.bet * 2}
              </div>
              <span className="w-1/3 wrapper__game__rolling__subtitle">
                added to your pocket
              </span>
            </div>
          </div>
        )}
        {surrender && (
          <div className="flex flex-col items-center gap-8">
            <span className="wrapper__game__rolling__title">
              {`Don't hang your head — keep fighting!`}
            </span>
            <div className="flex gap-4 items-center justify-center">
              <div className="wrapper__game__rolling__prize">
                <Image
                  src="/assets/coins/coin-pepper.svg"
                  alt=""
                  width={40}
                  height={0}
                />
                {gameData.bet}
              </div>
              <span className="w-1/3 wrapper__game__rolling__subtitle">
                You lost your bet
              </span>
            </div>
          </div>
        )}
        {gameData.player.score < gameData.opponent.score && !surrender && (
          <span className="wrapper__game__rolling__title">
            Better luck next time! Time to show pepper whos boss!
          </span>
        )}
        <button
          onClick={() => {
            closeModal();
            setFlow({
              bet: false,
              deal: false,
              roll: false,
              rolling: false,
              rolled: false,
              result: false,
              final: false,
              surrender: false,
              freeCoins: false,
            });
          }}
          className="wrapper__game__rolling__button"
        >
          <span>Next Round</span>
        </button>
      </div>
    </div>
  );
};
