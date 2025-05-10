import Image from "next/image";
import { useGameContext } from "@/context/game-context";
import { Loader } from "@/components/loader";

export const BannerModal = () => {
  const { getFreeCoins, loading } = useGameContext();

  return (
    <div className="flex flex-col justify-center items-center">
      <button
        onClick={() => {
          getFreeCoins();
        }}
      >
        {loading.freeCoins && <Loader />}
        <Image
          src="/assets/banner.png"
          alt=""
          width={449}
          height={0}
          className=""
        />
      </button>
      <div className="info-block">
        <Image src="/assets/info-icon.svg" alt="" width={24} height={0} />
        {`You've got demo coins! Grab your welcome gift to jump into the fun!`}
      </div>
    </div>
  );
};
