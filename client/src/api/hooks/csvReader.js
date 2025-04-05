import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to read a file and convert it to a matrix
function readCsvToMatrix(filePath, delimiter = ';', removeFirstTwoColumns = false, removeHeader = false) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(`Error reading the file: ${err}`);
        return;
      }
      const matrix = csvToMatrix(data, delimiter);

      // Remove the first two columns if needed
      const cleanedMatrix = removeFirstTwoColumns ? matrix.map(row => row.slice(2)) : matrix;

      // Remove the header row if needed
      const finalMatrix = removeHeader ? cleanedMatrix.slice(1) : cleanedMatrix;

      resolve(finalMatrix);
    });
  });
}

// Function to convert CSV/TXT string to a matrix (2D array)
function csvToMatrix(csv, delimiter) {
  return csv
    .trim()
    .split(/\r?\n/)
    .filter(row => row.trim() !== '')
    .map(row =>
      row.split(delimiter).map(cell => {
        const trimmed = cell.trim();
        return isNaN(trimmed) ? trimmed : parseFloat(trimmed); // Convert numbers
      })
    );
}

// Async function to read both files and return their data
export default async function csvReader() {
  const csvFilePath = path.join(__dirname, 'qsort1.csv');
  const txtFilePath = path.join(__dirname, 'MI202301.txt');

  try {
    const [csvMatrix, txtMatrix] = await Promise.all([
      readCsvToMatrix(csvFilePath, ';', true, true), // Remove first two columns and header for CSV
      readCsvToMatrix(txtFilePath, ':', false, true) // Keep TXT as is but remove header
    ]);

    return { csvMatrix, txtMatrix }; 
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the function for testing
// csvReader().then(({ csvMatrix, txtMatrix }) => {
//   console.log('CSV Matrix (After Removing First Two Columns and Headers):', csvMatrix); 
//   console.log('TXT Matrix (After Removing Headers):', txtMatrix);
// });
