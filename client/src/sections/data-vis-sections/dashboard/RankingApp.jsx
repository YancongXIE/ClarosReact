import React, { useState, useEffect } from 'react';
import RankingTable from './RankingTable';
// import Papa from 'papaparse';

const RankingApp = () => {
  const [statements, setStatements] = useState([]);
  const [status, setStatus] = useState(false);

  useEffect(() => {
    setStatements(["111111","22222","3333"]);
  }, []);

  const validateSelections = (selections) => {
    const counts = { '-2': 0, '-1': 0, '0': 0, '1': 0, '2': 0 };
    Object.values(selections).forEach(value => {
      counts[value]++;
    });

    if (counts['-2'] === 1 && counts['-1'] === 2 && counts['0'] === 3 && counts['1'] === 2 && counts['2'] === 1) {
      setStatus(true);
      alert("Data is valid. You can now submit your results");
    } else {
      setStatus(false);
      alert("The sort is incomplete. Some categories have too few or too many statements!");
    }
  };

  const handleReset = () => {
    setStatements(["111111","22222","3333","4444"]);
    // Re-fetch or reinitialize statements here if necessary
  };

  return (
    <div>
      <RankingTable
        statements={statements}
        onValidate={validateSelections}
        onReset={handleReset}
      />
      {status && <button>Submit</button>}
    </div>
  );
};

export default RankingApp;