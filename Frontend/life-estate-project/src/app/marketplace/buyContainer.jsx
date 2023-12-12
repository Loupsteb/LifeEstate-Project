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

  const fetchListTokenLogs = async () => {
    try {
      const data = await readContract({
        address: marketPlaceAddress,
        abi: marketAbi,
        functionName: "getAllListings",
      });
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
          return (
            <BuyCard key={index} listIndex={index} listedToken={listedToken} />
          );
        })}
      </div>
    </>
  );
}
