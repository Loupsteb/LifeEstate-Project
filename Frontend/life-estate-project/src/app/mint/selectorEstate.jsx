"use client";

import { useState } from "react";

//Compo OK set correctement SELECTEDESTATE avec l'address selectionné dans la liste
export default function SelectorEstate({ allLifeEstate, setSelectedEstate }) {
  const handleSubmit = (event) => {
    setSelectedEstate(event.target.value);
    console.log(
      "SELECTOR_ESTATE - SetSelectedEstate via HANDLESUBMIT - EVENT_TARGET_VALUE",
      event.target.value
    );
  };

  return (
    <>
      <label>
        Choose an Life Estate :
        <select name="selectedEstate" onChange={handleSubmit}>
          {allLifeEstate.map((estate) => (
            /*changer la KEY*/
            <option key={estate} value={estate}>
              {estate}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}
