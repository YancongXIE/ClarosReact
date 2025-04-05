import { useState, useEffect } from "react";
import { kAPI_URL } from "../../utils/constants";
import { getUrlFromCache, getUrlFromServer } from "../utils/utils";

// Retrieve the list of Countries from the external API
export function useLGANames() {
  const [loading, setLoading] = useState(false);
  const [LGANames, setLGANames] = useState();
  const [error, setError] = useState(null);
  const [cache, setCache] = useState({});

  useEffect(() => {
    const url = `${kAPI_URL}/countries`;

    setLGANames(["Cairns", "Gold Coast", "Noosa", "Whitsunday"]);
    /*
      if (getUrlFromCache(cache, url)) {
  
        setLoading(false);
        setCountries(getUrlFromCache(cache, url));
        setError(null);
  
      } else {
  
        setLoading(true);
        getUrlFromServer(url, false)
          .then((countries) => {
            // Store the response for the URL in the cache
            setCache((prevCache) => ({ ...prevCache, [url]: countries }));
            setCountries(getUrlFromCache(cache, url));
          })
          .catch((error) => {
            setError(error.message ?? kDEFAULT_ERROR_MSG);
          })
          .finally(() => {
            setLoading(false);
          });
      }*/
  }, [cache]);

  return {
    loading: loading,
    LGANames: LGANames,
    error: error,
  };
}
