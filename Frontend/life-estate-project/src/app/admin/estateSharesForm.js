"use client";

import { useState, useEffect } from "react";

import SubmitBtn from "../components/Button/submitButton";

import {
  abi,
  lifeEstateFactoryAddress,
} from "../../../constant/factoryConstant";

// import {
//   usePrepareContractWrite,
//   useContractWrite,
//   useWaitForTransaction,
// } from "wagmi";

import {
  watchContractEvent,
  prepareWriteContract,
  writeContract,
  readContract,
} from "@wagmi/core";

import { usePublicClient, useAccount } from "wagmi";
import { parseAbiItem } from "viem";

export default function EstateShareForm({ estateAddress }) {
  const [partTotalSupplies, setPartTotalSupplies] = useState(Array(11).fill(0));
  const [partPrices, setPartPrices] = useState(Array(11).fill(0));
  const [lastPropertyAddress, setLastPropertyAddress] = useState();
  const [events, setEvents] = useState([]);

  const { address } = useAccount();

  console.log("ESTATE_SHARES_FORM - VARIABLE_estateAddress:", estateAddress);
  //remplacer lifeEstateFactoryAddress par une chaine vide
  // const {
  //   config,
  //   error: prepareError,
  //   isError: isPrepareError,
  // } = usePrepareContractWrite({
  //   address: lifeEstateFactoryAddress,
  //   abi: abi,
  //   functionName: "initLifeEstateParts",
  //   //ajouter l'addresse de la propriété
  //   args: [lastPropertyAddress, [...partTotalSupplies], [...partPrices]],
  // });

  // tentative de lecture de l'event suite au deployEstate du compo estateSpecsForm
  // const unwatch = watchContractEvent(
  //   {
  //     address: lifeEstateFactoryAddress,
  //     abi: abi,
  //     eventName: "LifeEstateDeployed",
  //   },
  //   (events) => {
  //     console.log(
  //       "EstateShareFOrmBefore - WatchContract-LifeEstateDeployed - lastPropertyAddress",
  //       lastPropertyAddress
  //     );
  //     if (events.length > 0 && events[0].args) {
  //       const propertyAddress = events[0].args.propertyAddress;
  //       setLastPropertyAddress(propertyAddress);
  //       console.log(
  //         "ESTATE_SHARES_FORM - VARIABLE_After-lastPropertyAddress:",
  //         lastPropertyAddress
  //       );
  //       console.log(
  //         "ESTATE_SHARES_FORM - VARIABLE_After-propertyAddress:",
  //         propertyAddress
  //       );
  //     }
  //   }
  // );

  // La fonction initLifeEstatePartsFunc est appelé 2 fois alors qu'il n'y a qu'un click ca créé 2 une propriété, une qui à ses parts associés et l'autre
  // non car les parts ont deja ete initialisé

  const initLifeEstatePartsFunc = async () => {
    try {
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
      //On passe bien l'addresse du contract terminant par aa3
      //deuxieme call avec cette erreur: "message": "Error: VM Exception while processing transaction: reverted with reason string 'Parts are already initialized'"
      console.log(
        "ESTATE_SHARES_FORM -Function_initLifeEstatePartsFuncs - REQUEST:",
        request
      );
      // return hash;
    } catch (error) {
      console.log(
        "ESTATE_SHARES_FORM - WRITE-Function_initLifeEstatePartsFuncs - ERROR:",
        error
      );
    }
    //troisieme demande d interaction contrat et elle passe ! fonction initOwner avec address du connecté et nftAddress
    // initOwner(lastPropertyAddress);
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

  // const { data, write } = useContractWrite(config);

  // const { isLoading, isSuccess } = useWaitForTransaction({
  //   hash: data?.hash,
  // });

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
    // e.preventDefault();
    initLifeEstatePartsFunc();
    // await write?.();
  };

  // useEffect(() => {
  //   console.log("estateAddress", estateAddress);
  //   setLastPropertyAddress(estateAddress);
  // }, []);

  const client = usePublicClient();

  // const getEvents = async () => {
  //   console.log(
  //     "ESTATE_SHARES_FORM -VARIABLE_: LIFE_ESTATE_FACTORY_ADDRESS",
  //     lifeEstateFactoryAddress
  //   );
  //   console.log("EstateShareForm - GetEvents");
  //   const getNftDeployed = client.getLogs({
  //     address: lifeEstateFactoryAddress,
  //     event: parseAbiItem(
  //       "event LifeEstateDeployed(address indexed propertyAddress, string propertyName)"
  //     ),
  //     fromBlock: 0n,
  //     toBlock: 1000n,
  //   });

  //   const [nftMintedLogs] = await Promise.all([getNftDeployed]);

  //   console.log(
  //     "EstateShareForm - GetEvents Promesses chargees",
  //     nftMintedLogs
  //   );

  //   const nftAddedlength = nftMintedLogs.length;
  //   console.log("EstateShareForm - GetEvents nftAddedlength", nftAddedlength);

  //   const allTheNft = nftMintedLogs.map((nftAdded, index) => {
  //     console.log(
  //       "EstateShareForm - GetEvents ENTRE DANS LE MAPPING",
  //       nftAdded
  //     );

  //     console.log("EstateSharefrom Index NFTADDEDLENGTH", index);

  //     if (index === nftAddedlength - 1) {
  //       setLastPropertyAddress(nftAdded.args.propertyAddress);
  //     }

  //     // const propertyAddress = parseInt(nftAdded.args.propertyAddress);

  //     // const propertyName = parseInt(nftAdded.args.propertyName);
  //     return {
  //       propertyAddress: nftAdded.args.propertyAddress,
  //       propertyName: nftAdded.args.propertyName,
  //     };
  //   });

  //   setEvents(allTheNft);
  // };

  // useEffect(() => {
  //   console.log("SELL CONTAINERS_ USE EFFEST events avec ALL THE NFT", events);
  // }, [events]);

  // useEffect(() => {
  //   console.log("SellCOntainers - ENTRE DANS LE USE EFFECT");
  //   const getAllEvents = async () => {
  //     console.log("SellCOntainers - EVENT CALL DEPUIS USEEFFECT");
  //     // if (address !== "undefined") {
  //     await getEvents();
  //     // }
  //   };
  //   getAllEvents();
  // }, []);

  //methode read du nft deployé
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
        //Valeur de l'address du caller
        "EstateSharesForm - Function_fetchListTokenLogs - READ CONTRACT : ARRAy_OF_ALL_LISTINGS",
        data
      );
      setLastPropertyAddress(data[data.length - 1]);
      // setListedTokens(data);
    } catch (error) {
      console.log("EstateSharesForm - Function_READ LAST NFT : ERROR", error);
    }
  };

  return (
    <div className="flex">
      <form className="w-full max-w-3xl p-5 mx-auto">
        <div>
          {partTotalSupplies.map((share, index) => (
            <div key={index}>
              <div className="flex inline-flex flex-wrap w-full mb-4 md:w-1/2 md:pr-2">
                <label className="block mb-2 text-sm font-bold text-gray-700">
                  Part {index + 1} Total Supply
                </label>
                <input
                  type="number"
                  name="partTotalSupplies"
                  value={share.partTotalSupplies}
                  onChange={(e) => handleSuppliesChange(index, e.target.value)}
                  placeholder="Total Supply"
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
          ))}
          {partPrices.map((share, index) => (
            <div key={index}>
              <div className="flex inline-flex flex-wrap w-full mb-4 md:w-1/2 md:pr-2">
                <label className="block mb-2 text-sm font-bold text-gray-700">
                  Part {index + 1} Price Per Share
                </label>
                <input
                  type="number"
                  name="partPrices"
                  value={share.partPrices}
                  onChange={(e) => handlePricesChange(index, e.target.value)}
                  placeholder="Price Per Share"
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
          ))}
        </div>
        <button
          disabled={!events}
          onClick={(e) => {
            e.preventDefault();
            initLifeEstatePartsFunc();
          }}
        >
          INIT SHARE
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            // getEvents();
            readNewNft();
          }}
        >
          Call Event
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            initOwner(lastPropertyAddress);
          }}
        >
          INIT OWNER
        </button>
        {/* {isSuccess && (
        <div>
          Successfully submit the life estate specifications
          <div>
            <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
          </div>
        </div>
      )} */}
      </form>
    </div>
  );
}

{
  /* <button disabled={!write || isLoading} onClick={() => write()}>
        {isLoading ? "Submiting..." : "Submit"}
      </button>
      {isSuccess && (
        <div>
          Successfully submit the life estate specifications
          <div>
            <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
          </div>
        </div>
      )} */
}
