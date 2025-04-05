/*
Filter functions for converting data into monthly or season averages.
Seasonal average function not currently in use / not working
*/

import { numericDateToString, convertMonthsToSeasons } from "./dateUtils";
import { kAPI_URL } from "./constants";

// get a monthly average of the ADR value
export function getDataMonthlyAverages(data, year, dataFields) {
  // dataFields is an array of strings representing the fields to average
  const monthlyData = {};

  data?.forEach((item) => {
    const { month, year: itemYear } = numericDateToString(item.sample_date);

    if (itemYear !== year) {
      return;
    }

    if (!monthlyData[month]) {
      monthlyData[month] = { month, totals: {}, counts: {} };

      // initialise totals and counts for each data field
      dataFields.forEach((field) => {
        monthlyData[month].totals[field] = 0;
        monthlyData[month].counts[field] = 0;
      });
    }

    // accumulate totals and counts for each data field
    dataFields.forEach((field) => {
      const value = parseFloat(item[field]);
      if (!isNaN(value)) {
        monthlyData[month].totals[field] += value;
        monthlyData[month].counts[field] += 1;
      }
    });
  });

  // calculate averages for each data field
  return Object.values(monthlyData).map((item) => {
    const averages = { month: item.month };
    dataFields.forEach((field) => {
      averages[field] = item.totals[field] / item.counts[field];
    });
    return averages;
  });
}

// function for getting averages across seasons
// function not in use / not currently working
export function getDataSeasonalAverage(data, year, dataField) {
  // dataField = average daily rate, etc
  const seasonalData = {};

  data?.forEach((item) => {
    const { month, year: itemYear } = numericDateToString(item.sample_date);

    const season = convertMonthsToSeasons(month, itemYear);

    const seasonYearMatch = season.match(/(\d+)$/);
    const seasonYear = seasonYearMatch ? parseInt(seasonYearMatch[1]) : null;

    if (seasonYear !== year) {
      return;
    }

    if (!seasonalData[season]) {
      seasonalData[season] = { season, total: 0, count: 0 };
    }

    seasonalData[season].total += parseFloat(item[dataField]);
    seasonalData[season].count += 1;
  });

  console.log("Seasonal Data:", seasonalData);

  return Object.values(seasonalData).map((item) => ({
    name: item.season,
    [dataField]: item.total / item.count,
  }));
}

// function for retrieving url from cache in fetch requests to data endpoint
export function getUrlFromCache(cache, url, filter = (element) => true) {
  return cache[url] ? cache[url].filter(filter) : null;
}

// function for retrieving url from server in fetch requests to data endpoint
export async function getUrlFromServer(url) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: headers,
    });
    if (!res.ok) {
      throw new Error("No response from server ");
    }

    const data = await res.json();

    if (data.error) {
      throw new Error(data.message || "Failed to fetch user data.");
    }
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// function for retrieving url from server in fetch requests to data endpoint
export async function getLLMResponseFromServer(prompt, dataSet) {
  console.log("Sending prompt to backend:", prompt);

  // console.log("inside getLLMResponseFromServer");
  const url = `${kAPI_URL}/ai/query_llm`;
  //const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
  };

  // if (token) {
  //   headers.Authorization = `Bearer ${token}`;
  // }

  try {
    console.log("FETCHING " + url);

    const res = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        prompt: prompt + " " + JSON.stringify(dataSet),
      }),
    });

    if (!res.ok) {
      throw new Error("No response from server ");
    }

    const data = await res.json();
    console.log("Raw response from backend:", data);

    if (data.error) {
      throw new Error(data.message || "Failed to fetch user data.");
    }
    return data.response;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
