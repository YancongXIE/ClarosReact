import React, { useState, useEffect } from "react";
import { useExerciseStatements } from "../../../api/hooks/useExerciseStatements";
import { useRespondentDistribution } from "../../../api/hooks/useRespondentDistribution";
import { useSubmitQSort } from "../../../api/hooks/useSubmitQSort";

export default function RankingExerciseTable() {
  const { loading, data, error } = useExerciseStatements();
  const { distribution, distributionLoading, distributionError } = useRespondentDistribution();
  const { submitQSort, submitLoading, submitError } = useSubmitQSort();
  const [selectedValues, setSelectedValues] = useState({});
  const [distributionArray, setDistributionArray] = useState([]);
  const [warnings, setWarnings] = useState({
    groupNeg2: "",
    groupNeg1: "",
    groupZero: "",
    groupPos1: "",
    groupPos2: "",
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Convert distribution string to array
  useEffect(() => {
    if (distribution) {
      const array = distribution.split(',').map(num => parseInt(num));
      setDistributionArray(array);
    }
  }, [distribution]);

  // Initialize selectedValues once data is loaded
  useEffect(() => {
    if (data && Object.keys(selectedValues).length === 0) {
      const initialSelectedValues = data.reduce((acc, { statementID }) => {
        acc[statementID] = 0;
        return acc;
      }, {});
      setSelectedValues(initialSelectedValues);
    }
  }, [data, selectedValues]);

  // Recalculate warnings based on selectedValues changes
  useEffect(() => {
    if (data && selectedValues) {
      const groupNeg2 = data.filter(({ statementID }) => selectedValues[statementID] === -2);
      const groupNeg1 = data.filter(({ statementID }) => selectedValues[statementID] === -1);
      const groupZero = data.filter(({ statementID }) => selectedValues[statementID] === 0);
      const groupPos1 = data.filter(({ statementID }) => selectedValues[statementID] === 1);
      const groupPos2 = data.filter(({ statementID }) => selectedValues[statementID] === 2);

      const newWarnings = {};
      newWarnings.groupNeg2 = getGroupWarning(groupNeg2, distributionArray[0]);
      newWarnings.groupNeg1 = getGroupWarning(groupNeg1, distributionArray[1]);
      newWarnings.groupZero = getGroupWarning(groupZero, distributionArray[2]);
      newWarnings.groupPos1 = getGroupWarning(groupPos1, distributionArray[3]);
      newWarnings.groupPos2 = getGroupWarning(groupPos2, distributionArray[4]);

      setWarnings(newWarnings);
    }
  }, [selectedValues, data, distributionArray]);

  const getGroupWarning = (group, targetCount) => {
    const groupLength = group.length;
    if (groupLength !== targetCount) {
      const difference = targetCount - groupLength;
      return difference > 0
        ? `Increase ${difference} statements`
        : `Decrease ${Math.abs(difference)} statements`;
    }
    return "";
  };

  const handleRadioChange = (id, value) => {
    setSelectedValues(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleReset = () => {
    if (data) {
      setSelectedValues(
        data.reduce((acc, { statementID }) => {
          acc[statementID] = 0;
          return acc;
        }, {})
      );
    }
  };

  const isValid = data && Object.values(warnings).every(w => w === "");

  const getWarningColor = (groupName) => (warnings[groupName] ? "#f8d7da" : "#e3f2fd");

  const handleSubmit = async () => {
    if (isValid) {
      const success = await submitQSort(selectedValues);
      setSubmitSuccess(success);
    }
  };

  // Now conditionally render the content:
  let content;
  if (loading) {
    content = <div>Loading...</div>;
  } else if (error) {
    content = <div>Error: {error}</div>;
  } else if (!Array.isArray(data)) {
    content = <div>Error: Data is not an array</div>;
  } else {
    content = (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
        {/* Reset Button */}
        <div style={{ width: "80%", display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
          <button
            onClick={handleReset}
            className="btn btn-danger"
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px",
              border: "2px solid #dc3545",
              boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
              backgroundColor: "#dc3545",
              color: "white",
            }}
          >
            Reset
          </button>
        </div>

        {/* Table */}
        <div
          style={{
            width: "80%",
            border: "1px solid #bbb",
            borderRadius: "8px",
            padding: "10px",
            boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
            backgroundColor: "#f8f9fa",
          }}
        >
          <table className="table table-bordered" style={{ width: "100%", textAlign: "center", borderCollapse: "collapse" }}>
            <tbody>
              {[
                { label: "+2", groupName: "groupPos2" },
                { label: "+1", groupName: "groupPos1" },
                { label: "0", groupName: "groupZero" },
                { label: "-1", groupName: "groupNeg1" },
                { label: "-2", groupName: "groupNeg2" },
              ].map(({ label, groupName }) => {
                const group = data.filter(({ statementID }) => selectedValues[statementID] === (label === "+2" ? 2 : label === "+1" ? 1 : label === "0" ? 0 : label === "-1" ? -1 : -2));
                const warning = warnings[groupName];
                return (
                  <React.Fragment key={label}>
                    <tr style={{ backgroundColor: getWarningColor(groupName) }}>
                      <td align="center" style={{ width: "10%", color: "#2452b5", fontSize: "120%", fontWeight: "bold" }}>
                        {label}
                      </td>
                      <td align="center" colSpan={2} style={{ width: "65%", color: "#c70808", fontStyle: "italic" }}>
                        {warning || ""}
                      </td>
                      {["-2", "-1", "0", "+1", "+2"].map((val) => (
                        <td key={val} align="center" style={{ width: "5%" }}>
                          {val}
                        </td>
                      ))}
                    </tr>
                    {group.map((statement) => (
                      <tr
                        key={statement.statementID}
                        style={{
                          backgroundColor: statement.statementID % 2 === 0 ? "#f9f9f9" : "white",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        <td style={{ width: "10%" }}></td>
                        <td style={{ width: "10%", fontWeight: "bold" }}>{statement.statementID}</td>
                        <td style={{ width: "55%" }}>{statement.statementText}</td>
                        {[-2, -1, 0, 1, 2].map((val) => (
                          <td key={val} align="center" style={{ width: "5%" }}>
                            <input
                              className="form-check-input"
                              type="radio"
                              name={`option-${statement.statementID}`}
                              value={val}
                              checked={selectedValues[statement.statementID] === val}
                              onChange={() => handleRadioChange(statement.statementID, val)}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        {isValid && (
          <div style={{ marginTop: "20px", width: "80%", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <button
              onClick={handleSubmit}
              disabled={submitLoading}
              className="btn btn-success"
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "8px",
                backgroundColor: "#28a745",
                color: "white",
                border: "2px solid #28a745",
                opacity: submitLoading ? 0.7 : 1,
              }}
            >
              {submitLoading ? "Submitting..." : "Submit Ranking"}
            </button>
            {submitError && (
              <div style={{ color: "red", marginTop: "10px" }}>
                Submission failed: {submitError}
              </div>
            )}
            {submitSuccess && (
              <div style={{ color: "green", marginTop: "10px" }}>
                Submission successful!
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return content;
}
