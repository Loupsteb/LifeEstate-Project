"use client";

import { useState } from "react";

import { nftAbi, erc20Abi } from "../../../constant/nftConstant";

import MintBtn from "../components/Button/mintBtn";

import { prepareWriteContract, writeContract, readContract } from "@wagmi/core";
import { useAccount } from "wagmi";

export default function InputChoice({
  selectedEstate,
  propertyShares,
  selectedApprovedToken,
}) {
  const [shareId, setShareId] = useState("");
  const [numShares, setNumShares] = useState("");
  const [approvedToken, setApprovedToken] = useState([]);
  const { address } = useAccount();

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
    console.log(
      "INPUT_CHOICES - Function_mintShares - VARIABLE_: Selected Estate",
      selectedEstate
    );
    console.log(
      "INPUT_CHOICES - Function_mintShares - VARIABLE_: Selected Approved Token",
      selectedApprovedToken
    );
    //Valeur de l'address du CALLER
    console.log(
      "INPUT_CHOICES - Function_mintShares - VARIABLE_: Mint Shares Account",
      address
    );

    try {
      const data = await readContract({
        address: selectedEstate,
        abi: nftAbi,
        functionName: "owner",
      });
      console.log(
        //Valeur de l'address du caller
        "INPUT_CHOICES - Function_mintShares - READ CONTRACT OWNER VARIABLE_: OWNER DU NFT",
        data
      );
    } catch (error) {
      console.log(
        "INPUT_CHOICES - Function_mintShares - READ CONTRACT OWNER VARIABLE_: ERROR",
        error
      );
    }
    //call setApprovedTokens comme test l.56
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
      //DERNIERE ETAPE DE VALIDE
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
    //NON VU PAR L'appkication
    const amount = propertyShares[shareId].price * numShares;
    console.log("INPUT_CHOICES - Function_mintShares- VARIABLE AMOUNT", amount);

    //call setApprovedTokens comme test l.56
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
      //DERNIERE ETAPE DE VALIDE
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

    //faire le setApprovedToken de LUSDT comme l.56 de Test
    //faire le approve de LUSDT comme l.64 de Test via un call writeContract
    // if (!valideInput) return;
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
      console.log(
        "INPUT_CHOICES - Function_mintShares - PREPARE-WRITE_MINT_BUY_TOKEN - LOG REQUEST",
        request
      );
      const { hash } = await writeContract(request);
      console.log(
        "INPUT_CHOICES - Function_mintShares - PREPARE-WRITE_MINT_BUY_TOKEN - LOG HASH",
        hash
      );
    } catch (error) {
      console.log(
        "INPUT_CHOICES - Function_mintShares - PREPARE-WRITE_MINT_BUY_TOKEN - LOG ERROR",
        error
      );
    }
  };

  const readApprovedToken = async () => {
    try {
      const data = await readContract({
        address: selectedEstate,
        abi: nftAbi,
        functionName: "approvedTokensArray",
      });
      console.log(
        "INPUT_CHOICES - Function_readApprovedToken - READ_CONTRACT-APPROVED_TOKENS_ARRAY - LOG HASH",
        data
      );
      setApprovedToken(data);
    } catch (error) {
      console.log(
        "INPUT_CHOICES - Function_readApprovedToken - READ_CONTRACT-APPROVED_TOKENS_ARRAY - LOG ERROR",
        error
      );
    }
  };

  const handleSubmit = () => {
    event.preventDefault();
    mintShares();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center space-y-1"
    >
      <label className="flex items-center ">
        Share ID:
        <input
          type="text"
          value={shareId}
          onChange={(e) => setShareId(e.target.value)}
          className="ml-2"
        />
      </label>
      <label className="flex items-center ">
        Number of Shares:
        <input
          type="number"
          value={numShares}
          onChange={(e) => setNumShares(e.target.value)}
          className="ml-2"
        />
      </label>
      {/* <MintBtn onClick={mintShares} /> */}
      <button disabled={!shareId || !numShares} onClick={handleSubmit}>
        MINT
      </button>
    </form>
  );
}
