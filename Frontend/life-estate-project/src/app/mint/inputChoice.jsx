"use client";

import { useEffect, useState } from "react";

import { nftAbi, erc20Abi } from "../../../constant/nftConstant";

import MintBtn from "../components/Button/mintBtn";

import {
  prepareWriteContract,
  writeContract,
  readContract,
  waitForTransaction,
} from "@wagmi/core";
import { useAccount } from "wagmi";
import { data } from "autoprefixer";

export default function InputChoice({
  selectedEstate,
  propertyShares,
  selectedApprovedToken,
}) {
  const [shareId, setShareId] = useState("");
  const [numShares, setNumShares] = useState("");
  // const [approvedToken, setApprovedToken] = useState([]);
  const { address } = useAccount();
  const [step, setStep] = useState(-1);

  const stepSetTokens = async () => {
    try {
      //on passe bien ici
      console.log(
        "INPUT_CHOICES - Function_mintShares - TRY CATCH SET APPROVED TOKEND FUNC - BEFORE:"
      );
      const { request } = await prepareWriteContract({
        address: selectedEstate,
        abi: nftAbi,
        functionName: "setApprovedTokens",
        args: [[selectedApprovedToken], true],
      });
      //REquest retourne un array avec l'address du lifeEstate et non du token selectionné

      console.log(
        "INPUT_CHOICES - Function_mintShares - PREPARE WRITE_setApprovedTokens:",
        request
      );

      const { hash } = await writeContract(request);

      const data = await waitForTransaction({
        hash,
      });
      if (data) {
        setStep(1);
      }

      console.log(
        "INPUT_CHOICES - Function_mintShares - WRITE_setApprovedTokens - LOG HASH:",
        hash
      );
    } catch (error) {
      console.log(
        "INPUT_CHOICES - Function_mintShares - WRITE_setApprovedTokens - LOG CATCH ERROR",
        error
      );
    }
  };

  const stepApprove = async () => {
    const amount = propertyShares[shareId].price * numShares;
    console.log("INPUT_CHOICES - Function_mintShares- VARIABLE AMOUNT", amount);

    try {
      console.log(
        "INPUT_CHOICES - Function_mintShares - selectedApproveUSDT AVANT"
      );
      const { request } = await prepareWriteContract({
        address: selectedApprovedToken,
        abi: erc20Abi,
        functionName: "approve",
        args: [selectedEstate, amount],
      });
      //ON ARRIVE JUSQUE ICI
      console.log(
        "INPUT_CHOICES - Function_mintShares - PREPARE-WRITE_APPROVE - LOG REQUEST",
        request
      );
      const { hash } = await writeContract(request);

      const data = await waitForTransaction({
        hash,
      });
      if (data) {
        setStep(2);
      }

      console.log(
        "INPUT_CHOICES - Function_mintShares - PREPARE-WRITE_APPROVE - LOG HASH",
        hash
      );
    } catch (error) {
      // ICI ERREUR SUITE A SOUMISSION MINT
      console.log(
        "INPUT_CHOICES - Function_mintShares - PREPARE-WRITE_APPROVE CATCH - LOG ERROR",
        error
      );
    }
  };

  const stepMint = async () => {
    try {
      console.log(
        "INPUT_CHOICES - Function_mintShares - BEFORE CALL PREAPREWRITE_MINT_BUY_TOKEN"
      );
      console.log();
      const { request } = await prepareWriteContract({
        address: selectedEstate,
        abi: nftAbi,
        functionName: "mintBuyToken",
        args: [shareId, numShares, selectedApprovedToken],
      });
      const { hash } = await writeContract(request);
      const data = await waitForTransaction({
        hash,
      });

      if (data) {
        setStep(3);
      }
    } catch (error) {
      console.log(
        "INPUT_CHOICES - Function_mintShares - PREPARE-WRITE_MINT_BUY_TOKEN - LOG ERROR",
        error
      );
    }
  };

  const mintShares = async () => {
    let valideInput = false;
    propertyShares.map((propertyShare, index) => {
      if (index === parseInt(shareId, 10)) {
        if (propertyShare.mintSupply < parseInt(numShares, 10)) {
          console.log(
            "INPUT_CHOICES - Function_mintShares - Not enough shares to mint"
          );
        } else {
          console.log(
            "INPUT_CHOICES - Function_mintShares - Validate Input Passe a True"
          );
          valideInput = true;
        }
      }
    });

    console.log(
      "INPUT_CHOICES - Function_mintShares - VARIABLE_: selectedApprovedToken:",
      selectedApprovedToken
    );
    // console.log(
    //   "INPUT_CHOICES - Function_mintShares - VARIABLE_: Selected Estate",
    //   selectedEstate
    // );
    // console.log(
    //   "INPUT_CHOICES - Function_mintShares - VARIABLE_: Selected Approved Token",
    //   selectedApprovedToken
    // );
    // //Valeur de l'address du CALLER
    // console.log(
    //   "INPUT_CHOICES - Function_mintShares - VARIABLE_: Mint Shares Account",
    //   address
    // );
    // stepSetTokens();
    try {
      //on passe bien ici
      console.log(
        "INPUT_CHOICES - Function_mintShares - TRY CATCH SET APPROVED TOKEND FUNC - BEFORE:"
      );
      const { request } = await prepareWriteContract({
        address: selectedEstate,
        abi: nftAbi,
        functionName: "setApprovedTokens",
        args: [[selectedApprovedToken], true],
      });
      //REquest retourne un array avec l'address du lifeEstate et non du token selectionné

      console.log(
        "INPUT_CHOICES - Function_mintShares - PREPARE WRITE_setApprovedTokens:",
        request
      );
      const { hash } = await writeContract(request);

      console.log(
        "INPUT_CHOICES - Function_mintShares - WRITE_setApprovedTokens - LOG HASH:",
        hash
      );

      // // stepApprove();
      const amount = propertyShares[shareId].price * numShares;
      console.log(
        "INPUT_CHOICES - Function_mintShares- VARIABLE AMOUNT",
        amount
      );

      // //call setApprovedTokens comme test l.56
      // try {
      console.log(
        "INPUT_CHOICES - Function_mintShares - selectedApproveUSDT AVANT"
      );
      const { request2 } = await prepareWriteContract({
        address: selectedApprovedToken,
        abi: erc20Abi,
        functionName: "approve",
        args: [selectedEstate, amount],
      });
      //ON ARRIVE JUSQUE ICI
      console.log(
        "INPUT_CHOICES - Function_mintShares - PREPARE-WRITE_APPROVE - LOG REQUEST",
        request2
      );
      const { hash2 } = await writeContract(request2);
      //DERNIERE ETAPE DE VALIDE
      console.log(
        "INPUT_CHOICES - Function_mintShares - PREPARE-WRITE_APPROVE - LOG HASH",
        hash2
      );

      console.log(
        "INPUT_CHOICES - Function_mintShares - BEFORE CALL PREAPREWRITE_MINT_BUY_TOKEN"
      );
      console.log();
      const { request3 } = await prepareWriteContract({
        address: selectedEstate,
        abi: nftAbi,
        functionName: "mintBuyToken",
        args: [shareId, numShares, selectedApprovedToken],
      });
      const { hash3 } = await writeContract(request3);
    } catch (error) {
      console.log(
        "INPUT_CHOICES - Function_mintShares - PREPARE-WRITE_MINT_BUY_TOKEN - LOG ERROR",
        error
      );
    }
  };



  const handleSubmit = () => {
    event.preventDefault();
    // mintShares();
    setStep(0);
  };

  useEffect(() => {
    console.log("INPUT_CHOICES - USEEFFECT STEP");
    if (step === 0) {
      console.log("INPUT_CHOICES - USEEFFECT STEP - IF STEP = 0", step);
      stepSetTokens();
      // setStep(1);
    } else if (step === 1) {
      console.log("INPUT_CHOICES - USEEFFECT STEP - IF STEP = 1", step);
      stepApprove();
      // setStep(2);
    } else if (step === 2) {
      console.log("INPUT_CHOICES - USEEFFECT STEP - IF STEP = 2", step);
      stepMint();
      // setStep(3);
    }
  }, [step]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center max-w-md p-6 mx-auto space-y-4 bg-white rounded-lg shadow-lg h-13"
    >
      <div className="w-full">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Share ID:
          <input
            type="text"
            value={shareId}
            onChange={(e) => setShareId(e.target.value)}
            className="block w-full p-2 mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Enter share ID"
          />
        </label>
      </div>
      <div className="w-full">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Number of Shares:
          <input
            type="number"
            value={numShares}
            onChange={(e) => setNumShares(e.target.value)}
            className="block w-full p-2 mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Enter number of shares"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={!shareId || !numShares}
        className="px-6 py-2 text-white transition duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
      >
        MINT
      </button>
    </form>
  );
}
