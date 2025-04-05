import csvReader from './csvReader.js';
import qmethod from '../../qmethod/qmethod.js';
import _ from 'lodash';
import jStat from 'jstat';

csvReader().then(({ csvMatrix, txtMatrix }) => {
  if (!csvMatrix || !txtMatrix) {
    console.error('Error: One of the matrices is missing or empty.');
    return;
  }

  // You can now use csvMatrix and txtMatrix in your logic.
  const q = csvMatrix[0].map((_, colIndex) => csvMatrix.map(row => row[colIndex])); // Transpose the CSV matrix for Q-method
  
  const nfactors = 5;
  const distribution = [
    ...Array(2).fill(-2), ...Array(4).fill(-1), ...Array(7).fill(0),
    ...Array(4).fill(1), ...Array(2).fill(2)
  ];

  const results = qmethod(q, nfactors, distribution);

  if (!results || !results.dataset) {
    console.error('Error: Q-method analysis failed.');
    return;
  }

//   console.log('Q-method results:', results['zsc']);

  // Extract 'Short' names from the second column of txtMatrix
  const statementNames = txtMatrix.map(row => row[1]);

  // Integrate 'Short' names into the results dataset
  let t1 = results.dataset.map((row, index) => ({
    Short: statementNames[index] || `Statement_${index + 1}`, // Use 'Short' name or default
    ...Object.fromEntries(row.map((val, i) => [`subject_${i + 1}`, val])) // Convert row to object
  }));

  // Convert to long format
  let g = [];
  t1.forEach(row => {
    Object.keys(row).forEach(key => {
      if (key !== 'Short') {
        g.push({
          Short: row.Short,
          subject: parseInt(key.replace('subject_', '')), // Convert subject to integer
          score: row[key]
        });
      }
    });
  });

  // Compute mean score by statement
  const meanScore = _(g)
    .groupBy('Short')
    .map((values, Short) => ({
      Short,
      mean: _.meanBy(values, 'score') // Compute mean score
    }))
    .orderBy('mean', 'desc') // Sort by descending mean
    .value();

  // Log the results
  //console.log('Mean Scores by Statement:', meanScore);

  const zsc = results.zsc; // Access zsc from the results object

  // --- Apply significance threshold and modify the matrix ---
  const z = Math.abs(jStat.normal.inv(0.0001, 0, 1));// qnorm for .0001 gives the critical value for the significance threshold
  const loadLimit = z / Math.sqrt(statementNames.length); // Adjust threshold for the Bonferroni effect or other adjustments

  // Update the matrix based on load limit
  let mat = zsc;  // Assign zsc to mat for processing
  mat = mat.map(row => 
    row.map(value => value < loadLimit ? 0 : 1)  // Set values < loadLimit to 0 and >= loadLimit to 1
  );

  // Log the adjusted matrix

  // Generate factors dynamically based on the number of columns in mat (zsc columns)
const factors = Array.from({ length: mat[0].length }, (_, index) => `Factor_${index + 1}`);

// Prepare the data for UpSetJS
const upsetData = [];

// Loop through each factor (column in mat)
factors.forEach((factor, factorIndex) => {
  const sets = []; // Will hold statements for this factor
  txtMatrix.forEach((statement, statementIndex) => {
    if (mat[statementIndex][factorIndex] === 1) {
      sets.push(statement[1]); // statement[1] is the name of the statement
    }
  });
  
  // Add the factor and its sets to the upsetData
  upsetData.push({
    name: factor,
    sets: sets
  });
});

  // Continue with the rest of your processing (pivoting, summarizing, etc.)
}).catch(error => {
  console.error('Error reading CSV data:', error);
});
