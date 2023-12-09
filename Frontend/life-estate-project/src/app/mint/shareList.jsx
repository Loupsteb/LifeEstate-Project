"use client";

import { useEffect, useState } from "react";

import { readContract } from "@wagmi/core";

import { nftAbi } from "../../../constant/nftConstant";

export default function ShareList({
  selectedEstate,
  setPropertyShares,
  propertyShares,
}) {
  // const [propertyShares, setPropertyShares] = useState(Array(11).fill({}));
  const fetchPropertyShare = async (id) => {
    try {
      console.log("FETCJ PROPERTY SHARE", selectedEstate);
      const data = await readContract({
        address: selectedEstate,
        abi: nftAbi,
        functionName: "getEstateShare",
        args: [id],
      });
      // setPropertyShares(parseInt(data.mintSupply.toString(), 10));
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

      console.log("ShareList DATA", data);
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
      <ul>
        {propertyShares.map((propertyShare, index) => (
          <li key={index}>
            Share {index}:
            <span>Avaible to mint: {propertyShare.mintSupply}</span>
            <span>Mint price: {propertyShare.price}</span>
            {/* <span>Mint totalSupply: {propertyShare.totalSupply}</span>
            <span>
              Mint circulatingSupply: {propertyShare.circulatingSupply}
            </span> */}
          </li>
        ))}
      </ul>
    </>
  );
}
