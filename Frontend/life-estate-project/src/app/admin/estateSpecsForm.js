"use client";

import { useState, useEffect } from "react";

import {
  abi,
  lifeEstateFactoryAddress,
} from "../../../constant/factoryConstant";

//test pr les deoubles appels
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  readContract,
} from "wagmi";

import { prepareWriteContract, writeContract } from "@wagmi/core";

export default function EstateSpecsForm({ setEstateAddress }) {
  const [estateSpecs, setEstateSpecs] = useState({
    propertyName: "Property Name",
    marketPrice: 0,
    propertySurfaceInSquareMeters: 0,
    rooms: 1,
    bedRooms: 1,
    cityLocation: "City Location",
    pool: false,
    garage: false,
    garden: false,
    uri: "Uri Link",
  });

  // const {
  //   config,
  //   error: prepareError,
  //   isError: isPrepareError,
  // } = usePrepareContractWrite({
  //   address: lifeEstateFactoryAddress,
  //   abi: abi,
  //   functionName: "deployLifeEstate",
  //   args: [
  //     estateSpecs.propertyName,
  //     estateSpecs.marketPrice,
  //     estateSpecs.propertySurfaceInSquareMeters,
  //     estateSpecs.rooms,
  //     estateSpecs.bedRooms,
  //     estateSpecs.cityLocation,
  //     estateSpecs.pool,
  //     estateSpecs.garage,
  //     estateSpecs.garden,
  //     estateSpecs.uri,
  //   ],
  // });

  // const { data, write } = useContractWrite(config);

  // const { isLoading, isSuccess } = useWaitForTransaction({
  //   hash: data?.hash,
  // });

  const deployEstate = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: lifeEstateFactoryAddress,
        abi: abi,
        functionName: "deployLifeEstate",
        args: [
          estateSpecs.propertyName,
          estateSpecs.marketPrice,
          estateSpecs.propertySurfaceInSquareMeters,
          estateSpecs.rooms,
          estateSpecs.bedRooms,
          estateSpecs.cityLocation,
          estateSpecs.pool,
          estateSpecs.garage,
          estateSpecs.garden,
          estateSpecs.uri,
        ],
      });
      const { hash } = await writeContract(request);
      console.log(
        "ESTATE_SHARES_FORM -PREPARE-Function_DEPLOYESTATE - HASH:",
        hash
      );
      //On passe bien l'addresse du contract terminant par aa3
      //deuxieme call avec cette erreur: "message": "Error: VM Exception while processing transaction: reverted with reason string 'Parts are already initialized'"
      console.log(
        "ESTATE_SHARES_FORM -Function_DEPLOYESTATE - REQUEST:",
        request
      );
    } catch (error) {
      console.log("ESTATE_SHARES_FORM -Function_DEPLOYESTATE - ERROR", error);
    }
  };

  // const getDeployedEstateAddress = async () => {
  //   try {
  //   } catch (error) {
  //     console.log("estateSpecForm - getDeployedAddress -error", error);
  //   }
  // };

  const handleEstateSpecsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEstateSpecs((prevSpecs) => ({
      ...prevSpecs,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      "ESTATE_SPECS_FORM - HANDLESUBMIT - VARIABLE_ESTATESPECS:",
      estateSpecs
    );
    deployEstate();
  };

  // const config = await prepareWriteContract({
  //   address: lifeEstateFactoryAddress,
  //   abi: abi,
  //   functionName: "deployLifeEstate",
  //   args: [
  //     estateSpecs.propertyName,
  //     estateSpecs.marketPrice,
  //     estateSpecs.propertySurfaceInSquareMeters,
  //     estateSpecs.rooms,
  //     estateSpecs.bedRooms,
  //     estateSpecs.cityLocation,
  //     estateSpecs.pool,
  //     estateSpecs.garage,
  //     estateSpecs.garden,
  //     estateSpecs.uri,
  //   ],
  // });

  // useEffect(() => {
  //   console.log("beforeIsSuccess", isSuccess);
  //   if (isSuccess) {
  //     console.log("afterIsSuccess", isSuccess);
  //     const fetchNewEstateAddress = async () => {
  //       console.log("fetchNewEstateAddress");
  //       try {
  //         console.log("promiseAddress");
  //         // const promiseAddress = async () => {
  //         //   console.log("readContract");
  //         //  return newAddress;
  //         // };
  //         const newEstate = new Promise(function myRead(resolve, reject) {
  //           const newAddress = readContract({
  //             address: lifeEstateFactoryAddress,
  //             abi: abi,
  //             functionName: "getOneLifeEstate",
  //             args: [0],
  //           });
  //           resolve(newAddress);
  //         });
  //         // const resolve = await Promise.all([promiseAddress]);

  //         console.log("newEstate", newEstate);
  //         setEstateAddress(newEstate);
  //         // setEstateSpecs((prevSpecs) => {
  //         //   ...prevSpecs,
  //         //   estateAddress: resolve,
  //         // });
  //       } catch (error) {
  //         console.log("error", error);
  //       }
  //     };
  //     fetchNewEstateAddress();
  //   }
  // }, [isSuccess]);

  // useEffect(() => {
  //   const fetchProposals = async () => {
  //     try {
  //       const indexes = Array.from(0);

  //       console.log("entré ds le try");

  //       const proposalPromises = async () => {
  //         console.log("entré ds mapping");
  //         const data = await readContract({
  //           address: lifeEstateFactoryAddress,
  //           abi: abi,
  //           functionName: "getOneLifeEstate",
  //           args: [0],
  //         });
  //         console.log("data", data);
  //         return data;
  //       };
  //       console.log("proposalPromises", proposalPromises);
  //       const proposals = await Promise.all([proposalPromises]);

  //       console.log("proposals", proposals);

  //       // setProposals(proposals);
  //     } catch (error) {
  //       console.error("Erreur lors de la lecture du contrat :", error);
  //     }
  //   };

  //   fetchProposals();
  // }, [isSuccess]);

  // useEffect(() => {
  //   console.log("prepareError", prepareError);
  //   console.log("isPrepareError", isPrepareError);
  //   console.log("config", config);
  //   console.log("address factory", abi);
  //   console.log("address factory", lifeEstateFactoryAddress);
  //   console.log("EstateSpecs", estateSpecs);
  //   console.log("Write", write);
  //   console.log("isSuccess", isSuccess);
  // }, []);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl p-5 mx-auto">
      <div className="mb-4">
        <label
          htmlFor="propertyName"
          className="block text-sm font-medium text-gray-700"
        >
          Property Name
        </label>
        <input
          type="text"
          id="propertyName"
          name="propertyName"
          value={estateSpecs.propertyName}
          onChange={handleEstateSpecsChange}
          className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="marketPrice"
          className="block text-sm font-medium text-gray-700"
        >
          Market Price
        </label>
        <input
          type="number"
          id="marketPrice"
          name="marketPrice"
          value={estateSpecs.marketPrice}
          onChange={handleEstateSpecsChange}
          className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="propertySurfaceInSquareMeters"
          className="block text-sm font-medium text-gray-700"
        >
          Property Surface In Square Meters
        </label>
        <input
          type="number"
          id="propertySurfaceInSquareMeters"
          name="propertySurfaceInSquareMeters"
          value={estateSpecs.propertySurfaceInSquareMeters}
          onChange={handleEstateSpecsChange}
          className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="rooms"
          className="block text-sm font-medium text-gray-700"
        >
          Rooms
        </label>
        <input
          type="number"
          id="rooms"
          name="rooms"
          value={estateSpecs.rooms}
          onChange={handleEstateSpecsChange}
          className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="bedRooms"
          className="block text-sm font-medium text-gray-700"
        >
          Bed Rooms
        </label>
        <input
          type="number"
          id="bedRooms"
          name="bedRooms"
          value={estateSpecs.bedRooms}
          onChange={handleEstateSpecsChange}
          className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="cityLocation"
          className="block text-sm font-medium text-gray-700"
        >
          City Location
        </label>
        <input
          type="text"
          id="cityLocation"
          name="cityLocation"
          value={estateSpecs.cityLocation}
          onChange={handleEstateSpecsChange}
          className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div className="flex items-center justify-around mb-4">
        <div className="flex items-center mr-4">
          <input
            type="checkbox"
            id="pool"
            name="pool"
            checked={estateSpecs.pool}
            onChange={handleEstateSpecsChange}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="pool" className="block ml-2 text-sm text-gray-700">
            Pool
          </label>
        </div>

        <div className="flex items-center mr-4">
          <input
            type="checkbox"
            id="garage"
            name="garage"
            checked={estateSpecs.garage}
            onChange={handleEstateSpecsChange}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="garage" className="block ml-2 text-sm text-gray-700">
            Garage
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="garden"
            name="garden"
            checked={estateSpecs.garden}
            onChange={handleEstateSpecsChange}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="garden" className="block ml-2 text-sm text-gray-700">
            Garden
          </label>
        </div>

        <div className="flex items-center ml-4">
          <label htmlFor="uri" className="w-4 mr-5 text-gray-700 h-4text-sm">
            URI
          </label>
          <input
            type="text"
            id="uri"
            name="uri"
            value={estateSpecs.uri}
            onChange={handleEstateSpecsChange}
            className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
      </div>
      <button onClick={handleSubmit}>
        {/* {isLoading ? "Submiting..." : "Submit"} */}
        SUBMIT
      </button>
      {/* {isSuccess && <div>Successfully submit a new life estate</div>} */}
    </form>
  );
}

// function gerWiningProposal(result: number) {
//   const data: any = readContract({
//     address: contractAddress,
//     abi: abi,
//     functionName: "getOneProposal",
//     args: [result],
//   });
//   console.log("data", data);
//   return data;
// }

// useEffect(() => {
//   const myFunc = async () => {
//     const result = await checkWiningProposal();
//     setWinningProposalID(result);
//     const data = await gerWiningProposal(result);
//     setWinningProposal(data);
//   };
//   myFunc();
// }, []);
