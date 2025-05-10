"use client";
import Image from "next/image";
import { useGameContext } from "@/context/game-context";
import { toNiceString, shortenString } from "@/utils/utils";

export const UserInfo = ({ handleLogin }) => {
  const { playerData, gameData } = useGameContext();

  return (
    <div
      className="wrapper__game__user"
      onClick={handleLogin}
    >
      <div>
        <span>You</span>
        <span>{shortenString(playerData.address)}</span>
      </div>
      <div className="wrapper__game__user__wrapper">
        {playerData?.balance?.length > 0 &&
          playerData?.balance?.map(({ coin, amount }, index) => (
            <div className="wrapper__game__user__coin" key={index}>
              <Image
                src={`/assets/coins/coin-${coin}.svg`}
                alt={coin}
                width={20}
                height={0}
              />
              <span>{toNiceString(amount)}</span>
            </div>
          ))}
      </div>
      <div className="wrapper__game__top__opponent__victories">
        <Image src="/assets/cup.svg" alt="" width={34} height={0} />
        <span className="text-[#F5EDC9]">{gameData.player?.score}</span>
        <span>victories</span>
      </div>
    </div>
  );
};
