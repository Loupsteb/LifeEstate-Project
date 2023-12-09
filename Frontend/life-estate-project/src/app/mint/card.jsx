// Assure-toi que 'use client' est nécessaire pour ton cas d'utilisation spécifique.
"use client";

import { useEffect, useState } from "react";

import { readContract } from "@wagmi/core";

import { nftAbi } from "../../../constant/nftConstant";

export default function Card({ selectedEstate }) {
  const [propertyNames, setPropertyNames] = useState("Not Selected");

  const fetchPropertyName = async () => {
    try {
      const data = await readContract({
        address: selectedEstate,
        abi: nftAbi,
        functionName: "getEstateSpecs",
      });
      setPropertyNames(data.propertyName);
      console.log("data", data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPropertyName();
  }, [selectedEstate]);

  return (
    <div className="max-w-sm overflow-hidden rounded shadow-lg">
      <img
        className="w-full"
        src="/img/card-top.jpg"
        alt="Sunset in the mountains"
      />
      <div className="px-6 py-4">
        <div className="mb-2 text-xl font-bold">{propertyNames}</div>
        <p className="text-base text-gray-700">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus
          quia, nulla! Maiores et perferendis eaque, exercitationem praesentium
          nihil.
        </p>
      </div>
    </div>
  );
}
