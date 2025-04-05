import React, { useEffect, useMemo, useState } from 'react';
import { extractCombinations, UpSetJS } from '@upsetjs/react';
import qmethod from '../../../qmethod/qmethod.js';
import _, { constant } from 'lodash';
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

export default function UpsetUI() {
  const { data: statementsData } = useStatements();
  const { data: participantsData } = useParticipants();

  const [csvMatrix, setCsvMatrix] = useState([]);
  const [txtMatrix, setTxtMatrix] = useState([]);
  const [nfactors, setNfactors] = useState(2);
  const [elems, setElems] = useState([]);
  const [selection, setSelection] = useState(null);

  //combination modes
  const [emptyOption, setEmptyOption] = useState(false);
  const [minSetSizeOption, setMinSetSizeOption] = useState(0);
  const [limitOption, setLimitOption] = useState(20);
  const [orderOption, setOrderOption] = useState('');
  const [groupOption, setGroupOption] = useState('');



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


  // add listeners to close dropdowns on click outside
  document.addEventListener("click", handleClickOutsideDetails);
  document.addEventListener("touchstart", handleClickOutsideDetails);

  // debug boolean for testing responsive layout
  const showBreaks = false;

  //When participants data are ready,update the storeage, and active participants for analysis
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

  //load statements into JS matrix
  useEffect(() => {
    if (!Array.isArray(statementsData) || statementsData.length === 0) return;
    const allKeys = Array.from(new Set(statementsData.flatMap(item => Object.keys(item || {}))));
    const transformedMatrix = statementsData.map(item =>
      allKeys.map(key => item?.[key] ?? null)
    );
    setTxtMatrix(transformedMatrix);
  }, [statementsData]);

  //prepare data for upset diagram
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

  const { sets } = useMemo(() => extractCombinations(elems), [elems]);


  const combinations = useMemo(() => {
    let orderArray = [];

    // If groupOption is not empty, add it to the orderArray
    if (groupOption !== "") {
      orderArray.push(groupOption);
    }

    // If orderOption is not empty, add it to the orderArray
    if (orderOption !== "") {
      orderArray.push(orderOption);
    }

    const combinationsObject = {
      empty: emptyOption, // Evaluate based on the emptyOption state
      limit: limitOption, // Use the value of limitOption
      min: minSetSizeOption, // Use the value of minSetSizeOption
    };

    if (orderArray.length > 0) {
      combinationsObject.order = orderArray;
    }

    console.log("combinationsObejct:", combinationsObject)
    return combinationsObject; // Return the combinations object
  }, [emptyOption, limitOption, minSetSizeOption, orderOption, groupOption]);

  console.log("combinations:", combinations)


  return (
    <div className="mx-auto p-4">
      <h1 className="font-light lg:p-3 text-xl sm:text-2xl lg:text-3xl text-primary-content mb-4 lg:mb-0 pb-4">
        Data Analyst
      </h1>

      {showBreaks ? <span>{smSplit} / md {mdSplit} / lg {lgSplit} / xl {xlSplit} - {width}</span> : null}

      {/* Participants and Number Input Section */}
      {/* Participants and Number Input Section */}
      {/* Participants and Number Input Section */}
      {/* Participants and Number Input Section */}
      <div className="w-full px-4">
        <div className="grid grid-cols-4 gap-6 mb-4 w-full">


          {/* First Box - dropdown check box */}
          {/* Participants Selection Box with Expandable Scrollable Panel */}
          <div className="relative shadow-md border rounded bg-base-300 p-4 w-full">
            <details
              id="LGASelector"
              className="group"
              onClick={() => setOpenDetails("LGASelector")}
            >
              <summary className="text-primary-content cursor-pointer">
                Participants for analysis
              </summary>

              {/* Expandable Floating Panel */}
              <div className="absolute left-0 w-64 max-h-60 overflow-y-auto border rounded p-2 mt-2 bg-base-300 shadow-lg transition-all duration-300 scale-0 group-open:scale-100 group-open:opacity-100 opacity-0 z-50">
                {participantsData && participantsData.length > 0 ? (
                  participantsData.map((participant, index) => (
                    <Checkbox
                      key={participant.id}
                      label={`Participant ${index + 1}`}
                      value={selectedIndices.includes(index)}
                      setValue={(isSelected) => {
                        setSelectedIndices((prevSelectedIndices) =>
                          isSelected ? [...prevSelectedIndices, index] : prevSelectedIndices.filter(i => i !== index)
                        );
                      }}
                    />
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No participants available</p>
                )}
              </div>
            </details>
          </div>


          {/* Number of Factors Input */}
          <div className="shadow-md border rounded bg-base-300 p-4 w-full">
            <label className="text-primary-content mb-2">Number of factors:</label>
            <input
              type="number"
              className="input input-bordered input-sm w-full"
              min="0"
              value={nfactors}
              onChange={(e) => setNfactors(e.target.value)}
            />
          </div>

          {/* Allow Empty Sets Dropdown */}
          <div className="shadow-md border rounded bg-base-300 p-4 w-full">
            <label className="text-primary-content">Allow empty sets?</label>
            <select
              value={emptyOption}
              onChange={(e) => setEmptyOption(e.target.value === 'true')}
              className="select select-bordered w-full"
            >
              <option value={false}>False</option>
              <option value={true}>True</option>
            </select>
          </div>

          {/* Bar Limit Input */}
          <div className="shadow-md border rounded bg-base-300 p-4 w-full">
            <label className="text-primary-content mb-2">Bar limit:</label>
            <input
              type="number"
              className="input input-bordered input-sm w-full"
              min="0"
              value={limitOption}
              onChange={(e) => setLimitOption(e.target.value)}
            />
          </div>

          {/* Minimum Set Size Input */}
          <div className="shadow-md border rounded bg-base-300 p-4 w-full">
            <label className="text-primary-content mb-2">Minimum set size:</label>
            <input
              type="number"
              className="input input-bordered input-sm w-full"
              min="0"
              value={minSetSizeOption}
              onChange={(e) => setMinSetSizeOption(e.target.value)}
            />
          </div>

          {/* Group Sorting Dropdown */}
          <div className="shadow-md border rounded bg-base-300 p-4 w-full">
            <label className="text-primary-content">Sort based on group</label>
            <select
              value={groupOption}
              onChange={(e) => setGroupOption(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="">Do not sort based on group</option>
              <option value='group:desc'>Descending order</option>
              <option value="group:asc">Ascending order</option>
            </select>
          </div>

          {/* Sorting Order Dropdown */}
          <div className="shadow-md border rounded bg-base-300 p-4 w-full">
            <label className="text-primary-content">Sorting order</label>
            <select
              value={orderOption}
              onChange={(e) => setOrderOption(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="">Default sorting</option>
              <option value='degree:desc'>Descending order</option>
              <option value="degree:asc">Ascending order</option>
            </select>
          </div>
        </div>
      </div>






      {/* UpSet.js Chart */}
      <div className="flex justify-center items-center w-full h-[600px] my-5 relative">
        <div className="text-center">
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
            title="Interactive upset diagram"
            description="Information about common options of participants"
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
