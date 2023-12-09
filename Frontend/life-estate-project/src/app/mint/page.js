"use client";

import { useEffect, useState } from "react";

import Card from "./card";

import {
  abi,
  lifeEstateFactoryAddress,
} from "../../../constant/factoryConstant";

import {
  prepareWriteContract,
  writeContract,
  readContract,
  watchContractEvent,
} from "@wagmi/core";

import ShareList from "./shareList";
import InputChoice from "./inputChoice";
import SelectorEstate from "./selectorEstate";
import ApprovedToken from "./approvedToken";

export default function Mint() {
  const [allLifeEstate, setAllLifeEstate] = useState([]);
  const [selectedEstate, setSelectedEstate] = useState("");
  const [propertyShares, setPropertyShares] = useState(Array(11).fill({}));
  const [selectedApprovedToken, setSelectedApprovedToken] = useState("");

  //recup le tableau des addresses des propriétés
  const getPropertyMint = async () => {
    try {
      const data = await readContract({
        address: lifeEstateFactoryAddress,
        abi: abi,
        functionName: "getAllLifeEstate",
      });
      setAllLifeEstate(data);
      console.log("data", data);
    } catch (error) {
      console.log(error);
    }
  };

  //recup le tableau des addresses des propriétés a l affichage de la page
  useEffect(() => {
    if (lifeEstateFactoryAddress.length > 0) {
      getPropertyMint();
    }
  }, [lifeEstateFactoryAddress]);

  useEffect(() => {
    console.log("Compo Parent selectedEstate", selectedEstate);
  }, [selectedEstate]);

  useEffect(() => {
    console.log("Compo Parent selectedApprovedToken", selectedApprovedToken);
  }, [selectedApprovedToken]);
  return (
    <>
      <div>
        <ApprovedToken setSelectedApprovedToken={setSelectedApprovedToken} />
        <SelectorEstate
          allLifeEstate={allLifeEstate}
          setSelectedEstate={setSelectedEstate}
          setPropertyShares={setPropertyShares}
        />
      </div>
      <div className="flex items-center justify-center mt-20 mb-20">
        {selectedEstate.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <ShareList
              selectedEstate={selectedEstate}
              propertyShares={propertyShares}
              setPropertyShares={setPropertyShares}
            />
            <Card selectedEstate={selectedEstate} />
            <InputChoice
              selectedEstate={selectedEstate}
              propertyShares={propertyShares}
              selectedApprovedToken={selectedApprovedToken}
            />
          </div>
        )}
      </div>
    </>
  );
}
