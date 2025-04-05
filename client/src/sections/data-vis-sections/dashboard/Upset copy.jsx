import React, { useEffect, useMemo, useState } from 'react';
import { extractCombinations, UpSetJS } from '@upsetjs/react';
import qmethod from '../../../qmethod/qmethod.js';
import _ from 'lodash';
import jStat from 'jstat';

import { useStatements } from "../../../api/hooks/useStatements";
import { useParticipants } from "../../../api/hooks/useParticipants";

import { useWindowWidthResize } from "../../../api/hooks/useWindowWidthResize";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../../../tailwind.config.js";
import Checkbox from "../../../components/ui/Checkbox";

// distribution 数组只定义一次
const distribution = [
  ...Array(2).fill(-2),
  ...Array(4).fill(-1),
  ...Array(7).fill(0),
  ...Array(4).fill(1),
  ...Array(2).fill(2)
];


export default function UpsetUI() {
  const { data: statementsData } = useStatements();
  const { data: participantsData } = useParticipants();

  const [csvMatrix, setCsvMatrix] = useState([]);
  const [txtMatrix, setTxtMatrix] = useState([]);
  const [nfactors, setNfactors] = useState(2);
  const [elems, setElems] = useState([]);
  const [selection, setSelection] = useState(null);

    
  // width of browser window
  const { width } = useWindowWidthResize();
  // tailwind constants for responsiveness debugging and operation
  const fullConfig = resolveConfig(tailwindConfig);
  const smSplit = parseInt(fullConfig.theme.screens.sm, 10);
  const mdSplit = parseInt(fullConfig.theme.screens.md, 10);
  const lgSplit = parseInt(fullConfig.theme.screens.lg, 10);
  const xlSplit = parseInt(fullConfig.theme.screens.xl, 10);


  const [selectedIndices, setSelectedIndices] = useState([]); // State to store indices of selected participants
  const [selectedParticipants, setSelectedParticipants] = useState([]); // State to store selected participants' data


  // Effect to update the selectedParticipants data based on selectedIndices
  useEffect(() => {
    console.log("Selected Participants Indices:", selectedIndices);

    if (csvMatrix && selectedIndices.length > 0) {
      console.log("csvMatrix:", csvMatrix);
      const updatedParticipants = csvMatrix.filter((_, index) =>
        selectedIndices.includes(index) // Filter participants based on selected indices
      );

      setSelectedParticipants(updatedParticipants); // Update participant data
      console.log("Updated Selected Participants Data:", updatedParticipants);
    } else {
      setSelectedParticipants([]); // Reset selected participants if no indices are selected
    }
  }, [selectedIndices]); // Re-run this effect whenever selectedIndices changes



  // someone has clicked to open a dropdown
  function setOpenDetails(idToOpen) {

    const detailsElements = document.querySelectorAll("details");

    // close all other dropdowns
    detailsElements.forEach((details) => {
      console.log(details.id);
      if (details.id === idToOpen) {
        //details.open = true; // don't perform the default functionality or it occurs twice and closes the dropdown
      } else {
        details.open = false;
      }
    });
  }

  // someone has clicked outside a dropdown so close them all
  function handleClickOutsideDetails(e) {

    if (!e.target.closest("details")) {
      setOpenDetails("");
    }
  }

  // add listeners to close dropdowns on click outside
  document.addEventListener("click", handleClickOutsideDetails);
  document.addEventListener("touchstart", handleClickOutsideDetails);

  // debug boolean for testing responsive layout
  const showBreaks = false;

  //When participants data are ready
  useEffect(() => {
    if (Array.isArray(participantsData) && participantsData.length > 0) {
      const firstItem = participantsData[0];
      const sKeys = Object.keys(firstItem)
        .filter(key => key.startsWith("S") && !isNaN(parseInt(key.slice(1))))
        .sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));
      const newMatrix = participantsData.map(item => sKeys.map(key => item[key]));
      setCsvMatrix(newMatrix);
      setSelectedIndices(participantsData.map((_, index) => index))
    }
  }, [participantsData]);

  useEffect(() => {
    if (!Array.isArray(statementsData) || statementsData.length === 0) return;
    const allKeys = Array.from(new Set(statementsData.flatMap(item => Object.keys(item || {}))));
    const transformedMatrix = statementsData.map(item =>
      allKeys.map(key => item?.[key] ?? null)
    );
    setTxtMatrix(transformedMatrix);
  }, [statementsData]);


  useEffect(() => {
    if (!selectedParticipants.length || !txtMatrix.length) return;
    const q = selectedParticipants[0].map((_, colIndex) => selectedParticipants.map(row => row[colIndex]));
    const results = qmethod(q, nfactors, distribution);
    if (!results || !results.dataset) return;

    const statementNames = txtMatrix.map(row => row[1]);
    const z = Math.abs(jStat.normal.inv(0.0001, 0, 1));
    const loadLimit = z / Math.sqrt(statementNames.length);
    let mat = results.zsc.map(row => row.map(value => (value < loadLimit ? 0 : 1)));
    const factors = Array.from({ length: mat[0].length }, (_, index) => `Factor_${index + 1}`);
    const upsetData = factors.map((factor, factorIndex) => {
      const sets = txtMatrix
        .filter((_, statementIndex) => mat[statementIndex][factorIndex] === 1)
        .map(statement => statement[1]);
      return { name: factor, sets };
    });
    setElems(upsetData);
  }, [selectedParticipants, txtMatrix, nfactors]);

  const { sets, combinations } = useMemo(() => extractCombinations(elems), [elems]);

  return (
    <div className="mx-auto p-4">
      <h1 className="font-light lg:p-3 text-xl sm:text-2xl lg:text-3xl text-primary-content mb-4 lg:mb-0 pb-4">
        Data Analyst
      </h1>

      {showBreaks ? <span>{smSplit} / md {mdSplit} / lg {lgSplit} / xl {xlSplit} - {width}</span> : null}

      {/* Participants and Number Input Section */}
      <div className="flex">
        {/* First Box - dropdown check box */}
        <div className={"grid md:grid-cols-1 gap-0 mb-4 items-start lg:grid-cols-[1fr_1.2fr_.4fr_1.8fr_1.9fr_50px]"}>
          <div className="shadow-md opacity-95 border-1 rounded bg-base-300 m-0.5 p-3 md:min-w-44 w-auto">
            <details id="LGASelector" onClick={() => setOpenDetails("LGASelector")}>
              <summary className="text-primary-content">Participants for analysis</summary>
              {participantsData && participantsData.length > 0 ? (
                participantsData.map((participant, index) => (
                  <Checkbox
                    key={participant.id} // Use unique participant id as the key
                    label={`Participant ${index + 1}`}
                    value={selectedIndices.includes(index)} // Check if index is in selectedIndices
                    setValue={(isSelected) => {
                      setSelectedIndices((prevSelectedIndices) => {
                        if (isSelected) {
                          return [...prevSelectedIndices, index]; // Add index if selected
                        } else {
                          return prevSelectedIndices.filter(i => i !== index); // Remove index if unselected
                        }
                      });
                    }}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500">No participants available</p>
              )}
            </details>
          </div>

          {/* Second Box - Number Input */}
          <div className="shadow-md border opacity-95 rounded bg-base-300 m-0.5 p-3 md:min-w-44 w-auto relative">
            <div className="pl-2">
              {/* Label and Input on the same row */}
              <label className="text-primary-content mb-2 w-auto">
                Number of factors:
              </label>
              <input
                type="number"
                className="input input-bordered input-sm w-16 px-2 h-6"
                min="0"
                value={nfactors}  // Set the value to `nfactors` state
                onChange={(e) => setNfactors(e.target.value)}  // Update the state when input changes
              />
            </div>
          </div>

        </div>
      </div>



      {/* UpSet.js Chart */}
      <div className="flex justify-center items-center w-full h-[600px] my-5 relative">
        <div className="text-center">
          <h2>UpSet.js Chart</h2>
          <UpSetJS
            sets={sets}
            combinations={combinations}
            width={1200}
            height={400}
            selection={selection}
            onHover={setSelection}
            selectionColor="orange"
            hoverColor="lightblue"
            hasSelectionOpacity={0.3}
            exportButtons={true}
          />
        </div>
      </div>

      {/* Inline CSS to hide dropdown when details is closed */}
      <style jsx>{`
        details:not([open]) .dropdown-content {
          display: none;
        }
      `}</style>
    </div >
  );
}
