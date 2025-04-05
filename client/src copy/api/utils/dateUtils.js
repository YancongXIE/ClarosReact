/*
Utility functions related to date conversion
*/

// convert dates in YYYY-MM-DD format to month and year string (e.g. January 2023)
export function numericDateToString(date) {
  const dateToConvert = new Date(date);

  const month = dateToConvert.toLocaleString("default", {
    month: "short",
  });

  const year = dateToConvert.getFullYear();

  return { month, year };
}

// convert numeric dates to season names (Summer, Autumn, etc)
// function not in use / not currently working
export function convertMonthsToSeasons(month, year) {
  let seasonYear = year;
  switch (month) {
    case "December":
      seasonYear = year + 1;
      return `Summer ${seasonYear}`;
    case "January":
    case "February":
      return `Summer ${year}`;
    case "March":
    case "April":
    case "May":
      return `Autumn ${year}`;
    case "June":
    case "July":
    case "August":
      return `Winter ${year}`;
    case "September":
    case "October":
    case "November":
      return `Spring ${year}`;
    default:
      return null;
  }
}
