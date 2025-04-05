/*
Context provider for AI analysis state 
by Matthew Campbell
*/

import { createContext, useState } from "react";
import { getLLMResponseFromServer } from "../api/utils/getUtils";

export const AiAnalysisContext = createContext();

export function AiAnalysisProvider({ children }) {
  const [year, setYear] = useState(2023);
  const [loading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [defaultPrompt, setDefaultPrompt] = useState("");
  const [LLMResponse, setLLMResponse] = useState("");

  async function doAnalysis(e, data, user, year) {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    setIsButtonDisabled(true);

    const promptField =
      (customPrompt || defaultPrompt) + `\n\nData: ${JSON.stringify(data)}`;

    if (!promptField) {
      console.error("No prompt provided.");
      setLLMResponse("Please provide a valid prompt.");
      return;
    }

    try {
      const response = await getLLMResponseFromServer(promptField);
      setLLMResponse(response);
    } catch (error) {
      console.error("Error in doAnalysis:", error);
      setLLMResponse("An error occurred: " + error.message);
    } finally {
      setIsLoading(false);
      setIsButtonDisabled(false);
    }
  }

  const handleSelectChange = () => {
    setCustomPrompt("");
  };

  const closeForm = () => {
    setLLMResponse("");
    setCustomPrompt("");
    setDefaultPrompt("");
  };
  return (
    <AiAnalysisContext.Provider
      value={{
        year,
        setYear,
        loading,
        isButtonDisabled,
        customPrompt,
        setCustomPrompt,
        defaultPrompt,
        setDefaultPrompt,
        LLMResponse,
        doAnalysis,
        handleSelectChange,
        closeForm,
      }}
    >
      {children}
    </AiAnalysisContext.Provider>
  );
}
