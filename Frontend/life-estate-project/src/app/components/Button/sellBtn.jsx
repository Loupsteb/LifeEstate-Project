"use client";

import {
  marketAbi,
  marketPlaceAddress,
} from "../../../../constant/marketPlaceConstant";
import { nftAbi } from "../../../../constant/nftConstant";

import { prepareWriteContract, writeContract } from "@wagmi/core";

export default function SellBtn({
  propertyAddress,
  amount,
  partId,
  priceToSell,
  amountToSell,
}) {
  console.log(
    `SELL BTN _ LOG DE VERIFpartId ${partId} - amount ${amount} - priceToSell ${priceToSell}`
  );

  const handleSell = async () => {
    console.log(
      "SELL BTN - Function_HANDLESELL- LOG PROPERTY ADDRESS",
      propertyAddress
    );
    //fonction approve market place
    try {
      console.log("SELL BTN - Function_HANDLESELL_APPROVE_MARKET_PLACE");
      const { request } = await prepareWriteContract({
        address: propertyAddress,
        abi: nftAbi,
        functionName: "setApprovalForAll",
        args: [marketPlaceAddress, true],
      });
      //ON ARRIVE JUSQUE ICI
      console.log(
        "SELL BTN - PREPARE_WRITE - Function_HANDLESELL_APPROVE_MARKET_PLACE - LOG REQUEST",
        request
      );
      const { hash } = await writeContract(request);
      //DERNIERE ETAPE DE VALIDE
      console.log(
        "SELL BTN - WRITE - Function_HANDLESELL_APPROVE_MARKET_PLACE - LOG HASH",
        hash
      );
    } catch (error) {
      // ICI ERREUR SUITE A SOUMISSION MINT
      console.log(
        "SELL BTN - WRITE - Function_HANDLESELL_APPROVE_MARKET_PLACE - LOG ERROR",
        error
      );
    }

    //fonction de vente
    try {
      console.log(
        "SELL BTN - PREPARE_WRITE - Function_HANDLESELL_LIST_TOKEN -"
      );

      const partIdNumber = parseInt(partId.toString(), 10);
      const amountNumber = parseInt(amount.toString(), 10);
      const priceToSellNumber = parseInt(priceToSell.toString(), 10);
      console.log(
        `SELL BTN _ LOG DE VERIFpartId ${partId} - amount ${amount} - priceToSell ${priceToSell}`
      );

      const { request } = await prepareWriteContract({
        address: marketPlaceAddress,
        abi: marketAbi,
        functionName: "listToken",
        args: [partIdNumber, amountNumber, priceToSellNumber, propertyAddress],
      });
      //TypeError: Cannot convert undefined to a BigInt
      console.log(
        "SELL BTN - PREPARE_WRITE - Function_HANDLESELL_LIST_TOKEN - LOG REQUEST",
        request
      );
      const { hash } = await writeContract(request);
      //DERNIERE ETAPE DE VALIDE
      console.log(
        "SELL BTN - WRITE - Function_HANDLESELL_LIST_TOKEN - LOG HASH",
        hash
      );
    } catch (error) {
      // ICI ERREUR SUITE A SOUMISSION de vente toString Cannot read properties of undefined (reading 'toString')
      console.log(
        "SELL BTN - WRITE - Function_HANDLESELL_LIST_TOKEN - LOG ERROR",
        error
      );
    }
  };
  return (
    <button
      type="button"
      class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
      onClick={handleSell}
    >
      Sell
    </button>
  );
}
