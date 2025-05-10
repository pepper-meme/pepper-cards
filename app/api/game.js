"use client";

import { BrowserProvider, JsonRpcProvider, ethers } from "ethers";
import { base } from "@reown/appkit/networks";
import cardsAbi from "../../solidity/cards.abi";
import tokenAbi from "../../solidity/token.abi";

/*
export function useJsonRpcProvider() {
    return new JsonRpcProvider(base.rpcUrls.default.http[0])
}
*/

export async function currentTokenAmount(address, walletProvider) {
  const browserProvider = new BrowserProvider(walletProvider, base.id);
  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_TOKEN_ADDRESS,
    tokenAbi,
    browserProvider,
  );
  return contract.balanceOf(address).then(function (response) {
    return response / 10n ** BigInt(process.env.NEXT_PUBLIC_TOKEN_DECIMALS);
  });
}

export async function approvedTokenAmount(address, walletProvider) {
  const browserProvider = new BrowserProvider(walletProvider, base.id);
  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_TOKEN_ADDRESS,
    tokenAbi,
    browserProvider,
  );
  return contract
    .allowance(address, process.env.NEXT_PUBLIC_CONTRACT_ADDRESS)
    .then(function (response) {
      return response / 10n ** BigInt(process.env.NEXT_PUBLIC_TOKEN_DECIMALS);
    });
}

export async function approveTokenAmount(amount, walletProvider) {
  const browserProvider = new BrowserProvider(walletProvider, base.id);
  const signer = await browserProvider.getSigner();
  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_TOKEN_ADDRESS,
    tokenAbi,
    signer,
  );
  return contract
    .approve(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, amount)
    .then(function (tx) {
      return tx.wait(1);
    });
}

export async function currentGameInfo(address, walletProvider) {
  const browserProvider = new BrowserProvider(walletProvider, base.id);
  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    cardsAbi,
    browserProvider,
  );
  return contract.getGame(address).then(function (response) {
    return {
      gameStatus: response[0].toString(),
      bet: (
        response[1] /
        10n ** BigInt(process.env.NEXT_PUBLIC_TOKEN_DECIMALS)
      ).toString(),
      player: {
        cards: response[2].split("|"),
        card: response[3].toString(),
        rolled: response[4].toString(),
        score: response[5].toString(),
      },
      opponent: {
        cards: response[6].split("|"),
        card: response[7].toString(),
        rolled: response[8].toString(),
        score: response[9].toString(),
      },
    };
  });
}

export async function bet(address, amount, walletProvider) {
  const browserProvider = new BrowserProvider(walletProvider, base.id);
  const signer = await browserProvider.getSigner();
  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    cardsAbi,
    signer,
  );

  const _amount =
    BigInt(amount) * 10n ** BigInt(process.env.NEXT_PUBLIC_TOKEN_DECIMALS);
  return approvedTokenAmount(address, walletProvider).then(function (approved) {
    let promise = Promise.resolve();
    if (approved < amount) {
      promise = approveTokenAmount(
        process.env.NEXT_PUBLIC_TOKEN_APPROVE_AMOUNT,
        walletProvider,
      );
    }
    return promise.then(function () {
      return contract.bet(_amount).then(function (tx) {
        return tx.wait(1);
      });
    });
  });
}

export async function deal(address, walletProvider) {
  const browserProvider = new BrowserProvider(walletProvider, base.id);
  const signer = await browserProvider.getSigner();
  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    cardsAbi,
    signer,
  );

  return contract.deal().then(function (tx) {
    return tx.wait(1);
  });
}

export async function roll(address, walletProvider) {
  const browserProvider = new BrowserProvider(walletProvider, base.id);
  const signer = await browserProvider.getSigner();
  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    cardsAbi,
    signer,
  );

  return contract.roll().then(function (tx) {
    return tx.wait(1);
  });
}

export async function surrender(address, walletProvider) {
  const browserProvider = new BrowserProvider(walletProvider, base.id);
  const signer = await browserProvider.getSigner();
  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    cardsAbi,
    signer,
  );

  return contract.surrender().then(function (tx) {
    return tx.wait(1);
  });
}

export async function freeCoins(address, walletProvider) {
    const browserProvider = new BrowserProvider(walletProvider, base.id);
    const signer = await browserProvider.getSigner();
    const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_TOKEN_ADDRESS,
        tokenAbi,
        signer,
    );
    return contract
        .mint()
        .then(function (tx) {
            return tx.wait(1);
        });
}
