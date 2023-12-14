"use client";

import { useEffect, useState, useCallback } from "react";
import { watchContractEvent, readContract } from "@wagmi/core";
import { usePublicClient, useAccount, useContractEvent } from "wagmi";
import { createPublicClient, http } from "viem";

import { parseAbiItem } from "viem";

import SellCard from "./sellCard";

import { nftAbi } from "../../../constant/nftConstant";
import {
  marketAbi,
  marketPlaceAddress,
} from "../../../constant/marketPlaceConstant";

import {
  abi,
  lifeEstateFactoryAddress,
} from "../../../constant/factoryConstant";

export default function sellContainer({ lifeEstateAddresses }) {
  const [userTokens, setUserTokens] = useState([]);
  const [isDone, setIsDone] = useState(false);
  const [listedTokens, setListedTokens] = useState([]);

  const { isConnected, address } = useAccount();

  const readTest = useCallback(async () => {
    if (!isDone) {
      setIsDone(true);
      console.log("SELL CONTAINERS - Voir si READNEWBALANCE LU");
      try {
        const data = await readContract({
          address: lifeEstateFactoryAddress,
          abi: abi,
          functionName: "getAllLifeEstate",
        });
        console.log(
          "SELLCONTAINERS - Function_READBALAMCE - READ CONTRACT : ",
          data
        );
        readAllNft(data);
        fetchListTokenLogs();
      } catch (error) {
        console.log(
          "SELLCONTAINERS - Function_READBALANCE - READ CONTRACT :  ERROR",
          error
        );
      }
    }
  }, []);

  const fetchListTokenLogs = async () => {
    try {
      const data = await readContract({
        address: marketPlaceAddress,
        abi: marketAbi,
        functionName: "getAllListings",
      });
      console.log(
        "SELLCONTAINERSSELL_CONTAINERS  - Function_fetchListTokenLogs **** :",
        data
      );
      setListedTokens(data);
    } catch (error) {
      console.log(
        "BuyContainers - Function_fetchListTokenLogs - READ CONTRACT : ARRAy_OF_ALL_LISTINGS_: ERROR",
        error
      );
    }
  };

  const getListedToken = async () => {
    try {
      const data = await readContract({
        address: marketPlaceAddress,
        abi: marketAbi,
        functionName: "getAllListings",
      });
      console.log(
        "SELLCONTAINERSSELL_CONTAINERS  - Function_fetchListTokenLogs **** :",
        data
      );
      return data;
    } catch (error) {
      console.log(
        "BuyContainers - Function_fetchListTokenLogs - READ CONTRACT : ARRAy_OF_ALL_LISTINGS_: ERROR",
        error
      );
    }
  };

  const readAllNft = async (addressArray) => {
    console.log("BuyContainers - Voir si readAllNft LU***", addressArray);
    const userAddress = address;

    const listedTokens2 = await getListedToken();
    console.log("BUYCONTAINERS - LISTED TOKENS2", listedTokens2);

    const promises = addressArray.map((contractAddress) => {
      return readContract({
        address: contractAddress,
        abi: nftAbi,
        functionName: "getTokensOf",
        args: [userAddress],
      })
        .then((data) => ({
          address: contractAddress,
          tokens: data
            .map((AMOUNT, id) => {
              const idBg = BigInt(id);
              let idTampon = idBg;
              const amountBg = BigInt(AMOUNT);
              let amountListed = BigInt(0);
              console.log("BUYCONTAINERS - AMOUNT", AMOUNT);
              console.log("BUYCONTAINERS - ID", id);
              console.log("!!! BUYCONTAINERS - LISTEDTOKENS!!!", listedTokens);
              for (let i = 0; i < listedTokens2.length; i++) {
                // console.log(
                //   "!!!BUYCONTAINERS!!! - LISTEDTOKENS Length",
                //   listedTokens2.length
                // );
                const tokenIdBg = BigInt(listedTokens2[i].tokenId);
                const tokenAmountBg = BigInt(listedTokens2[i].amount);

                if (contractAddress === listedTokens2[i].newLifeEstate) {
                  console.log("JE RENTRE DANS LE PREMIER IF !!!!");
                  console.log("BUYCONTAINERS - ID", id);
                  console.log(
                    "BUYCONTAINERS - LISTEDTOKENS[i]",
                    listedTokens2[i]
                  );
                  const tempId = parseInt(
                    listedTokens2[i].tokenId.toString(),
                    10
                  );
                  if (idBg == tokenIdBg) {
                    console.log("JE RENTRE DANS LE SECOND IF !!!!");
                    idTampon = tokenIdBg;
                    amountListed = tokenAmountBg;
                    console.log(
                      "----*****BUYCONTAINERS - AMOUNT LISTED*****-----",
                      amountListed
                    );
                    break;
                  }
                }
              }
              console.log(
                "BUYCONTAINERS - AMOUNT LISTED-amoumt",
                AMOUNT - amountListed
              );
              const idNum = Number(idBg);
              const amountNum = Number(amountBg - amountListed);
              const idTamponNum = Number(idTampon);
              console.log("BUYCONTAINERS - Amount Listed", amountListed);
              console.log("BUYCONTAINERS - AMOUNT BG", amountBg);
              console.log("BUYCONTAINERS - AMOUNT NUM", amountNum);
              console.log("BUYCONTAINERS - ID TAMPONNum ", idTamponNum);
              console.log("BUYCONTAINERS - ID NUM", idNum);
              return { id: idTamponNum, amount: amountNum };
            })
            .filter((token) => token.amount !== 0),
        }))
        .catch((error) => {
          console.error("READ CONTRACT ERROR:", error);
          return null;
        });
    });
    // await fetchListTokenLogs();
    // console.log("BUYCONTAINERS - LISTED TOKENS", listedTokens);
    try {
      // const listedTokens2 = await getListedToken();
      // console.log("BUYCONTAINERS - LISTED TOKENS2", listedTokens2);
      const tokensArray = await Promise.all(promises);
      const validTokens = tokensArray.filter((token) => token !== null);
      setUserTokens(validTokens);
    } catch (error) {
      console.error("SELLCONTAINERS - Function_readAllNft - ERROR", error);
    }
  };

  useEffect(() => {
    fetchListTokenLogs();
  }, []);

  useEffect(() => {
    // fetchListTokenLogs();
    if (userTokens.length === 0) {
      console.log("SELLCONTAINERS !!!! - LOG VERIF LISTEDTOKENS", listedTokens);
      readTest();
    }
  }, []);
  return (
    <>
      <h1 className="my-4 text-4xl text-center">List of your tokens</h1>
      <div className="grid grid-cols-4 ">
        {userTokens.map((tokenInfo, index) =>
          tokenInfo.tokens.map(
            (token, idt) =>
              token && (
                <SellCard
                  key={index.toString() + idt.toString()}
                  listindex={token.id}
                  index={idt}
                  tokenInfo={tokenInfo}
                />
              )
          )
        )}
      </div>
    </>
  );
}
