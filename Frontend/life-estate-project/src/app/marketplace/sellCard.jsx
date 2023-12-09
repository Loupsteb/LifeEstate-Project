"use client";

import { useEffect, useState } from "react";

import { nftAbi } from "../../../constant/nftConstant";
import SellBtn from "../components/Button/sellBtn";

import { readContract } from "@wagmi/core";

export default function SellCard(event) {
  const [propertyName, setPropertyName] = useState("Not Selected");
  const [amountToSell, setAmountToSell] = useState(0);
  const [priceToSell, setPriceToSell] = useState(0);

  const propertyAddress = event.params.nftMintedAddress;
  const owner = event.params.owner;
  const partId = event.params.partId;
  const amount = event.params.amount;

  //creer fomction pour fetcher property name avec un appel a la property address
  const fetchPropertyName = async () => {
    try {
      console.log("FETCH PROPERTY SHARE", propertyName);
      const data = await readContract({
        address: propertyAddress,
        abi: nftAbi,
        functionName: "getEstateSpecs",
        // args: [],
      });
      console.log("FETCH PROPERTY SHARE - DATA", data);
      // setPropertyShares(parseInt(data.mintSupply.toString(), 10));
      setPropertyName(data.propertyName);
    } catch (error) {
      console.log("erreur dans FETCH PROPERTY NAME", error);
    }
  };

  useEffect(() => {
    fetchPropertyName();
    console.log("SELL CARD _ PROPERTY NAME", propertyName);
    console.log("SELL CARD _ USE EFFECT_event", event);
  }, [event]);

  useEffect(() => {
    //get property name
    console.log("SELL CARD _ USE EFFECT_SANS_event", event);
  }, []);

  return (
    <div className="max-w-sm mx-4 my-6 overflow-hidden rounded shadow-lg">
      <img
        className="w-full"
        src="/img/card-top.jpg"
        alt="Sunset in the mountains"
      />
      <div className="px-6 py-4">
        <div className="mb-2 text-xl font-bold">
          Non de la propriété: {propertyName}
        </div>
        <div>
          <p className="text-base text-gray-700">
            Property Address: {propertyAddress}
          </p>
          <p className="text-base text-gray-700">Owner: {owner}</p>
          <p className="text-base text-gray-700">PartId: {partId}</p>
          <p className="text-base text-gray-700">Amount: {amount}</p>
        </div>
      </div>
      <div className="flex justify-around mb-1">
        <label>
          Amount to sell
          <input
            type="number"
            value={amountToSell}
            onChange={(e) => setAmountToSell(e.target.value)}
            className="w-20 ml-2"
          />
        </label>
        {/*Verifier si le prix est par share ou pour le total de la propriété*/}
        <label>
          Price per share``
          <input
            type="number"
            value={priceToSell}
            onChange={(e) => setPriceToSell(e.target.value)}
            className="w-20 ml-2"
          />
        </label>

        <SellBtn
          propertyAddress={propertyAddress}
          partId={partId}
          amount={amount}
          amountToSell={amountToSell}
          priceToSell={priceToSell}
        />
        <p>Price of Share</p>
      </div>
    </div>
  );
}
