"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  currentGameInfo,
  currentTokenAmount,
  deal,
  bet,
  roll,
  surrender,
  freeCoins,
} from "@/api/game";
import opponents from "@/data/opponents";

/*
       gameStatus: 0,  0 - new player, 1000 - game finished, 1 - bet made, 2 - cards delt, 3... - 1'st, 2-nd rolls
       bet: - amount betted,
       player: {
           cards: array of card ids
           card: id of card played
           rolled: number rolled out
           score: current score
       },
       opponent: {
           cards: array of card ids
           card: id of card played
           rolled: number rolled out
           score: current score
       }
   */

const GameContext = createContext(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};

export function GameProvider({
  walletProvider,
  address,
  isConnected,
  children,
}) {
  const [gameData, setGameData] = useState({ gameStatus: 0 });
  const [opponentData, setOpponentData] = useState(opponents[0]);
  const [playerData, setPlayerData] = useState({});
  const [visualGameData, setVisualGameData] = useState({ gameStatus: 0 });
  const [loading, setLoading] = useState({
    bet: false,
    deal: false,
    roll: false,
    surrender: false,
    game: false,
  });
  const [error, setError] = useState({
    bet: false,
    deal: false,
    roll: false,
    surrender: false,
    game: false,
  });
  const [flow, setFlow] = useState({
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

  const updateGameDetails = () => {
    setLoading({ ...loading, game: true });
    currentGameInfo(address, walletProvider)
      .then((gameInfo) => {
        setGameData(gameInfo);
      })
      .catch((error) => {
        setError({ ...error, game: true });
      })
      .finally(() => {
        setLoading({ ...loading, game: false });
      });
  };

  const updatePlayerDetails = () => {
    setLoading({ ...loading, game: true });
    currentTokenAmount(address, walletProvider)
      .then((tokenAmount) => {
        setPlayerData({
          address: address,
          balance: [
            { coin: process.env.NEXT_PUBLIC_TOKEN_NAME, amount: tokenAmount },
          ],
        });
      })
      .catch((error) => {
        setError({ ...error, game: true });
      })
      .finally(() => {
        setLoading({ ...loading, game: false });
      });
  };

  useEffect(() => {
    setOpponentData(opponents[Math.floor(Math.random() * opponents.length)]);
  }, []);

  useEffect(() => {
    if (!isConnected) {
      setGameData({ gameStatus: 0 });
      setPlayerData({});
    } else {
      updateGameDetails();
      updatePlayerDetails();
    }
  }, [isConnected]);

  const betGame = (amount) => {
    setLoading({ ...loading, bet: true });
    setFlow({ ...flow, bet: true });
    bet(address, amount, walletProvider)
      .then(() => {
        updateGameDetails();
      })
      .catch((error) => {
        console.error("Bet error:", error);
        setError({ ...error, bet: true });
      })
      .finally(() => {
        setLoading({ ...loading, bet: false });
        setFlow({ ...flow, bet: false });
      });
  };

  const dealGameCards = () => {
    setLoading({ ...loading, deal: true });
    setFlow({ ...flow, deal: true });
    deal(address, walletProvider)
      .then(() => {
        updateGameDetails();
      })
      .catch((error) => {
        setError({ ...error, deal: true });
        console.error("Deal error:", error);
      })
      .finally(() => {
        setLoading({ ...loading, deal: false });
        setFlow({ ...flow, deal: false });
      });
  };

  const rollGameDices = () => {
    setVisualGameData(gameData);
    setFlow({ ...flow, rolling: true });
    roll(address, walletProvider)
      .then(() => {
        updateGameDetails();
        setFlow({ ...flow, rolling: false, rolled: true });
      })
      .catch((error) => {
        setError({ ...error, roll: true });
        setFlow({ ...flow, rolling: false, rolled: false });
        console.error("Roll error:", error);
      })
      .finally(() => {});
  };

  const surrenderGame = () => {
    setLoading({ ...loading, surrender: true });
    surrender(address, walletProvider)
      .then(() => {
        updateGameDetails();
        setFlow({ ...flow, surrender: true });
      })
      .catch((error) => {
        console.error("Surrender error:", error);
        setError({ ...error, surrender: true });
      })
      .finally(() => {
        setLoading({ ...loading, surrender: false });
      });
  };

  const getFreeCoins = () => {
    setLoading({ ...loading, freeCoins: true });
    freeCoins(address, walletProvider)
      .then(() => {
        updatePlayerDetails();
      })
      .catch((error) => {
        console.error("Free coins error:", error);
        setError({ ...error, freeCoins: true });
      })
      .finally(() => {
        setLoading({ ...loading, freeCoins: false });
      });
  };

  return (
    <GameContext.Provider
      value={{
        opponentData,
        playerData,
        gameData,
        setOpponentData,
        setPlayerData,
        setGameData,
        betGame,
        dealGameCards,
        rollGameDices,
        surrenderGame,
        getFreeCoins,
        loading,
        setLoading,
        error,
        setError,
        isConnected,
        flow,
        setFlow,
        visualGameData,
        setVisualGameData,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export default GameContext;
