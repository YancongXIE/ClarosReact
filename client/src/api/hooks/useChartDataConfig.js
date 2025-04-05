/*
Contains graph configuration logic that ties in:
- fetching logic from useFetchLocalisData
- filtering logic for filtering data by monthly average
*/

import { useContext, useMemo } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { useFetchLocalisData } from "./useFetchLocalisData";
import { getDataMonthlyAverages } from "../utils/getUtils";

// function for processing bar chart data:
function processBarChartData(data, userLGA, year, dataFields) {
  const filteredData = data.filter(
    (item) =>
      item.lga_name.trim().toLowerCase() === userLGA.trim().toLowerCase()
  );
  return getDataMonthlyAverages(filteredData, year, dataFields);
}

// function for processing scatter chart data:
// note: this is a regular scatter chart, not a quadrant. Quadrant may be implemented at some point
function processQuadrantScatterChartData(data, userLGA, year, dataFields) {
  const filteredData = data.filter(
    (item) =>
      item.lga_name.trim().toLowerCase() === userLGA.trim().toLowerCase()
  );
  return getDataMonthlyAverages(filteredData, year, dataFields);
}

// hook for configuring chart data for various charts, including fetch call and accessing user state
export function useChartDataConfig({ endpoint, year, dataFields, chartType }) {
  const { loading: dataLoading, data, error } = useFetchLocalisData(endpoint);

  const { user, isAuthChecked } = useContext(AuthContext);
  const userLoading = !isAuthChecked;

  const processedData = useMemo(() => {
    if (dataLoading || userLoading || !user || !data) {
      console.log("Early return from useMemo due to loading or missing data");
      return null;
    }

    const userLGA = user.lga || "";

    // add other cases here (e.g. scatterplot, heatmap, etc etc) as appropriate
    switch (chartType) {
      case "bar":
        return processBarChartData(data, userLGA, year, dataFields);
      case "quadrantScatter":
        return processQuadrantScatterChartData(data, userLGA, year, dataFields);
      default:
        data;
    }
  }, [data, dataLoading, user, userLoading, year, dataFields, chartType]);
  return {
    loading: dataLoading || userLoading,
    data: processedData,
    error,
    user,
  };
}
