"use client";

import { useEffect, useState } from "react";

import { nftAbi } from "../../../constant/nftConstant";
import SellBtn from "../components/Button/sellBtn";

import { readContract } from "@wagmi/core";

export default function SellCard({
  tokenInfo,
  index,
  setListedTokens,
  listedTokens,
  listindex,
}) {
  const [propertyName, setPropertyName] = useState("Not Selected");
  const [amountToSell, setAmountToSell] = useState(0);
  const [priceToSell, setPriceToSell] = useState(0);
  const [avaibleToSell, setAvaibleToSell] = useState(0);

  const { address: propertyAddress, tokens } = tokenInfo;

  const fetchPropertyName = async () => {
    try {
      const data = await readContract({
        address: propertyAddress,
        abi: nftAbi,
        functionName: "getEstateSpecs",
      });
      setPropertyName(data.propertyName);
    } catch (error) {
      console.log("SELL CARD - FETCH GETESTATESPECS - ERROR", error);
    }
  };

  useEffect(() => {
    console.log("SELL CARD - TOKENINFO", tokenInfo);
    fetchPropertyName();
  }, []);

  const convert = (num) => {
    if (num) return parseInt(num.toString(), 10);
    else return 0;
  };

  return (
    <div className="max-w-sm mx-4 my-6 overflow-hidden rounded shadow-lg">
      <div className="px-6 py-4">
        <div className="mb-2 text-xl font-bold">
          Property Name: {propertyName}
        </div>
        <div>
          <p className="text-base text-gray-700">
            Property Address: {propertyAddress}
          </p>
          <p className="text-base text-gray-700">
            {/* PartId: {tokenInfo.tokens[index].id} */}
            PartId: {listindex}
          </p>
          <p className="text-base text-gray-700">
            Amount: {convert(tokenInfo.tokens[index].amount)}
          </p>
        </div>
      </div>
      <div className="flex justify-around mb-1 ml-3">
        <label>
          Amount to sell
          <input
            type="number"
            value={amountToSell}
            onChange={(e) => setAmountToSell(e.target.value)}
            className="w-20 ml-2"
          />
        </label>
        <label>
          Price per share
          <input
            type="number"
            value={priceToSell}
            onChange={(e) => setPriceToSell(e.target.value)}
            className="w-20 ml-2"
          />
        </label>

        <SellBtn
          propertyAddress={propertyAddress}
          // partId={tokenInfo.tokens[index].id}
          amount={tokenInfo.tokens[index].amount}
          partId={listindex}
          // amount={1}
          amountToSell={amountToSell}
          priceToSell={priceToSell}
        />
      </div>
    </div>
  );
}
