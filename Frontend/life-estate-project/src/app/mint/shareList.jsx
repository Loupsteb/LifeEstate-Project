"use client";

import { useEffect, useState } from "react";

import { readContract } from "@wagmi/core";

import { nftAbi } from "../../../constant/nftConstant";

export default function ShareList({
  selectedEstate,
  setPropertyShares,
  propertyShares,
}) {
  const fetchPropertyShare = async (id) => {
    try {
      console.log("FETCJ PROPERTY SHARE", selectedEstate);
      const data = await readContract({
        address: selectedEstate,
        abi: nftAbi,
        functionName: "getEstateShare",
        args: [id],
      });
      setPropertyShares((propertyShares) => {
        const oldShares = [...propertyShares];
        oldShares[id] = {
          mintSupply: parseInt(data.mintSupply.toString(), 10),
          price: parseInt(data.price.toString(), 10),
          totalSupply: parseInt(data.totalSupply.toString(), 10),
          circulatingSupply: parseInt(data.circulatingSupply.toString(), 10),
        };
        return oldShares;
      });
    } catch (error) {
      console.log("erreur dans SHARELIST", error);
    }
  };

  useEffect(() => {
    for (let i = 0; i < 11; i++) {
      fetchPropertyShare(i);
    }
  }, [selectedEstate]);

  return (
    <>
      <div className="container mt-8 ms-2">
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {propertyShares.map((propertyShare, index) => {
            if (propertyShare.mintSupply === 0 && propertyShare.price === 0) {
              return null;
            }

            return (
              <li
                key={index}
                className="flex flex-col items-start p-4 transition-shadow duration-200 bg-white rounded-lg shadow-lg hover:shadow-xl"
              >
                <span className="text-lg font-semibold text-gray-800">
                  Share {index}
                </span>
                {propertyShare.mintSupply > 0 && (
                  <span className="mt-2 text-sm text-gray-600">
                    Available to mint:{" "}
                    <strong className="font-semibold text-gray-800">
                      {propertyShare.mintSupply}
                    </strong>
                  </span>
                )}
                {propertyShare.price > 0 && (
                  <span className="mt-2 text-sm text-gray-600">
                    Mint price:{" "}
                    <strong className="font-semibold text-gray-800">
                      {propertyShare.price}
                    </strong>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
