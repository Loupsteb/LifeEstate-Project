"use client";

import { useState, useEffect } from "react";

export default function SelectorEstate({ allLifeEstate, setSelectedEstate }) {
  const handleSubmit = (event) => {
    setSelectedEstate(event.target.value);
    console.log(
      "SELECTOR_ESTATE - SetSelectedEstate via HANDLESUBMIT - EVENT_TARGET_VALUE",
      event.target.value
    );
  };

  useEffect(() => {
    if (allLifeEstate.length > 0) {
      setSelectedEstate(allLifeEstate[0]);
    }
  }, [allLifeEstate, setSelectedEstate]);

  return (
    <>
      <label>
        Choose an Life Estate :
        <select name="selectedEstate" onChange={handleSubmit}>
          {allLifeEstate.map((estate) => (
            <option key={estate} value={estate}>
              {estate}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}
