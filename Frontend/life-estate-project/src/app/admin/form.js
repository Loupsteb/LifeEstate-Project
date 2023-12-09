"use client";

import { useEffect, useState } from "react";

import EstateShareForm from "./estateSharesForm";
import EstateSpecsForm from "./estateSpecsForm";

export default function Form() {
  const [estateAddress, setEstateAddress] = useState("");
  console.log("FORM - VARIABLE_estateAddress:", estateAddress);

  useEffect(() => {
    console.log("FORM USEEFFECT POUR ESTATEADDRESS");
  }, [estateAddress]);

  return (
    <>
      <EstateSpecsForm setEstateAddress={setEstateAddress} />
      <EstateShareForm estateAddress={estateAddress} />
    </>
  );
}
