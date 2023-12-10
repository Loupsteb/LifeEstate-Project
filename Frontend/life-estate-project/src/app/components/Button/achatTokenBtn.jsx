// "use client";

import { prepareWriteContract, writeContract } from "@wagmi/core";

import {
  marketAbi,
  marketPlaceAddress,
} from "../../../../constant/marketPlaceConstant";

import { useEffect } from "react";
import { erc20Abi, nftAbi } from "../../../../constant/nftConstant";

import { approvedTokens } from "../../../../constant/approvedToken";

export default function AchatTokenBtn({
  tokenId,
  propertyAddress,
  listIndex,
  price,
}) {
  const tokenIdNum = 0; //Number(tokenId);
  // const propertyAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const handleBuy = async () => {
    // console.log("BUYBTN - Function_handleBuy - LOG PARAM TEST:", paramTest);
    console.log("BUYBTN - Function_handleBuy - JEXISTE?");
    console.log("BUYBTN - Function_handleBuy - LOG TOKEN ID:", tokenId);
    console.log("BUYBTN - Function_handleBuy - LOG TOKEN ID NUM:", tokenIdNum);
    console.log(
      "BUYBTN - Function_handleBuy - LOG PROPERTY ADRRESS:",
      propertyAddress
    );

    try {
      //on passe bien ici
      console.log(
        "BUYBTN - Function_SET_APPROVAL_TOKEN - TRY CATCH SET SET_APPROVAL_TOKEN FUNC - BEFORE:"
      );
      const { request } = await prepareWriteContract({
        address: propertyAddress,
        abi: nftAbi,
        functionName: "setApprovalForAll",
        args: [marketPlaceAddress, true],
      });
      //REquest retourne un array avec l'address du lifeEstate et non du token selectionné
      console.log(
        "BUYBTN - Function_SET_APPROVAL_TOKEN - TRY CATCH SET SET_APPROVAL_TOKEN FUNC PREPARE WRITE_:",
        request
      );
      const { hash } = await writeContract(request);
      //DERNIERE ETAPE DE VALIDE
      console.log(
        "BUYBTN - Function_SET_APPROVAL_TOKEN - TRY CATCH SET SET_APPROVAL_TOKEN FUNC- LOG HASH:",
        hash
      );
    } catch (error) {
      console.log(
        "BUYBTN - Function_SET_APPROVAL_TOKEN - TRY CATCH SET SET_APPROVAL_TOKEN FUNC- LOG CATCH ERROR",
        error
      );
    }

    try {
      //on passe bien ici
      console.log(
        "BUYBTN - Function_APPROVE_LUSDT - TRY CATCH SET Function_APPROVE_LUSDT - BEFORE:"
      );
      const { request } = await prepareWriteContract({
        address: approvedTokens[0],
        abi: erc20Abi,
        functionName: "approve",
        args: [marketPlaceAddress, price],
      });
      //REquest retourne un array avec l'address du lifeEstate et non du token selectionné
      console.log(
        "BUYBTN - Function_APPROVE_LUSDT - TRY CATCH SET Function_APPROVE_LUSDT :",
        request
      );
      const { hash } = await writeContract(request);
      //DERNIERE ETAPE DE VALIDE
      console.log(
        "BUYBTN - Function_APPROVE_LUSDT - TRY CATCH SET Function_APPROVE_LUSDT - LOG HASH:",
        hash
      );
    } catch (error) {
      console.log(
        "BUYBTN - Function_APPROVE_LUSDT - TRY CATCH SET Function_APPROVE_LUSDT - LOG CATCH ERROR",
        error
      );
    }

    try {
      //on passe bien ici
      console.log(
        "BUYBTN - Function_handleBuy - TRY CATCH SET buyListedToken FUNC - BEFORE:"
      );
      const { request } = await prepareWriteContract({
        address: marketPlaceAddress,
        abi: marketAbi,
        functionName: "buyListedToken",
        args: [listIndex, approvedTokens[0]],
      });
      //REquest retourne un array avec l'address du lifeEstate et non du token selectionné
      console.log(
        "BUYBTN - Function_handleBuy - buyListedToken PREPARE WRITE_:",
        request
      );
      const { hash } = await writeContract(request);
      //DERNIERE ETAPE DE VALIDE
      console.log(
        "BUYBTN - Function_handleBuy - buyListedToken WRITE_- LOG HASH:C'EST GAGNE",
        hash
      );
    } catch (error) {
      console.log(
        "BUYBTN - Function_handleBuy - buyListedToken WRITE_- LOG CATCH ERROR",
        error
      );
    }
  };

  useEffect(() => {
    console.log("BUYBTN - CONSOLE LOG WATCHER:");
  });

  // console.log("BUYBTN - CONSOLE LOG:JE SUIS DANS LE BOUTON");
  return (
    <>
      <h4 className="bg-purple-400">LLLLLLL</h4>
      <button
        type="button"
        class="focus:outline-none text-white bg-purple-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        onClick={handleBuy}
      >
        BUY
      </button>
    </>
  );
}
