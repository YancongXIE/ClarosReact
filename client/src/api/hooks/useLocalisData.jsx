//
//  IFQ717 Web Development Capstone
//
//  api.js - Main app API function definitions  by Gary Cazzulino
//
//

import { useState, useEffect } from "react";
import { addDaysToDate } from "../utils/utils";
import { kAPI_URL, kDEFAULT_ERROR_MSG } from "../utils/constants";
import { getUrlFromCache, getUrlFromServer } from "../utils/utils";

// Retrieve localis accommodation date from the database
export function useLocalisData(startDate, endDate) {
  const [loading, setLoading] = useState(false);
  const [dataSet, setDataSet] = useState();
  const [firstDate, setFirstDate] = useState();
  const [lastDate, setLastDate] = useState();

  const [error, setError] = useState(null);
  const [cache, setCache] = useState({});
  const startDateDate = new Date(startDate);
  const endDateDate = new Date(endDate);


  useEffect(() => {
    // get all data and then filter on date below for efficiency
    let url = `${kAPI_URL}/combined_data`; //?start=${startDate}&end=${addDaysToDate(startDate, windowDays)}`;

    // see if data is already in cache
    if (getUrlFromCache(cache, url)) {
      setLoading(false);
      let dataFromCache = getUrlFromCache(cache, url);
      setFirstDate(dataFromCache[0].sample_date);
      setLastDate(dataFromCache[dataFromCache.length - 1].sample_date);

      // filter data by date on the client-side
      setDataSet(
        dataFromCache.filter((sample) => {
          const sampleDateDate = new Date(sample.sample_date);

          return (
            sampleDateDate >= startDateDate && sampleDateDate <= endDateDate
          );
        })
      );
      setError(null);
    } else {
      setLoading(true);

      // data is not in cache then get it from the server
      getUrlFromServer(url, false)
        .then((dataSet) => {
          setFirstDate(dataSet[0].sample_date);
          setLastDate(dataSet[dataSet.length - 1].sample_date);
          setCache((prevCache) => ({ ...prevCache, [url]: dataSet }));
          
          setDataSet(
            getUrlFromCache(cache, url).filter((sample) => {
              const sampleDateDate = new Date(sample.sample_date);

              return (
                sampleDateDate >= startDateDate && sampleDateDate <= endDateDate
              );
            })
          );
          
        })
        .catch((error) => {
          setError(error.message ?? kDEFAULT_ERROR_MSG);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [startDate, endDate, cache]);

  return {
    loading: loading,
    dataSet: dataSet,
    error: error,
    totalDateRange: { firstDate, lastDate }
  };
}
