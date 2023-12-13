export const abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "propertyAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "propertyName",
        type: "string",
      },
    ],
    name: "LifeEstateDeployed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_propertyName",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_marketPrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_propertySurfaceInSquareMeters",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_rooms",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_bedRooms",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_cityLocation",
        type: "string",
      },
      {
        internalType: "bool",
        name: "_pool",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "_garage",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "_garden",
        type: "bool",
      },
      {
        internalType: "string",
        name: "_uri",
        type: "string",
      },
    ],
    name: "deployLifeEstate",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllLifeEstate",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "getOneLifeEstate",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newLifeEstate",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "_partTotalSupplies",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "_partPrices",
        type: "uint256[]",
      },
    ],
    name: "initLifeEstateParts",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
      {
        internalType: "address",
        name: "newLifeEstate",
        type: "address",
      },
    ],
    name: "initOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const lifeEstateFactoryAddress =
  "0x5eDA8bcdA8a57AEF93f43ED22fd7a7561991f0C0";
