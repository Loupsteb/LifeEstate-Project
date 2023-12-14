"use client";

import {
  marketAbi,
  marketPlaceAddress,
} from "../../../../constant/marketPlaceConstant";

import { nftAbi } from "../../../../constant/nftConstant";

import { useEffect, useState } from "react";

import {
  prepareWriteContract,
  writeContract,
  waitForTransaction,
} from "@wagmi/core";

export default function SellBtn({
  propertyAddress,
  amount,
  partId,
  priceToSell,
  amountToSell,
}) {
  const [step, setStep] = useState(-1);

  const stepApprove = async () => {
    console.log(
      "SELL BTN - PREPARE_WRITE - Function_HANDLESELL_APPROVE_MARKET_PLACE PROPERTY ADDRESS -",
      propertyAddress
    );
    console.log(
      "SELL BTN - PREPARE_WRITE - Function_HANDLESELL_APPROVE_MARKET_PLACE MARKET PLACE ADRRESS-",
      marketPlaceAddress
    );
    try {
      console.log(
        "SELL BTN - PREPARE_WRITE - Function_HANDLESELL_APPROVE_MARKET_PLACE PROPERTY ADDRESS -",
        propertyAddress
      );
      const { request } = await prepareWriteContract({
        address: propertyAddress,
        abi: nftAbi,
        functionName: "setApprovalForAll",
        args: [marketPlaceAddress, true],
      });
      const { hash } = await writeContract(request);
      console.log(
        "SELL BTN - WRITE - Function_HANDLESELL_APPROVE_MARKET_PLACE HASH LOG",
        hash
      );
      const data = await waitForTransaction({ hash });
      if (data) {
        setStep(1);
      }
    } catch (error) {
      console.log(
        "SELL BTN - WRITE - Function_HANDLESELL_APPROVE_MARKET_PLACE - LOG ERROR",
        error
      );
    }
  };

  const stepSell = async () => {
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
      const data = await waitForTransaction({ hash });
      if (data) {
        setStep(2);
      }
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
  const handleSell = () => {
    setStep(0);
    // try {
    //   const { request } = await prepareWriteContract({
    //     address: propertyAddress,
    //     abi: nftAbi,
    //     functionName: "setApprovalForAll",
    //     args: [marketPlaceAddress, true],
    //   });
    //   const { hash } = await writeContract(request);
    // } catch (error) {
    //   console.log(
    //     "SELL BTN - WRITE - Function_HANDLESELL_APPROVE_MARKET_PLACE - LOG ERROR",
    //     error
    //   );
    // }
    // try {
    //   console.log(
    //     "SELL BTN - PREPARE_WRITE - Function_HANDLESELL_LIST_TOKEN -"
    //   );
    //   const partIdNumber = parseInt(partId.toString(), 10);
    //   const amountNumber = parseInt(amountToSell.toString(), 10);
    //   const priceToSellNumber = parseInt(priceToSell.toString(), 10);
    //   console.log(
    //     `SELL BTN _ LOG DE VERIFpartId ${partId} - amount ${amountToSell} - priceToSell ${priceToSell}`
    //   );
    //   const { request } = await prepareWriteContract({
    //     address: marketPlaceAddress,
    //     abi: marketAbi,
    //     functionName: "listToken",
    //     args: [partIdNumber, amountNumber, priceToSellNumber, propertyAddress],
    //   });
    //   console.log(
    //     "SELL BTN - PREPARE_WRITE - Function_HANDLESELL_LIST_TOKEN - LOG REQUEST",
    //     request
    //   );
    //   const { hash } = await writeContract(request);
    //   console.log(
    //     "SELL BTN - WRITE - Function_HANDLESELL_LIST_TOKEN - LOG HASH",
    //     hash
    //   );
    // } catch (error) {
    //   console.log(
    //     "SELL BTN - WRITE - Function_HANDLESELL_LIST_TOKEN - LOG ERROR",
    //     error
    //   );
    // }
  };
  useEffect(() => {
    if (step === 0) {
      console.log("SELL BTN - USE EFFECT - STEP 0", step);
      stepApprove();
    }
    if (step === 1) {
      console.log("SELL BTN - USE EFFECT - STEP 1", step);

      stepSell();
    }
  }, [step]);

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
