"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { readContract } from "@wagmi/core";

import {
  abi,
  lifeEstateFactoryAddress,
} from "../../../constant/factoryConstant";

import MarketPlaceCard from "./marketPCard";
import BuyContainer from "./buyContainer";
import SellContainer from "./sellContainer";

export default function MarketPlace() {
  const { address } = useAccount();

  const getLifeEstateAddresses = async () => {
    try {
      const data = await readContract({
        address: lifeEstateFactoryAddress,
        abi: abi,
        functionName: "getAllLifeEstate",
      });
      setLifeEstateAddresses(data);
    } catch (error) {
      console.log("MARKET PLACE_PAGE - Error-call lifeEstateAddresses", error);
    }
  };

  useEffect(() => {
    getLifeEstateAddresses();
  }, [address]);

  const [isBuyMarket, setIsBuyMarket] = useState(true);
  const [nftToBuy, setNftToBuy] = useState([]);
  const [nftToSell, setNftToSell] = useState([]);
  const [lifeEstateAddresses, setLifeEstateAddresses] = useState(null);

  return (
    <>
      <div className="flex justify-around mt-5">
        <button
          className="px-4 py-2 font-semibold bg-white border border-gray-400 shadow rounded-2xl hover:bg-green-200 active:bg-lime-100 focus:outline-none focus:ring focus:ring-green-100 "
          onClick={() => {
            setIsBuyMarket(true);
          }}
        >
          BUY SHARE
        </button>
        <h1 className="my-4 text-4xl text-center">Market Place</h1>
        <button
          className="px-4 py-2 font-semibold bg-white border border-gray-400 shadow rounded-2xl hover:bg-green-200 active:bg-lime-100 focus:outline-none focus:ring focus:ring-green-100 "
          onClick={() => {
            setIsBuyMarket(false);
          }}
        >
          SELL SHARE
        </button>
      </div>
      {isBuyMarket ? (
        <BuyContainer />
      ) : (
        <SellContainer
          nftToSell={nftToSell}
          setNftToSell={setNftToSell}
          lifeEstateAddresses={lifeEstateAddresses}
        />
      )}
    </>
  );
}
