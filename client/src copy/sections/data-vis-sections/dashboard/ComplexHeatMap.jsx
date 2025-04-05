import React, { useMemo, useState, useEffect } from "react";
import { UpSetJS, extractCombinations } from "@upsetjs/react";
import * as d3 from "d3";

const QMethodAnalysis = () => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    Promise.all([
      d3.csv("/MI202301.txt", d3.autoType),
      d3.csv("/qsort1.csv", d3.autoType)
    ]).then(([statements, responses]) => {
      processData(statements, responses);
    });
  }, []);

  const processData = (statements, responses) => {
    let matrix = responses.map(row => Object.values(row).slice(1, 20));
    let subjects = responses.map(row => row[Object.keys(row)[0]]);
    
    let meanScores = {};
    statements.forEach(statement => {
      let scores = matrix
        .map(row => row[statement.id - 1])
        .filter(value => typeof value === "number" && !isNaN(value));
      
      if (scores.length > 0) {
        meanScores[statement.Short] = d3.mean(scores) || 0;
      } else {
        meanScores[statement.Short] = 0;
      }
    });
    
    let upsetData = Object.keys(meanScores).map((short, i) => ({
      name: `${short} (${meanScores[short].toFixed(2)})`,
      sets: [`F${(i % 5) + 1}`]
    }));
    
    setElements(upsetData);
  };

  const { sets, combinations } = useMemo(() => extractCombinations(elements), [elements]);
  const [selection, setSelection] = useState(null);

  return (
    <div>
      <h2>Q-Methodology UpSetJS Visualization</h2>
      {elements.length > 0 && (
        <UpSetJS
          sets={sets}
          combinations={combinations}
          width={780}
          height={400}
          selection={selection}
          onHover={setSelection}
        />
      )}
    </div>
  );
};

export default QMethodAnalysis;
