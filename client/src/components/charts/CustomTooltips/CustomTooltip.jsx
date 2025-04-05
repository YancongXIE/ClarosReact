/* 
Custom tooltips for graphs. Can be further added to in the return statement with the chartType prop
by Matthew Campbell
*/

import { lgaColours } from "../../../api/utils/graphColourConfig";

export default function CustomTooltip({
  active,
  payload,
  label,
  chartType,
  userLGA,
  darkMode,
}) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const value = payload[0].value;

    const currentColors =
      lgaColours[userLGA]?.[darkMode ? "dark" : "light"] || {};

    return (
      <div
        style={{
          backgroundColor: currentColors["base-300"] || "#F0F0F0",
          color: currentColors["primary-content"] || "#000",
          padding: "10px",
          borderRadius: "5px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        }}
        // add different charts as required below
      >
        {chartType === "bar" && (
          <>
            <>
              <p>{`Month: ${data.month}`}</p>
              <p>{`Value: ${value}`}</p>
            </>
          </>
        )}
        {chartType === "scatter" && (
          <>
            <p>{`Month: ${data.month}`}</p>
            <p>{`Average Daily Rate: ${data.x} (AUD)`}</p>
            <p>{`Average Length of Stay: ${data.y} days`}</p>
          </>
        )}
      </div>
    );
  }
  return null;
}
