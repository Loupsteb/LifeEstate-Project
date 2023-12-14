"use client";

import { useState, useEffect } from "react";

import SubmitBtn from "../components/Button/submitButton";

import {
  abi,
  lifeEstateFactoryAddress,
} from "../../../constant/factoryConstant";

import {
  watchContractEvent,
  prepareWriteContract,
  writeContract,
  readContract,
  waitForTransaction,
} from "@wagmi/core";

import { usePublicClient, useAccount } from "wagmi";
import { parseAbiItem } from "viem";

export default function EstateShareForm({ estateAddress, isDeployed }) {
  const [partTotalSupplies, setPartTotalSupplies] = useState(Array(11).fill(0));
  const [partPrices, setPartPrices] = useState(Array(11).fill(0));
  const [lastPropertyAddress, setLastPropertyAddress] = useState();
  const [events, setEvents] = useState([]);
  const [isReady, setIsReady] = useState(false);

  const { address } = useAccount();

  console.log("ESTATE_SHARES_FORM - VARIABLE_estateAddress:", estateAddress);

  const initLifeEstatePartsFunc = async () => {
    try {
      console.log(
        "!!!!!!!!!!!!! LAST PROPERTY ADDRESS !!!!!!!!!!!!!",
        lastPropertyAddress
      );
      const { request } = await prepareWriteContract({
        address: lifeEstateFactoryAddress,
        abi: abi,
        functionName: "initLifeEstateParts",
        args: [lastPropertyAddress, [...partTotalSupplies], [...partPrices]],
      });
      const { hash } = await writeContract(request);
      console.log(
        "ESTATE_SHARES_FORM -PREPARE-Function_initLifeEstatePartsFuncs - HASH:",
        hash
      );

      console.log(
        "ESTATE_SHARES_FORM -Function_initLifeEstatePartsFuncs - REQUEST:",
        request
      );
    } catch (error) {
      console.log(
        "ESTATE_SHARES_FORM - WRITE-Function_initLifeEstatePartsFuncs - ERROR:",
        error
      );
    }
  };

  const initOwner = async (nftAddress) => {
    try {
      const { request } = await prepareWriteContract({
        address: lifeEstateFactoryAddress,
        abi: abi,
        functionName: "initOwner",
        args: [address, nftAddress],
      });
      const { hash } = await writeContract(request);
      console.log("ESTATE_SHARES_FORM -Function_initOwner - HASH", hash);
      console.log("ESTATE_SHARES_FORM -Function_initOwner - REQUEST", request);
      return hash;
    } catch (error) {
      console.log("ESTATE_SHARES_FORM -Function_initOwner - ERROR", error);
    }
  };

  const handleSuppliesChange = (index, value) => {
    console.log("ESTATE_SHARES_FORM - handleSupplies Change - VALUE", value);
    const newSupplies = [...partTotalSupplies];
    newSupplies[index] = value;
    setPartTotalSupplies(newSupplies);
  };

  const handlePricesChange = (index, value) => {
    console.log("ESTATE_SHARES_FORM - handlePrices Change - VALUE", value);
    const newPrices = [...partPrices];
    newPrices[index] = value;
    setPartPrices(newPrices);
  };

  const handleSubmit = async () => {
    console.log("ESTATE_SHARES_FORM - handleSubmit:");
    initLifeEstatePartsFunc();
  };

  const client = usePublicClient();

  const readNewNft = async () => {
    console.log(
      "EstateSharesForm - Function_READ LAST NFT - READ CONTRACT : JE RENTRE DS LE READ"
    );
    try {
      const data = await readContract({
        address: lifeEstateFactoryAddress,
        abi: abi,
        functionName: "getAllLifeEstate",
      });
      console.log(
        "EstateSharesForm - Function_fetchListTokenLogs - READ CONTRACT : ARRAy_OF_ALL_LISTINGS",
        data
      );
      setLastPropertyAddress(data[data.length - 1]);
      setIsReady(true);
    } catch (error) {
      console.log("EstateSharesForm - Function_READ LAST NFT : ERROR", error);
    }
  };

  useEffect(() => {
    console.log(
      "ENTRE DANS LE USEEFFECT ESTATESHAREFORM ISDEPLOYED*-*-*-*--*--*",
      isDeployed
    );
    if (isDeployed) {
      console.log("!!!!ENTRE DANS LE USEEFFECT");
      readNewNft();
    }
  }, [isDeployed]);

  return (
    <div className="flex">
      <form className="w-full max-w-3xl p-5 mx-auto mt-3">
        <div className="w-full mb-4">
          {partTotalSupplies.map((supply, index) => (
            <div key={index} className="flex flex-wrap mb-2">
              <div className="w-1/2 pr-2">
                <label className="block mb-2 text-sm font-bold text-gray-700">
                  Part {index + 1} Total Supply
                </label>
                <input
                  type="number"
                  min="0"
                  name="partTotalSupplies"
                  value={supply}
                  onChange={(e) => {
                    const selectedSupplies = Math.max(
                      0,
                      Number(e.target.value)
                    );
                    handleSuppliesChange(index, selectedSupplies);
                  }}
                  placeholder="Total Supply"
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="w-1/2 pr-2">
                <label className="block mb-2 text-sm font-bold text-gray-700">
                  Part {index + 1} Price Per Share
                </label>
                <input
                  type="number"
                  min="0"
                  name="partPrices"
                  value={partPrices[index]}
                  onChange={(e) => {
                    const selectedPrice = Math.max(0, Number(e.target.value));
                    handlePricesChange(index, selectedPrice);
                  }}
                  placeholder="Price Per Share"
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {/* <button
            onClick={(e) => {
              e.preventDefault();
              readNewNft();
            }}
            className="px-4 py-2 text-black bg-gray-300 border border-transparent rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          >
            READ EVENT
          </button> */}

          <button
            disabled={!isDeployed}
            // disabled={!events}

            onClick={(e) => {
              e.preventDefault();
              initLifeEstatePartsFunc();
            }}
            className="px-4 py-2 text-black bg-gray-300 border border-transparent rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          >
            INIT SHARE
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              initOwner(lastPropertyAddress);
            }}
            className="px-4 py-2 text-black bg-gray-300 border border-transparent rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          >
            INIT OWNER
          </button>
        </div>
      </form>
    </div>
  );
}
