"use client";

import { useEffect, useState } from "react";
import { watchContractEvent, readContract } from "@wagmi/core";
import { usePublicClient, useAccount } from "wagmi";
import { parseAbiItem } from "viem";

import {
  nftAbi,
  lifeEstateFactoryAddress,
} from "../../../constant/nftConstant";

import {
  marketAbi,
  marketPlaceAddress,
} from "../../../constant/marketPlaceConstant";

import BuyCard from "./buyCard";

export default function BuyContainer({
  mftToSell,
  setNftToSell,
  lifeEstateAddresses,
}) {
  const client = usePublicClient();
  const [events, setEvents] = useState([]);
  const [listedTokens, setListedTokens] = useState([]);

  // const fetchListTokenLogs = async () => {
  //   console.log("BuyContainers - Voir si getEvents LU");
  //   const getListTokens = client.getLogs({
  //     event: parseAbiItem(
  //       "event TokenListingCreated(uint256 indexed tokenId, uint256 amount, uint256 price)"
  //     ),
  //     fromBlock: 0n,
  //     toBlock: 1000n,
  //   });

  //   const [listTokenLogs] = await Promise.all([getListTokens]);

  //   console.log("BuyContainers - Promesses chargees", listTokenLogs);

  //   const allListToken = listTokenLogs.map((listTokens) => {
  //     console.log("BuyContainers - ENTREE DANS LE MAPPING", listTokens);

  //     const tokenId = parseInt(listTokens.args.tokenId);
  //     const amount = parseInt(listTokens.args.amount);
  //     const price = parseInt(listTokens.args.price);

  //     return {
  //       tokenId: tokenId,
  //       amount: amount,
  //       price: price,
  //     };
  //   });

  //   setEvents(allListToken);
  // };

  // useEffect(() => {
  //   fetchListTokenLogs();
  // }, []);

  const fetchListTokenLogs = async () => {
    console.log("BuyContainers - Voir si getEvents LU");
    try {
      const data = await readContract({
        address: marketPlaceAddress,
        abi: marketAbi,
        functionName: "getAllListings",
      });
      console.log(
        //Valeur de l'address du caller
        "BuyContainers - Function_fetchListTokenLogs - READ CONTRACT : ARRAy_OF_ALL_LISTINGS",
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

  useEffect(() => {
    fetchListTokenLogs();
  }, []);

  return (
    <>
      <h1 className="my-4 text-4xl text-center">Buy some tokens</h1>
      <div className="flex flex-wrap justify-around bg-color-red">
        {listedTokens.map((listedToken, index) => {
          return <BuyCard key={index} listIndex={index}  listedToken={listedToken} />;
          
        })}
      </div>
    </>
  );
}
