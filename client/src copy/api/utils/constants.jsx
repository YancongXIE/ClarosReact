//
//  IFQ717 Web Development Capstone
//
//  constants.js - constants defined and used throughout the app
//
//

export const kAPI_URL = "http://localhost:3000/api";
export const kDEFAULT_ERROR_MSG = "API Error - an unspecified error occurred";
export const kGraphLineStyle = "smooth";
export const kOriginDate = "2023-01-01";
export const kGraphColours = {
  "Gold Coast": "#8c5d2d" /* "#ff0000" */,
  Noosa: "#ab274f" /*"#00ff00"*/,
  Whitsunday: "#0e7490" /*"#0000ff"*/,
  Cairns: "#15803d" /*"#ff00ff"*/,
};

export const kGraphSpendColours = {
  'FOOD & GROCERY': '#966857' ,
  'RESTAURANTS': '#5e4699',
  'HEALTH CARE & DRUG STORE': '#90714e',
  'RETAIL STORES': '#4a8e58',
  'FUEL': '#b05a98',
  'HOME IMPROVEMENT & SUPPLY': '#9761a3',
  'RETAIL GOODS': '#a4a85e',
  'PKG STORES/BEER/WINE/LIQUOR': '#b275a1',
  'FAST FOOD RESTAURANTS': '#427582',
  'AUTOMOTIVE': '#638e5a',
  'HOTELS/MOTELS & RESORTS': '#8a3852',
  'DISCOUNT & VARIETY STORES': '#548447',
  'BARS/TAVERNS/LOUNGES/DISCOS': '#555390',
  'RETAIL SERVICES': '#985e72',
  'EDUCATION & GOVERNMENT': '#7f4a86',
  'ENTERTAINMENT': '#ad9353',
  'TOURIST ATTRACTIONS': '#6888a6',
  'TRANSPORTATION': '#618d4e',
  'PROFESSIONAL SERVICES': '#866da0',
  'BUSINESS TO BUSINESS': '#516a90',
  'VEHICLE RENTAL': '#457ea2',
  'TRAVEL AGENCIES': '#95589a',
  'ENTERTAINMENT - OTHERS': '#a45b9e',
  'DUTY FREE STORES': '#63adae',
  'TELECOM': '#4b884e',
  'TRAILER PARKS AND CAMPGROUNDS': '#5cb250',
  'AIRLINES/AIR CARRIERS': '#6bb072',
  'GOLF AND CLUBS': '#aa4653',
  'HEALTH - OTHERS': '#83af4e'};

export const kDefaultResponse =
  "Hi there, please select a default prompt or enter a custom prompt above and then click Analyse to pass your prompt and the selected data to an LLM for analysis.";

// bare data fields for use within components
export const fields = [
  "average_daily_rate",
  "average_booking_window",
  "average_historical_occupancy",
  "average_length_of_stay",
];

// convert database field names to display names that are better for displaying the data
export const dataFieldDisplayNames = {
  average_booking_window: "Average Booking Window",
  average_daily_rate: "Average Daily Rate",
  average_historical_occupancy: "Average Historical Occupancy",
  average_length_of_stay: "Average Length of Stay",
};
