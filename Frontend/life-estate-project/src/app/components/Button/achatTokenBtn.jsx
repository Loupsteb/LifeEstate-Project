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
  const tokenIdNum = 0;
  const handleBuy = async () => {
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
        "BUYBTN - Function_SET_APPROVAL_TOKEN - TRY CATCH SET SET_APPROVAL_TOKEN FUNC- LOG CATCH ERROR",
        error
      );
    }

    try {
      console.log(
        "BUYBTN - Function_APPROVE_LUSDT - TRY CATCH SET Function_APPROVE_LUSDT - BEFORE:"
      );
      const { request } = await prepareWriteContract({
        address: approvedTokens[0],
        abi: erc20Abi,
        functionName: "approve",
        args: [marketPlaceAddress, price],
      });
      console.log(
        "BUYBTN - Function_APPROVE_LUSDT - TRY CATCH SET Function_APPROVE_LUSDT :",
        request
      );
      const { hash } = await writeContract(request);
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
      console.log(
        "BUYBTN - Function_handleBuy - TRY CATCH SET buyListedToken FUNC - BEFORE:"
      );
      const { request } = await prepareWriteContract({
        address: marketPlaceAddress,
        abi: marketAbi,
        functionName: "buyListedToken",
        args: [listIndex, approvedTokens[0]],
      });

      const { hash } = await writeContract(request);
    } catch (error) {}
  };

  return (
    <>
      <button
        type="button"
        className="focus:outline-none text-white bg-purple-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        onClick={handleBuy}
      >
        BUY
      </button>
    </>
  );
}
