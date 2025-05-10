"use client";
import Image from "next/image";
import { useGameContext } from "@/context/game-context";

export const Opponent = () => {
  const { opponentData, gameData } = useGameContext();

  return (
    <div className="wrapper__game__top__opponent">
      <div className="relative">
        <Image
          className="wrapper__game__top__opponent__avatar-frame"
          src="/assets/opponent-frame.svg"
          alt=""
          width={149}
          height={204}
        />
        <div className="wrapper__game__top__opponent__avatar-wrapper">
          <Image
            className="wrapper__game__top__opponent__avatar"
            src={`/assets/cards/${opponentData.id}.png`}
            alt=""
            width={600}
            height={0}
          />
        </div>
        <div className="wrapper__game__top__opponent__avatar-frame__gold-circle"></div>
      </div>
      <div className="wrapper__game__top__opponent__info">
        <span className="wrapper__game__top__opponent__subtitle">Opponent</span>
        <span className="wrapper__game__top__opponent__title">
          {opponentData.title}
        </span>
        <div className="wrapper__game__top__opponent__victories">
          <Image src="/assets/cup.svg" alt="" width={34} height={0} />
          <span>{gameData.opponent?.score}</span>
          <span className="text-[#B7B194]">victories</span>
        </div>
      </div>
    </div>
  );
};
