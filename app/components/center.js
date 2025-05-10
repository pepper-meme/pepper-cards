"use client";

import Image from "next/image";
import { useGameContext } from "@/context/game-context";
import { useEffect, useState } from "react";
import { useModal } from "@/context/modal-context";
import { delay } from "@/utils/utils";

export const Center = () => {
  const { gameData, flow, setFlow, setVisualGameData } = useGameContext();

  const [playerCardScore, setPlayerCardScore] = useState(0);
  const [opponentCardScore, setOpponentCardScore] = useState(0);

  const { closeModal } = useModal();

  useEffect(() => {
    if (flow.result && !flow.final) {
      setVisualGameData((prev) => ({ ...prev, gameData }));
      setPlayerCardScore(Number(gameData.player?.card));
      setOpponentCardScore(Number(gameData.opponent?.card));

      if (gameData.gameStatus == 1000 && !flow.final) {
        const showingRollingModal = async () => {
          await delay(3000);
          setFlow((prevFlow) => ({ ...prevFlow, result: false, final: true }));
          closeModal();
        };
        showingRollingModal();
      }
    }
  }, [
    flow.result,
    gameData?.gameStatus,
    gameData?.player?.card,
    gameData?.opponent?.card,
  ]);

  useEffect(() => {
    if (gameData?.player?.card) {
      setPlayerCardScore(Number(gameData.player.card));
    } else {
      setPlayerCardScore(0);
    }

    if (gameData?.opponent?.card) {
      setOpponentCardScore(Number(gameData.opponent.card));
    } else {
      setOpponentCardScore(0);
    }
  }, [gameData?.player?.card, gameData?.opponent?.card]);

  const playerCard = (
    <div className="relative">
      <div
        className={`card-score ${playerCardScore > opponentCardScore ? "card-score__won" : ""}`}
      >
        {playerCardScore !== 0 && playerCardScore}
      </div>
      {playerCardScore !== 0 && (
        <Image
          src={`/assets/cards/${playerCardScore}.png`}
          alt=""
          width={600}
          height={0}
        />
      )}
    </div>
  );

  const opponentCard = (
    <div className="relative">
      <div
        className={`card-score ${playerCardScore < opponentCardScore ? "card-score__won" : ""}`}
      >
        {opponentCardScore !== 0 && opponentCardScore}
      </div>
      {opponentCardScore !== 0 && (
        <Image
          src={`/assets/cards/${opponentCardScore}.png`}
          alt=""
          width={600}
          height={0}
        />
      )}
    </div>
  );

  return (
    <div className="flex items-center justify-center gap-36 w-full h-[90%]">
      <div className="wrapper__game__center">
        <div className="wrapper__game__center__card">
          {playerCardScore !== 0 ? playerCard : ""}
        </div>
        <span className="absolute bottom-[-40px]">You</span>
      </div>
      <div className="wrapper__game__center">
        <div className="wrapper__game__center__card">
          {opponentCardScore !== 0 ? opponentCard : ""}
        </div>
        <span className="absolute bottom-[-40px] right-0">Opponent</span>
      </div>
    </div>
  );
};
