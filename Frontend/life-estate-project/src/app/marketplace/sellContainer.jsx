"use client";

import { useEffect, useState } from "react";
import { watchContractEvent } from "@wagmi/core";
import { usePublicClient, useAccount, useContractEvent } from "wagmi";
import { parseAbiItem } from "viem";

import SellCard from "./sellCard";

import {
  nftAbi,
  lifeEstateFactoryAddress,
} from "../../../constant/nftConstant";

export default function sellContainer({
  mftToSell,
  setNftToSell,
  lifeEstateAddresses,
}) {
  const [newEvent, setNewEvent] = useState();
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
  //       (log) => console.log("Détails de l'événement", log)
  //     );

  //     return unwatch; // Retourne la fonction pour arrêter l'écoute plus tard
  //   } catch (error) {
  //     console.log("Erreur lors de l'appel à readNftMinted", error);
  //   }
  // };

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
  const client = usePublicClient();

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
        "event PartMinted(address indexed owner, uint256 indexed partId, uint256 amount)"
      ),
      fromBlock: 4380903n,
      toBlock: 4854605n,
    });

    const [nftMintedLogs] = await Promise.all([getNftMinted]);

    console.log("SellCOntainers - Promesses chargees", nftMintedLogs);

    const allTheNft = nftMintedLogs.map((nftAdded) => {
      console.log("SellCOntainers - ENTRe DANS LE MAPPING", nftAdded);

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

  return (
    <>
      <h1 className="my-4 text-4xl text-center">List of your tokens</h1>
      <button onClick={getEvents}>LA</button>
      {events.map((event) => {
        return (
          <SellCard params={event} />

          /* <div>
            <p>NFT ADDRESS: {event.nftMintedAddress}</p>
            <p>{event.owner}</p>
            <p>{event.partId}</p>
            <p>{event.amount}</p>
          </div> */
        );
      })}
      {/* <button onClick={getEvents}>Coucocu</button> */}
    </>
  );
}
