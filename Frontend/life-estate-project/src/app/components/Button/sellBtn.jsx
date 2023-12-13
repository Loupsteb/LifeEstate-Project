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
  const handleSell = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: propertyAddress,
        abi: nftAbi,
        functionName: "setApprovalForAll",
        args: [marketPlaceAddress, true],
      });
      const { hash } = await writeContract(request);
    } catch (error) {
      console.log(
        "SELL BTN - WRITE - Function_HANDLESELL_APPROVE_MARKET_PLACE - LOG ERROR",
        error
      );
    }

    try {
      console.log(
        "SELL BTN - PREPARE_WRITE - Function_HANDLESELL_LIST_TOKEN -"
      );

      const partIdNumber = parseInt(partId.toString(), 10);
      const amountNumber = parseInt(amountToSell.toString(), 10);
      const priceToSellNumber = parseInt(priceToSell.toString(), 10);
      console.log(
        `SELL BTN _ LOG DE VERIFpartId ${partId} - amount ${amountToSell} - priceToSell ${priceToSell}`
      );

      const { request } = await prepareWriteContract({
        address: marketPlaceAddress,
        abi: marketAbi,
        functionName: "listToken",
        args: [partIdNumber, amountNumber, priceToSellNumber, propertyAddress],
      });
      console.log(
        "SELL BTN - PREPARE_WRITE - Function_HANDLESELL_LIST_TOKEN - LOG REQUEST",
        request
      );
      const { hash } = await writeContract(request);
      console.log(
        "SELL BTN - WRITE - Function_HANDLESELL_LIST_TOKEN - LOG HASH",
        hash
      );
    } catch (error) {
      console.log(
        "SELL BTN - WRITE - Function_HANDLESELL_LIST_TOKEN - LOG ERROR",
        error
      );
    }
  };
  return (
    <button
      type="button"
      className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
      onClick={handleSell}
    >
      Sell
    </button>
  );
}
