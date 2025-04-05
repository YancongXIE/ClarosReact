//
//  IFQ717 Web Development Capstone
//
//  api.js - Main app API helper function definitions by Gary Cazzulino
//
//

import domtoimage from 'dom-to-image';
import { jsPDF } from 'jspdf'

// captures a div element as a jpg at highest quality
export async function captureAsImage (elementId) {
  const element = document.getElementById(elementId);
  return await domtoimage.toJpeg(element, { quality: 1.0 });
}

// generic function to generate a PDF based on an array of htmls element ID passed in
export async function generatePDFFrom(htmlElements, outputFilename, display) {

  // define the PDF
  const pdf = new jsPDF({
    orientation: 'p',
    unit: 'px',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const yMargin = 20;
  const yGap = 10;
  const xMargin = 30;
  let scale = 1.0;
  let yOffset = yMargin;

  // generate a scaled image for each supplied html element
  for ( let i = 0; i < htmlElements.length; i++) {

    let scalingForHeight = false;
    let element = htmlElements[i];

    if (document.getElementById(element)) {

      const elementImage = await captureAsImage(element);
      let { width, height } = document.getElementById(element).getBoundingClientRect();

      // sacle the image and consider page control once page is full
      scale = Math.min(
              (pageWidth - (xMargin * 2)) / width,
              (pageHeight - (yMargin * 2)) / height);

      if (yOffset + ((height * scale) + yMargin) >= pageHeight - yMargin * 2 && yOffset > yMargin) {

        yOffset = yMargin;
        pdf.addPage();

      }

      // add the appropriately scaled image to the PDF
      pdf.addImage(elementImage, 'JPG', width < height ? (pageWidth - (width * scale)) / 2.0 : xMargin, yOffset, width * scale, height * scale);
      yOffset += ((height * scale) + yGap);
      
    }
  
  }

  // Save the PDF
  pdf.save(outputFilename);

  if (display) window.open(pdf.output('bloburl'));

}

// calculate the mathematic average from an array
export function average(arr) {
  return Math.trunc((arr.reduce((p, c) => p + c, 0) / arr.length) * 10.0) / 10.0;
}

// Given a cache array and a specific URL string, getUrlFromCache will return the previous
// API response for that URL if it exists in the cache
export function getUrlFromCache(cache, url) {
  return cache[url]; 
}

// A helper function to consistently perform server API calls, handling errors as appropriate
// Take a url and authenticate boolean. If authenticate is true then the user's JWT is
// passed in the request header
export function getUrlFromServer(url, authenticate) {

  return fetch(url, {
    method: "GET",
    headers: authenticate
      ? {
          "Content-Type": "application/json",
          //"X-API-KEY": kAPI_KEY,
          //"Authorization": "Bearer " + localStorage.getItem(kTOKEN_NAME)
        }
      : {
          "Content-Type": "application/json",
          //"X-API-KEY": kAPI_KEY
        },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        throw data;
      }
      return data["data"];
    });
}

// add a number of days to a date
export function addDaysToDate(dateString, daysToAdd) {

  const date = new Date(dateString);

  date.setDate(date.getDate() + daysToAdd);

  const newYear = date.getFullYear();
  const newMonth = String(date.getMonth() + 1).padStart(2, "0");
  const newDay = String(date.getDate()).padStart(2, "0");

  const newDateString = `${newYear}-${newMonth}-${newDay}`;

  return newDateString;
}

// calculate the number of days between 2 dates
export function daysBetweenDates(startDate, endDate) {
  const startDateDate = new Date(startDate);
  const endDateDate = new Date(endDate);
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const dayDifference = (endDateDate - startDateDate) / millisecondsPerDay;

  return Math.floor(dayDifference);
}

// convert a string to be a suitable label for graphing data etc
export function convertToLabel(name) {
  return name.replace(' ', '_').toLowerCase();
}

// convert a string to title case - used for displaying spending categories
export function toTitleCase(str) {
  return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

// experimental approach of using area under the curve instead of averages in graphing
// gives identical visual results however in a funky type of unit - so idea was dropped
export function calculateAreaUnderCurve(dataSet) {

  let areaUnderCurve = 0;

  for (let i = 0; i < dataSet.length - 1; i++) {
    const avgHeight = (dataSet[i] + dataSet[i + 1]) / 2;
    const baseWidth = 1;

    areaUnderCurve += avgHeight * baseWidth;
  }

  return areaUnderCurve;
}
