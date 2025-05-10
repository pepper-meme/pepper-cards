"use client";
import Image from "next/image";
import { Loader } from "@/components/loader";
import { useGameContext } from "@/context/game-context";
import { useModal } from "@/context/modal-context";
import { useEffect, useState, useRef } from "react";
import { delay } from "@/utils/utils";

export const RollingModal = () => {
  const [showPlayerDice, setShowPlayerDice] = useState(false);
  const [showOpponentDice, setShowOpponentDice] = useState(false);
  const rollProcessedRef = useRef(false);

  const { gameData, flow, setFlow, setVisualGameData } = useGameContext();

  const { closeModal } = useModal();

  useEffect(() => {
    const processRollResult = async () => {
      if (
        flow.rolled &&
        gameData.gameStatus > 1 &&
        gameData.gameStatus !== 1000 &&
        gameData.player?.rolled &&
        !rollProcessedRef.current
      ) {
        rollProcessedRef.current = true;
        setShowPlayerDice(true);
        setShowOpponentDice(true);

        await delay(3000);

        setFlow((prevFlow) => ({ ...prevFlow, rolled: false, result: true }));
        closeModal();
      }
    };

    processRollResult();
  }, [flow.rolled, gameData, closeModal, setFlow, setVisualGameData]);

  useEffect(() => {
    if (!flow.rolling && !flow.rolled && !flow.result) {
      setShowPlayerDice(false);
      setShowOpponentDice(false);
      closeModal();
    }
  }, [flow.rolling, flow.rolled]);

  return (
    <div className="wrapper__game__rolling">
      <div className="wrapper__game__rolling__top">
        {flow.rolling ? "Rolling..." : "Rolled!"}
      </div>
      <div className="wrapper__game__rolling__slot">
        {!showPlayerDice && <Loader />}
        {showPlayerDice && gameData.player?.rolled && (
          <Image
            src={`/assets/dice/dice-${gameData.player?.rolled}.svg`}
            alt=""
            width={106}
            height={0}
          />
        )}
        <span>You</span>
      </div>
      <Image
        src="/assets/separator.png"
        alt=""
        width={20}
        height={258}
        className="wrapper__game__rolling__separator"
      />
      <div className="wrapper__game__rolling__slot">
        {!showOpponentDice && <Loader />}
        {showOpponentDice && gameData.opponent?.rolled && (
          <Image
            src={`/assets/dice/dark/dice-${gameData.opponent?.rolled}.svg`}
            alt=""
            width={106}
            height={0}
          />
        )}
        <span>Opponent</span>
      </div>
    </div>
  );
};
