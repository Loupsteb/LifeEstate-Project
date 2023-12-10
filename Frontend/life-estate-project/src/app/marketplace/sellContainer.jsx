"use client";

import { useEffect, useState } from "react";
import { watchContractEvent, readContract } from "@wagmi/core";
import { usePublicClient, useAccount, useContractEvent } from "wagmi";
import { createPublicClient, http } from "viem";

import { parseAbiItem } from "viem";

import SellCard from "./sellCard";

import { nftAbi } from "../../../constant/nftConstant";

import {
  abi,
  lifeEstateFactoryAddress,
} from "../../../constant/factoryConstant";

export default function sellContainer({
  mftToSell,
  setNftToSell,
  lifeEstateAddresses,
}) {
  const [newEvent, setNewEvent] = useState();
  const [userTokens, setUserTokens] = useState([]);
  // const readNftMinted = async (nftAddress) => {
  //   console.log("Voir si readNftMinted LU");
  //   try {
  //     const unwatch = watchContractEvent(
  //       {
  //         address: nftAddress,
  //         abi: nftAbi,
  //         eventName: "PartMinted",
  //         listener: (from, to, amount) => {
  //           setNewEvent({ from, to, amount });
  //         },
  //       },

  //       (log) => console.log("Details de l'event", log)
  //     );
  //   } catch (error) {
  //     console.log("Error-call readNftMinted", error);
  //   }
  //   // unwatch();
  //   return true;
  // };

  // useEffect(() => {
  //   console.log("NEW EVENT", newEvent);
  // }, [newEvent]);

  // const readNftMinted = (nftAddress) => {
  // const unwatch = watchContractEvent(
  //   {
  //     address: lifeEstateFactoryAddress,
  //     abi: abi,
  //     eventName: "LifeEstateDeployed",
  //   },
  //   (events) => {
  //     console.log("Before-lastPropertyAddress", lastPropertyAddress);
  //     if (events.length > 0 && events[0].args) {
  //       const propertyAddress = events[0].args.propertyAddress;
  //       setLastPropertyAddress(propertyAddress);
  //       console.log("After-lastPropertyAddress", lastPropertyAddress);
  //       console.log("After-propertyAddress", propertyAddress);
  //     }
  //   }
  // );

  // const readAddressList = async () => {
  //   console.log("Voir si ReadAddressList LU");
  //   for (let index = 0; index < lifeEstateAddresses.length; index++) {
  //     const ownedTokens = readNftMinted(lifeEstateAddresses[index]);
  //   }
  // };

  // useEffect(() => {
  //   console.log("Verifie si USEEFFECT OK");
  //   readAddressList();
  // }, []);

  //-!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // const client = usePublicClient();
  const client = createPublicClient({
    transport: http(
      `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
    ),
  });

  const [events, setEvents] = useState([]);

  //Elie Event
  // useContractEvent({
  //   address: "0xF21D93eEa52Eddd3adb5A6D63599eb653334957B",
  //   abi: nftAbi,
  //   eventName: "PartMinted",
  //   listener(log) {
  //     //
  //     console.log("USE CONTRACT EVENT - LOG", log);
  //   },
  // });

  // const readPartMinted = () => {
  //   try {
  //     const unwatch = watchContractEvent(
  //       {
  //         address: "0xF21D93eEa52Eddd3adb5A6D63599eb653334957B",
  //         abi: nftAbi,
  //         eventName: "PartMinted",
  //       },
  //       (log) => console.log(log)
  //     );
  //     unwatch();
  //   } catch (error) {
  //     console.log("Error-call readPartMinted", error);
  //   }
  // };
  // useEffect(() => {
  //   watchContractEvent(
  //     {
  //       address: "0xF21D93eEa52Eddd3adb5A6D63599eb653334957B",
  //       abi: nftAbi,
  //       eventName: "PartMinted",
  //     },
  //     (log) => console.log(log)
  //   );
  // }, []);
  //ISCONNECTED
  const { isConnected, address } = useAccount();

  const getEvents = async () => {
    console.log("SellCOntainers - Voir si getEvents LU");
    const getNftMinted = client.getLogs({
      // address: "0x9f508Ff1991DAD736737664AE5Cc77c9c6756A9f",
      event: parseAbiItem(
        `event PartMinted(address indexed owner, uint256 indexed partId, uint256 amount)`
      ),
      fromBlock: 4380903n,
      toBlock: 4856210n,
    });

    const [nftMintedLogs] = await Promise.all([getNftMinted]);

    console.log("SellCOntainers - Promesses chargees", nftMintedLogs);

    const allTheNft = nftMintedLogs.map((nftAdded) => {
      console.log(
        "SellCOntainers - nftAdded.args.partId",
        nftAdded.args.partId
      );

      //NON LOGE
      console.log("SellCOntainers - partId", partId);

      console.log("SellCOntainers - ENTRe DANS LE MAPPING", nftAdded.args);

      const nftMintedAddress = nftAdded.address;

      const partId = parseInt(nftAdded.args.partId);

      const amount = parseInt(nftAdded.args.amount);
      return {
        nftMintedAddress: nftMintedAddress,
        owner: nftAdded.args.owner,
        partId: partId,
        amount: amount,
      };
    });

    setEvents(allTheNft);
  };

  useEffect(() => {
    console.log("SELL CONTAINERS_ USE EFFEST events avec ALL THE NFT", events);
  }, [events]);

  useEffect(() => {
    console.log("SellCOntainers - ENTRE DANS LE USE EFFECT");
    const getAllEvents = async () => {
      console.log("SellCOntainers - EVENT CALL DEPUIS USEEFFECT");
      // if (address !== "undefined") {
      await getEvents();
      // }
    };
    getAllEvents();
  }, []);

  const readNewBalance = async () => {
    console.log("SELL CONTAINERS - Voir si READNEWBALANCE LU");
    try {
      const data = await readContract({
        address: lifeEstateFactoryAddress,
        abi: abi, //abi de la factory
        functionName: "getAllLifeEstate",
      });
      console.log(
        //Valeur de l'address du caller
        "SELLCONTAINERS - Function_READBALAMCE - READ CONTRACT : ",
        data
      );
      readAllNft(data);
      // setListedTokens(data);
      //ERROR The contract function "getAllLifeEstate" returned no data ("0x").
    } catch (error) {
      //ERROR ContractFunctionExecutionError: The contract function "getAllLifeEstate" returned no data ("0x").
      console.log(
        "SELLCONTAINERS - Function_READBALANCE - READ CONTRACT :  ERROR",
        error
      );
    }
  };

  const readAllNft = async (addressArray) => {
    console.log("BuyContainers - Voir si readAllNft LU", addressArray);
    const userAddress = address;
    for (let index = 0; index < addressArray.length; index++) {
      // for (let tokenIndex = 0; tokenIndex < 11; tokenIndex++) {
      try {
        const data = await readContract({
          address: addressArray[index],
          abi: nftAbi,
          functionName: "getTokensOf",
          args: [userAddress],
        });
        console.log(
          //Valeur de l'address du caller
          `SELLCONTAINERS - readAllNft - READ CONTRACT : ${addressArray[index]},/data:${data}`
        );
        console.log("DATA :", data);
        setUserTokens((userTokens) => {
          const obj = {
            address: addressArray[index],
            tokens: data.map((AMOUNT, id) => {
              if (AMOUNT !== 0n) {
                return { id: id, amount: AMOUNT };
              }
            }),
            // .filter((token) => token.amount !== 0n),
          };
          return [...userTokens, obj];
        });
        console.log("SELL CONTAINERS - USER TOKENS.id", userTokens.id);
        // setListedTokens(data);
      } catch (error) {
        console.log(
          "SELLCONTAINERS - Function_readAllNft - READ CONTRACT :  ERROR",
          error
        );
      }
      // }
    }
  };

  // //GPT Aujourd'hui
  // const readAllNft = async (addressArray) => {
  //   console.log("BuyContainers - Voir si readAllNft LU", addressArray);
  //   const userAddress = address;
  //   const promises = addressArray.map((contractAddress) => {
  //     return readContract({
  //       address: contractAddress,
  //       abi: nftAbi,
  //       functionName: "getTokensOf",
  //       args: [userAddress],
  //     })
  //       .then((data) => {
  //         console.log(
  //           `SELL CONTAINERS Data from contract ${contractAddress}:`,
  //           data
  //         );
  //         return {
  //           address: contractAddress,
  //           tokens: data
  //             .filter((token) => token !== 0n)
  //             .map((amount, id) => ({ id, amount })),
  //         };
  //         console.log("SELL CONTAINERS - Retours après traitement ", promises);
  //       })
  //       .catch((error) => {
  //         console.error(`Error reading contract ${contractAddress}:`, error);
  //         return null; // Retourne null ou une valeur par défaut pour les erreurs.
  //       });
  //   });

  //   try {
  //     const results = await Promise.all(promises);
  //     // Filtrez les résultats null qui sont dus à des erreurs.
  //     const validResults = results.filter((result) => result !== null);
  //     setUserTokens(validResults);
  //   } catch (error) {
  //     console.error("SELLCONTAINERS - Function_readAllNft - ERROR", error);
  //   }
  // };

  useEffect(() => {
    console.log(
      "!!!!!!!!!SELLCONTAINERS - USE EFFECT VARIABLE_USERTOKENS!!!!!!!!!",
      userTokens
    );
  }, [userTokens]);

  // useEffect(() => {
  //   readNewBalance();
  // }, []);

  return (
    <>
      <h1 className="my-4 text-4xl text-center">List of your tokens</h1>
      <button onClick={readNewBalance}>LA</button>
      {userTokens.map(
        (tokenInfo, index) =>
          tokenInfo.tokens.map(
            (token, idt) =>
              token && (
                <SellCard
                  key={index.toString() + idt.toString()}
                  index={idt}
                  tokenInfo={tokenInfo}
                />
              )
          )
        /* <SellCard key={index} index={index} tokenInfo={tokenInfo} /> */

        /* <div>
            <p>NFT ADDRESS: {event.nftMintedAddress}</p>
            <p>{event.owner}</p>
            <p>{event.partId}</p>
            <p>{event.amount}</p>
          </div> */
      )}
      {/* <button onClick={getEvents}>Coucocu</button> */}
    </>
  );
}
