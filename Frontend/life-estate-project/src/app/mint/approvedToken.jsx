"use client";

import { useEffect, useState } from "react";

import { approvedTokens } from "../../../constant/approvedToken";

export default function ApprovedToken({ setSelectedApprovedToken }) {
  const [tokens, setTokens] = useState([""]);

  const loadToken = () => {
    try {
      console.log(
        "APPROVED_TOKENS - Function_loadToken - APPROVEDTOKENS",
        approvedTokens
      );
      setTokens(approvedTokens);
      setSelectedApprovedToken(approvedTokens[0]);
    } catch (error) {
      console.log("APPROVED_TOKENS-Function_loadToken - ERROR", error);
    }
  };

  const handleSubmit = (event) => {
    setSelectedApprovedToken(event.target.value);
    console.log(
      "APPROVED_TOKENS - Function_HANDLESUBMIT - EVENT_TARGET_VALUE",
      event.target.value
    );
  };

  useEffect(() => {
    console.log(
      "APPROVED_TOKENS - USE_EFFECT - APPROVEDTOKENS",
      approvedTokens
    );
    console.log("APPROVED_TOKENS - USE_EFFECT - TOKENS", tokens);
    loadToken();
  }, []);

  return (
    <div>
      <label>
        Add the authorized token address: :
        <select name="selectedApprovedTokens" onChange={handleSubmit}>
          {tokens?.map((token) => (
            <option key={token} value={token}>
              {token}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
