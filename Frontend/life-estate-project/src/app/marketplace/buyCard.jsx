"use client";

import { useEffect, useState } from "react";
import { readContract } from "@wagmi/core";

import { nftAbi } from "../../../constant/nftConstant";

import AchatTokenBtn from "../components/Button/achatTokenBtn";

export default function BuyCard({ listedToken, listIndex }) {
  const [propertyName, setPropertyName] = useState("Not Selected");
  const active = listedToken.active;
  const amount = parseInt(listedToken.amount.toString(), 10);
  const propertyAddress = listedToken.newLifeEstate;
  const price = parseInt(listedToken.price.toString(), 10);
  const sellerAddress = listedToken.seller;
  const tokenId = parseInt(listedToken.tokenId.toString(), 10);

  const fetchPropertyName = async () => {
    try {
      const data = await readContract({
        address: propertyAddress,
        abi: nftAbi,
        functionName: "getEstateSpecs",
      });
      setPropertyName(data.propertyName);
    } catch (error) {
      console.log("BUY CARD - FETCH GETESTATESPECS - ERROR", error);
    }
  };

  useEffect(() => {
    fetchPropertyName();
  }, []);

  return (
    <div className="max-w-sm mx-4 my-6 overflow-hidden rounded shadow-lg">
      {/* <img
        className="w-full"
        src="/img/card-top.jpg"
        alt="Sunset in the mountains"
      /> */}
      <div className="px-6 py-4">
        <div className="mb-2 text-xl font-bold">
          Property Name: {propertyName}
        </div>
        <div>
          <p className="text-base text-gray-700">
            Property Address: {propertyAddress}
          </p>
          <p className="text-base text-gray-700">Seller: {sellerAddress}</p>
          <p className="text-base text-gray-700">PartId: {tokenId}</p>
          <p className="text-base text-gray-700">Amount: {amount}</p>
          <p className="text-base text-gray-700">Price per share: {price}</p>
        </div>
      </div>
      <div className="flex justify-around mb-1">
        <AchatTokenBtn
          listIndex={listIndex}
          tokenId={tokenId}
          propertyAddress={propertyAddress}
          price={price}
        />
      </div>
    </div>
  );
}
