"use client";

import "./styles.scss";
import { GameProvider } from "@/context/game-context";
import { ModalProvider } from "@/context/modal-context";
import { getAppKit, useAppKitAccount, useAppKitProvider } from "@/api/wallet";

import { Top } from "@/components/top";
import { Opponent } from "@/components/opponent";
import { Center } from "@/components/center";
import { Left } from "@/components/left";
import { Right } from "@/components/right";
import { UserInfo } from "@/components/user-info";
import { Bottom } from "@/components/bottom";

const HomePage = () => {
  const { address, isConnected } = useAppKitAccount();
  const provider = useAppKitProvider("eip155");

  const handleLogin = () => {
    getAppKit().open();
  };

  return (
    <GameProvider
      walletProvider={provider.walletProvider}
      address={address}
      isConnected={isConnected}
    >
      <ModalProvider>
        <div className="wrapper">
          <div className="wrapper__game">
            <Top />
            <Opponent />
            <Center />
            <Left />
            <Right handleLogin={handleLogin} isConnected={isConnected} />
            {isConnected && <UserInfo handleLogin={handleLogin} />}
            <Bottom />
          </div>
        </div>
      </ModalProvider>
    </GameProvider>
  );
};

export default HomePage;
