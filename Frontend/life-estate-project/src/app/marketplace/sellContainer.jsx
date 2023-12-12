"use client";

import { useEffect, useState } from "react";
import { watchContractEvent, readContract } from "@wagmi/core";
import { usePublicClient, useAccount, useContractEvent } from "wagmi";
import { createPublicClient, http } from "viem";

import { parseAbiItem } from "viem";

import SellCard from "./sellCard";

import { nftAbi } from "../../../constant/nftConstant";

import {
  abi,
  lifeEstateFactoryAddress,
} from "../../../constant/factoryConstant";

export default function sellContainer({
  mftToSell,
  setNftToSell,
  lifeEstateAddresses,
}) {
  const [newEvent, setNewEvent] = useState();
  const [userTokens, setUserTokens] = useState([]);

  const client = createPublicClient({
    transport: http(
      `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
    ),
  });

  const [events, setEvents] = useState([]);

  const { isConnected, address } = useAccount();

  // const getEvents = async () => {
  //   console.log("SellCOntainers - Voir si getEvents LU");
  //   const getNftMinted = client.getLogs({
  //     event: parseAbiItem(
  //       `event PartMinted(address indexed owner, uint256 indexed partId, uint256 amount)`
  //     ),
  //     fromBlock: 4380903n,
  //     toBlock: 4856210n,
  //   });

  //   const [nftMintedLogs] = await Promise.all([getNftMinted]);

  //   console.log("SellCOntainers - Promesses chargees", nftMintedLogs);

  //   const allTheNft = nftMintedLogs.map((nftAdded) => {
  //     console.log(
  //       "SellCOntainers - nftAdded.args.partId",
  //       nftAdded.args.partId
  //     );

  //     console.log("SellCOntainers - partId", partId);

  //     console.log("SellCOntainers - ENTRe DANS LE MAPPING", nftAdded.args);

  //     const nftMintedAddress = nftAdded.address;

  //     const partId = parseInt(nftAdded.args.partId);

  //     const amount = parseInt(nftAdded.args.amount);
  //     return {
  //       nftMintedAddress: nftMintedAddress,
  //       owner: nftAdded.args.owner,
  //       partId: partId,
  //       amount: amount,
  //     };
  //   });

  //   setEvents(allTheNft);
  // };

  // useEffect(() => {
  //   console.log("SELL CONTAINERS_ USE EFFEST events avec ALL THE NFT", events);
  // }, [events]);

  // useEffect(() => {
  //   console.log("SellCOntainers - ENTRE DANS LE USE EFFECT");
  //   const getAllEvents = async () => {
  //     await getEvents();
  //   };
  //   getAllEvents();
  // }, []);

  const readNewBalance = async () => {
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
    } catch (error) {
      console.log(
        "SELLCONTAINERS - Function_READBALANCE - READ CONTRACT :  ERROR",
        error
      );
    }
  };

  const readAllNft = async (addressArray) => {
    console.log("BuyContainers - Voir si readAllNft LU***", addressArray);
    const userAddress = address;
    for (let index = 0; index < addressArray.length; index++) {
      try {
        const data = await readContract({
          address: addressArray[index],
          abi: nftAbi,
          functionName: "getTokensOf",
          args: [userAddress],
        });
        console.log(
          `!!!SELLCONTAINERS!!! - readAllNft - READ CONTRACT : ${addressArray[index]},/data:${data}`
        );
        console.log("DATA :", data);
        setUserTokens((userTokens) => {
          const obj = {
            address: addressArray[index],
            tokens: data.map((AMOUNT, id) => {
              if (AMOUNT !== 0n) {
                return { id: id, amount: AMOUNT };
              }
            }),
          };
          console.log("******SELL CONTAINERS - USER TOKENS", userTokens);
          console.log("*******SELL CONTAINERS - OBJET", obj);
          return [...userTokens, obj];
        });
        console.log("SELL CONTAINERS - USER TOKENS.id", userTokens.id);
        // setListedTokens(data);
      } catch (error) {
        console.log(
          "SELLCONTAINERS - Function_readAllNft - READ CONTRACT :  ERROR",
          error
        );
      }
      // }
    }
  };

  // useEffect(() => {
  //   console.log(
  //     "!!!!!!!!!SELLCONTAINERS - USE EFFECT VARIABLE_USERTOKENS!!!!!!!!!",
  //     userTokens
  //   );
  // }, [userTokens]);

  useEffect(() => {
    readNewBalance();
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
