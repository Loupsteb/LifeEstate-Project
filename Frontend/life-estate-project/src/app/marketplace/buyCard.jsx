"use client";

import { useEffect, useState } from "react";

import AchatTokenBtn from "../components/Button/achatTokenBtn";

export default function BuyCard({ listedToken }) {
  const [propertyName, setPropertyName] = useState("Not Selected");

  const active = listedToken.active;
  const amount = parseInt(listedToken.amount.toString(), 10);
  const propertyAddress = listedToken.newLifeEstate;
  const price = parseInt(listedToken.price.toString(), 10);
  const sellerAddress = listedToken.seller;
  const tokenId = parseInt(listedToken.tokenId.toString(), 10);

  //creer fomction pour fetcher property name avec un appel a la property address
  // const fetchPropertyName = async () => {};
  console.log("BUY CARD - LISTED TOKEN", listedToken);

  // useEffect(() => {
  //   //get property name
  //   console.log("SELL CARD _ USE EFFECT_event", event);
  // }, [event]);

  // useEffect(() => {
  //   //get property name
  //   console.log("SELL CARD _ USE EFFECT_SANS_event", event);
  // }, []);

  const text = "TEST TEXT";

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
          <p className="text-base text-gray-700">Seller: {sellerAddress}</p>
          <p className="text-base text-gray-700">PartId: {tokenId}</p>
          <p className="text-base text-gray-700">Amount: {amount}</p>
          <p className="text-base text-gray-700">Price: {price}</p>
        </div>
      </div>
      <div className="flex justify-around mb-1">
        <AchatTokenBtn tokenId={tokenId} propertyAddress={propertyAddress} />
      </div>
    </div>
  );
}
