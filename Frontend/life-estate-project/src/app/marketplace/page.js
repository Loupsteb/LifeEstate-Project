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
      console.log("MARKET PLACE_PAGE - READ GET ALL LIFE ESTATE - data", data);
    } catch (error) {
      //Lors du clique sur LA : Error: The contract function "getAllLifeEstate" returned no data ("0x").
      console.log("MARKET PLACE_PAGE - Error-call lifeEstateAddresses", error);
    }
  };

  useEffect(() => {
    getLifeEstateAddresses();
  }, [address]);

  /*  isBuyMarketP = true; lorsque le boutton achat est enfoncé et false lorsque
le bouton vente est enfoncé: ca indique si on doit afficher sell buy container */
  const [isBuyMarket, setIsBuyMarket] = useState(true);

  /*state pour stocker les listes.
list nftToBuy et une listNftToSell ces tableaux et leur seter seront transmis
au composant enfant associé*/
  const [nftToBuy, setNftToBuy] = useState([]);
  const [nftToSell, setNftToSell] = useState([]);
  const [lifeEstateAddresses, setLifeEstateAddresses] = useState(null);
  /*buyContainer:
on va appeler le tableau lifeEstateAddresses du contrat factory
sur chacune de ces addresses on va ecouter l'event des tokens mintés, le resultat
peremettra de remplir la liste des tokens a vendre
ca afficher sous forme de carte les tokens a vendre avec l'apparition du bouton buy
avec un map*/

  /*sellContainer:
on va appeler le tableau lifeEstateAddresses du contrat factory
sur chaque addresse on va test si le sender est le owner du token, si oui il rentre
dans la liste des nftToSell (possible de filter les events de mintToken pour voir si 
  l'addresse du sender est le owner du token)*/

  return (
    <>
      <div>
        <button
          onClick={() => {
            setIsBuyMarket(true);
          }}
        >
          BUY SHARE
        </button>
        <h1 className="my-4 text-4xl text-center bg-red-400">Market Place</h1>
        <button
          onClick={() => {
            setIsBuyMarket(false);
          }}
        >
          SELL SHARE
        </button>
      </div>
      {/* faire une div pour les boutons avec un ternaire: si isBuyMarketP affiche
MarketPlaceCard sinon liste des tokens detenus a gauche un bouton achat a droite
  un bouton vente */}
      {isBuyMarket ? (
        <BuyContainer />
      ) : (
        <SellContainer
          nftToSell={nftToSell}
          setNftToSell={setNftToSell}
          lifeEstateAddresses={lifeEstateAddresses}
        />
      )}

      {/* ira dans une container pour contextualiser l'affichage */}
      {/* <MarketPlaceCard /> */}
    </>
  );
}
