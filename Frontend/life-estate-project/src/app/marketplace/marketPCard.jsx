"use client";

import { useEffect, useState } from "react";

import { readContract } from "@wagmi/core";

import { marketPlaceAddress } from "../../../constant/marketPlaceConstant";

export default function MarketPlaceCard({ selectedEstate }) {
  const [propertyNames, setPropertyNames] = useState("Not Selected");

  return (
    <div>
      <div className="max-w-sm mx-4 my-6 overflow-hidden rounded shadow-lg">
        <img
          className="w-full"
          src="/img/card-top.jpg"
          alt="Sunset in the mountains"
        />
        <div className="px-6 py-4">
          <div className="mb-2 text-xl font-bold">Non de la propriété</div>
          <p className="text-base text-gray-700">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Voluptatibus quia, nulla! Maiores et perferendis eaque,
            exercitationem praesentium nihil.
          </p>
        </div>
        <div className="flex justify-around mb-1">
          <p>Price of Share</p>
        </div>
      </div>
    </div>
  );
}
