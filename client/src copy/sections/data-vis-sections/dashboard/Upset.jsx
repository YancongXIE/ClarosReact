import React, { useEffect, useMemo, useState } from 'react';
import { extractCombinations, UpSetJS } from '@upsetjs/react';
import csvReader from '../../../api/hooks/csvReader.js';  // Assuming you have this for loading CSV
import qmethod from '../../../qmethod/qmethod.js';  // Assuming this is your Q-method library
import _ from 'lodash';
// import jStat from 'jstat';

export default function GettingStarted() {
  const [csvMatrix, setCsvMatrix] = useState([]);
  const [txtMatrix, setTxtMatrix] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);  // To hold selected rows of csvMatrix
  const [nfactors, setNFactors] = useState(1);  // Default number of factors as 1

  useEffect(() => {
    // Load CSV data when the component is mounted
    csvReader().then(({ csvMatrix, txtMatrix }) => {
      if (!csvMatrix || !txtMatrix) {
        console.error('Error: One of the matrices is missing or empty.');
        return;
      }
      setCsvMatrix(csvMatrix);
      setTxtMatrix(txtMatrix);
    }).catch((error) => {
      console.error('Error loading CSV data:', error);
    });
  }, []);

  // Handle change for row selection
  const handleRowSelection = (rowIndex) => {
    setSelectedRows((prevSelected) => {
      if (prevSelected.includes(rowIndex)) {
        return prevSelected.filter(index => index !== rowIndex);  // Remove if already selected
      } else {
        return [...prevSelected, rowIndex];  // Add if not selected
      }
    });
  };

  // Prepare the Q-method data (Transpose selected rows of csvMatrix)
  const selectedQMatrix = useMemo(() => {
    const selectedData = selectedRows.map(rowIndex => csvMatrix[rowIndex]);
    return selectedData[0] ? selectedData[0].map((_, colIndex) => selectedData.map(row => row[colIndex])) : []; // Transpose the selected rows
  }, [csvMatrix, selectedRows]);

  // Perform Q-method
  const qmethodResults = useMemo(() => {
    if (selectedQMatrix.length === 0) return null;

    const distribution = [
      ...Array(2).fill(-2), ...Array(4).fill(-1), ...Array(7).fill(0),
      ...Array(4).fill(1), ...Array(2).fill(2)
    ];
    
    return qmethod(selectedQMatrix, nfactors, distribution);
  }, [selectedQMatrix, nfactors]);

  if (!qmethodResults) {
    return <div>Loading or no valid data for Q-method.</div>;
  }

  const { dataset, zsc } = qmethodResults;

  // Apply significance threshold and modify the matrix
  const z = Math.abs(jStat.normal.inv(0.0001, 0, 1)); // qnorm for .0001
  const loadLimit = z / Math.sqrt(txtMatrix.length); // Adjust threshold
  let mat = zsc.map(row => row.map(value => value < loadLimit ? 0 : 1)); // Apply threshold

  // Generate factors dynamically
  const factors = Array.from({ length: mat[0].length }, (_, index) => `Factor_${index + 1}`);
  
  // Prepare the data for UpSetJS
  const upsetData = factors.map((factor, factorIndex) => {
    const sets = txtMatrix.filter((_, statementIndex) => mat[statementIndex][factorIndex] === 1)
                           .map(statement => statement[1]); // statement[1] is the name
    return { name: factor, sets: sets };
  });

  // Extract combinations for UpSetJS
  const { sets, combinations } = useMemo(() => extractCombinations(upsetData), [upsetData]);

  return (
    <div style={{ width: '100%', height: '600px', margin: '20px auto' }}>
      <h2>UpSet.js Chart</h2>

      {/* User Controls for selecting rows and factors */}
      <div>
        <label>
          Number of Factors:
          <input
            type="number"
            value={nfactors}
            min={1}
            onChange={(e) => setNFactors(Number(e.target.value))}
          />
        </label>
      </div>

      <div>
        <label>Select Rows for Q-method Analysis:</label>
        <div>
          {csvMatrix.map((_, index) => (
            <div key={index}>
              <label>
                <input
                  type="checkbox"
                  value={index}
                  checked={selectedRows.includes(index)}
                  onChange={() => handleRowSelection(index)}
                />
                Row {index + 1} {/* Display row number */}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* UpSetJS Visualization */}
      <UpSetJS
        sets={sets}
        combinations={combinations}
        width={780}
        height={400}
        selection={null}
        onHover={() => {}}
        selectionColor="orange"
        hoverColor="lightblue"
        hasSelectionOpacity={0.3}
        exportButtons={true}
      />
    </div>
  );
}
