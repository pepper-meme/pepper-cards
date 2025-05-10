"use client";
import { useState, useEffect } from "react";
import { useModal } from "@/context/modal-context";
import { useGameContext } from "@/context/game-context";
import { toNiceString } from "@/utils/utils";
import Image from "next/image";
import { RollingModal } from "@/components/rolling-modal";
import { FinalModal } from "@/components/final-modal";
import { Loader } from "@/components/loader";
import { BannerModal } from "@/components/banner-modal";

export const Right = ({ handleLogin, isConnected }) => {
  const [amount, setAmount] = useState(100);
  const [limits, setLimits] = useState([100]);
  const [showOnlyBet, setShowOnlyBet] = useState(true);
  const [currentLimitIndex, setCurrentLimitIndex] = useState(0);

  const {
    playerData,
    gameData,
    betGame,
    dealGameCards,
    rollGameDices,
    loading,
    flow,
    setFlow,
    surrenderGame,
    error,
  } = useGameContext();
  const { openModal, closeModal } = useModal();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_LIMITS) {
      const parsedLimits =
        process.env.NEXT_PUBLIC_LIMITS.split(",").map(Number);
      setLimits(parsedLimits);
      setAmount(parsedLimits[0]);
    }
  }, []);

  const decreaseAmount = () => {
    if (currentLimitIndex > 0) {
      setCurrentLimitIndex(currentLimitIndex - 1);
      setAmount(limits[currentLimitIndex - 1]);
    }
  };

  const increaseAmount = () => {
    if (currentLimitIndex < limits.length - 1) {
      setCurrentLimitIndex(currentLimitIndex + 1);
      setAmount(limits[currentLimitIndex + 1]);
    }
  };

  const { balance } = playerData || {};
  const coinsBalance = balance?.[0]?.amount;

  useEffect(() => {
    if (flow.final) {
      openModal({
        content: <FinalModal />,
        isModalBg: true,
      });
      setShowOnlyBet(true);
    }
  }, [flow.final]);

  useEffect(() => {
    if (flow.rolling) {
      openModal({
        content: <RollingModal />,
      });
      setShowOnlyBet(true);
    }
  }, [flow.rolling]);

  useEffect(() => {
    if (error.roll) {
      setShowOnlyBet(true);
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
    }
  }, [error.roll]);

  useEffect(() => {
    if (flow.surrender) {
      openModal({
        content: <FinalModal surrender={true} />,
        isModalBg: true,
      });
    }
  }, [flow.surrender]);

  useEffect(() => {
    if (balance?.[0].amount < 100) {
      openModal({
        content: <BannerModal />,
        isModalBg: true,
      });
    }
  }, [balance, coinsBalance]);

  const handleRollButtonName = () => {
    if (flow.rolling) return "Rolling...";
    if (flow.rolled) return `Rolled: ${gameData.player.rolled}!`;
    return "Roll";
  };

  return (
    <>
      <div className="wrapper__game__right">
        {!isConnected && (
          <button
            onClick={handleLogin}
            className="wrapper__game__right__connect"
          >
            Connect
            <br />
            Wallet
          </button>
        )}

        {isConnected &&
          gameData.gameStatus >= 2 &&
          gameData.gameStatus != 1000 && (
            <button
              onClick={() => {
                setFlow({
                  bet: false,
                  deal: false,
                  roll: false,
                  rolling: false,
                  rolled: false,
                  result: false,
                  final: false,
                  surrender: false,
                });
                setShowOnlyBet(true);
                surrenderGame();
              }}
              className="wrapper__game__right__surrender"
            >
              {!loading.surrender ? (
                <span>Surrender</span>
              ) : (
                <Loader width={32} className="loader-surrender" />
              )}
            </button>
          )}

        {isConnected && (gameData.gameStatus == 0 || gameData.gameStatus == 1000) && showOnlyBet && (
          <button
            onClick={() => setShowOnlyBet(false)}
            className="wrapper__game__right__connect wrapper__game__right__connect__pepper"
          >
            <span>Bet</span>
          </button>
        )}

        {isConnected &&
          gameData.gameStatus != 1000 &&
          gameData.gameStatus != 0 && (
            <div className="wrapper__game__right__chest">
              <Image src="/assets/chest.svg" alt="" width={57} height={0} />
              <span>{`${toNiceString(gameData.bet * 2)} ${playerData?.balance?.[0]?.coin}`}</span>
            </div>
          )}

        {isConnected &&
          (gameData.gameStatus == 0 || gameData.gameStatus == 1000) &&
          !showOnlyBet && (
            <button
              onClick={() => {
                betGame(amount);
              }}
              className="wrapper__game__right__connect wrapper__game__right__connect__pepper"
            >
              <span>{`Bet ${toNiceString(amount)}`}</span>
              {loading.bet && (
                <>
                  <Image
                    src="/assets/loader.svg"
                    alt=""
                    width={110}
                    height={0}
                    className="loader"
                  />
                  <div className="loader-bg"></div>
                </>
              )}
            </button>
          )}

        {isConnected && gameData.gameStatus == 1 && (
          <button
            disabled={loading.deal}
            onClick={() => {
              dealGameCards();
            }}
            className="wrapper__game__right__connect wrapper__game__right__connect__pepper"
          >
            <span>Deal</span>
            {loading.deal && (
              <>
                <Image
                  src="/assets/loader.svg"
                  alt=""
                  width={110}
                  height={0}
                  className="loader"
                />
                <div className="loader-bg"></div>
              </>
            )}
          </button>
        )}

        {isConnected &&
          gameData.gameStatus > 1 &&
          gameData.gameStatus != 1000 && (
            <button
              disabled={flow.roll || flow.surrender}
              onClick={() => {
                rollGameDices();
              }}
              className="wrapper__game__right__connect wrapper__game__right__connect__roll"
            >
              <span>{handleRollButtonName()}</span>
              {flow.rolling && (
                <>
                  <Image
                    src="/assets/loader.svg"
                    alt=""
                    width={110}
                    height={0}
                    className="loader"
                  />
                  <div className="loader-bg"></div>
                </>
              )}
            </button>
          )}
      </div>

      {isConnected &&
        (gameData.gameStatus == 0 || gameData.gameStatus == 1000) &&
        !showOnlyBet && (
          <div className="bet-module">
            <span>Amount to bet</span>
            <div className="relative w-[203px]">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={100}
                step={100}
              />
              <button
                onClick={decreaseAmount}
                className="bet-module__button-left"
              >
                <Image
                  src="/assets/arrow-left.svg"
                  alt=""
                  width={15}
                  height={0}
                  className="bet-module__arrow"
                />
              </button>
              <button
                onClick={increaseAmount}
                className="bet-module__button-right"
              >
                <Image
                  src="/assets/arrow-right.svg"
                  alt=""
                  width={15}
                  height={0}
                  className="bet-module__arrow"
                />
              </button>
            </div>
            <span className="bet-module__balance">{`Balance: ${toNiceString(playerData?.balance?.[0]?.amount)} ${playerData?.balance?.[0]?.coin}`}</span>
          </div>
        )}
    </>
  );
};
