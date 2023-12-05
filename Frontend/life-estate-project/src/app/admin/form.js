"use client";

import { useState } from "react";
import SubmitBtn from "../components/Button/submitButton";

export default function FormEstate() {
  const [estateSpecs, setEstateSpecs] = useState({
    marketPrice: "",
    propertyName: "",
    propertySurfaceInSquareMeters: "",
    rooms: 1,
    bedRooms: 1,
    cityLocation: "",
    countryLocation: "",
    pool: false,
    garage: false,
    garden: false,
    uri: "",
  });

  const [estateShares, setEstateShares] = useState(
    Array(10).fill({ mintSupply: "", totalSupply: "", price: "" })
  );

  const handleEstateSpecsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEstateSpecs((prevSpecs) => ({
      ...prevSpecs,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEstateSharesChange = (index, e) => {
    const { name, value } = e.target;
    const newShares = [...estateShares];
    newShares[index] = { ...newShares[index], [name]: value };
    setEstateShares(newShares);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would handle the submission to the smart contract
    console.log("Estate Specs:", estateSpecs);
    console.log("Estate Shares:", estateShares);
  };

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
      {estateShares.map((share, index) => (
        <div key={index} className="flex flex-wrap mb-4">
          <div className="w-full mb-4 md:w-1/2 md:pr-2 md:mb-0">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              Part {index + 1} Total Supply
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              value={share.totalSupply}
              onChange={(e) =>
                handleEstateSharesChange(index, e, "totalSupply")
              }
              placeholder="Total Supply"
            />
          </div>
          <div className="w-full md:w-1/2 md:pl-2">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              Part {index + 1} Price Per Share
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              value={share.pricePerShare}
              onChange={(e) =>
                handleEstateSharesChange(index, e, "pricePerShare")
              }
              placeholder="Price Per Share"
            />
          </div>
        </div>
      ))}
      <SubmitBtn />
    </form>
  );
}
