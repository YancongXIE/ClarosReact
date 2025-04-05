//
//  IFQ717 Web Development Capstone
//
//  useLocalisSpendingData.js - API function to get spending data by Gary Cazzulino
//
//

import { useState, useEffect } from "react";
import { addDaysToDate } from "../utils/utils";
import { kAPI_URL, kDEFAULT_ERROR_MSG } from "../utils/constants";
import { getUrlFromCache, getUrlFromServer } from "../utils/utils";

// Retrieve all weekly spending date for the same date range as accommodation data
export function useLocalisSpendingData(startDate, endDate) {
  const [spendingDataLoading, setSpendingDataLoading] = useState(false);
  const [spendingDataSet, setSpendingDataSet] = useState();
  const [spendingDataError, setSpendingDataError] = useState(null);
  const [cache, setCache] = useState({});
  const startDateDate = new Date(startDate);
  const endDateDate = new Date(endDate);


  // extract all data and client-side filter it by date
  useEffect(() => {
    let url = `${kAPI_URL}/spend_data`; //?start=${startDate}&end=${addDaysToDate(startDate, windowDays)}`;

    // check if the data is in the client cache
    if (getUrlFromCache(cache, url)) {
      setSpendingDataLoading(false);
      setSpendingDataSet(
        getUrlFromCache(cache, url).filter((sample) => {
          const sampleDateDate = new Date(sample.week_commencing);

          return (
            sampleDateDate >= startDateDate && sampleDateDate <= endDateDate
          );
        })
      );
      setSpendingDataError(null);
    } else {
      setSpendingDataLoading(true);

      // data is not in the cache so fetch it from the server
      getUrlFromServer(url, false)
        .then((returnedDataSet) => {
          setCache((prevCache) => ({ ...prevCache, [url]: returnedDataSet }));
          setSpendingDataSet(
            getUrlFromCache(cache, url).filter((sample) => {
              const sampleDateDate = new Date(sample.week_commencing);

              return (
                sampleDateDate >= startDateDate && sampleDateDate <= endDateDate
              );
            })
          );
          
        })
        .catch((error) => {
          setSpendingDataError(error.message ?? kDEFAULT_ERROR_MSG);
        })
        .finally(() => {
          setSpendingDataLoading(false);
        });
    }
  }, [startDate, endDate, cache]);

  return {
    spendingDataLoading: spendingDataLoading,
    spendingDataSet: spendingDataSet,
    spendingDataError: spendingDataError,
  };
}
