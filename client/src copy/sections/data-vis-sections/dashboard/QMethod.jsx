import React, { useState, useEffect } from 'react';
import numeric from 'numeric';
console.log("123:",numeric);

const QMethod = () => {
  const [correlationMatrix, setCorrelationMatrix] = useState(null);
  const [factors, setFactors] = useState(null);
  const [rotatedFactors, setRotatedFactors] = useState(null);
  const [distribution, setDistribution] = useState(null);

  // Sample data (replace with your actual Q-sort data)
  const data = [
    [1, 2, 3, 4, 5],
    [2, 3, 4, 5, 6],
    [1, 3, 4, 2, 5],
    [3, 4, 5, 2, 1],
    [5, 6, 7, 3, 4],
  ];

  // Step 1: Compute the correlation matrix (Pearson correlation)
  function calculateCorrelationMatrix(data) {
    const correlationMatrix = numeric.dotMMbig(numeric.transpose(data), data);
    console.log(numeric.norm2);
    console.log(numeric.clone);
    console.log("numeric.clone(data):",numeric.clone(data));
    const rowNorms = numeric.norm2(numeric.clone(data));
    console.log("rowNorms:",rowNorms);
    return numeric.mul(correlationMatrix, 1 / (numeric.outer(rowNorms, rowNorms)));
  }

  // Step 2: Perform factor analysis (e.g., via SVD)
  function factorAnalysis(correlationMatrix, nFactors) {
    const svd = numeric.svd(correlationMatrix);
    const factors = svd.U;  // Use U matrix for factor loading
    return factors.slice(0, nFactors);  // Only keep the top n factors
  }

  // Step 3: Rotate factors (Varimax rotation implementation is complex and may require further work)
  function varimaxRotation(factors) {
    // Varimax rotation is a non-trivial algorithm. You can implement it yourself
    // or use an external numerical optimization library to achieve this.
    // Placeholder function:
    return factors;  // Apply actual Varimax rotation here
  }

  useEffect(() => {
    // Step 1: Calculate correlation matrix
    const correlationMatrix = calculateCorrelationMatrix(data);
    setCorrelationMatrix(correlationMatrix);

    // Step 2: Perform factor analysis
    const nFactors = 2; // For example
    const factors = factorAnalysis(correlationMatrix, nFactors);
    setFactors(factors);

    // Step 3: Apply varimax rotation (optional)
    const rotatedFactors = varimaxRotation(factors);
    setRotatedFactors(rotatedFactors);

    // Step 4: Set the distribution (this might be your custom categorization)
    const distribution = [
      ...Array(2).fill(-2),
      ...Array(4).fill(-1),
      ...Array(7).fill(0),
      ...Array(4).fill(1),
      ...Array(2).fill(2),
    ];
    setDistribution(distribution);
  }, []);

  return (
    <div>
      <h1>Q-Method Analysis</h1>
      <div>
        <h2>Correlation Matrix:</h2>
        <pre>{JSON.stringify(correlationMatrix, null, 2)}</pre>
      </div>
      <div>
        <h2>Factors:</h2>
        <pre>{JSON.stringify(factors, null, 2)}</pre>
      </div>
      <div>
        <h2>Rotated Factors:</h2>
        <pre>{JSON.stringify(rotatedFactors, null, 2)}</pre>
      </div>
      <div>
        <h2>Distribution:</h2>
        <pre>{JSON.stringify(distribution, null, 2)}</pre>
      </div>
    </div>
  );
};

export default QMethod;
