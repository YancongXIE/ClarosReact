// a more generalist fetch hook

import { useState, useEffect } from "react";
import { kDEFAULT_ERROR_MSG } from "../utils/constants";
import { getLLMResponseFromServer } from "../utils/getUtils";

export function useFetchLLMResponse(prompt, dataSet) {
  const [loading, setLoading] = useState(false);
  const [responseFromLLM, setResponseFromLLM] = useState();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

        try {
          const response = await getLLMResponseFromServer(prompt, dataSet);
          setResponseFromLLM(response);
          setError(null);
        } catch (error) {
          setError(error.message ?? kDEFAULT_ERROR_MSG);
        } finally {
          setLoading(false);
        }
      
    };

    fetchData();

  }, []);

  return {
    loading,
    responseFromLLM,
    error,
  };
}
