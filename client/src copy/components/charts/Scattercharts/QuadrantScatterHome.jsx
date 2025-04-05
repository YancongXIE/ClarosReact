/*
Contains the view logic for rendering scatter charts
by Matthew Campbell
*/

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeProvider";
import { lgaColours } from "../../../api/utils/graphColourConfig";
import CustomTooltip from "../CustomTooltips/CustomTooltip";
import CustomScatterDots from "../CustomScatterDots/CustomScatterDots";

export default function QuadrantScatterHome({ year, data, loading, user }) {
  const { darkMode } = useContext(ThemeContext);

  const userLGA = user?.lga || "";

  let scatterData = [];
  let xMin = 0;
  let xMax = 0;
  let yMin = 0;
  let yMax = 0;
  let xMid = 0;
  let yMid = 0;
  let xTicks = [];

  if (!loading && data) {
    scatterData = data
      .map((item) => {
        const x = parseFloat(item["average_daily_rate"].toFixed(2));
        const y = parseFloat(item["average_length_of_stay"].toFixed(2));
        if (isNaN(x) || isNaN(y)) {
          return null;
        }
        return {
          x,
          y,
          month: item.month,
        };
      })
      .filter((item) => item !== null);

    // calculate x-axis min, max, and ticks
    const xValues = scatterData.map((point) => point.x);
    const yValues = scatterData.map((point) => point.y);

    xMin = Math.floor(Math.min(...xValues) / 10) * 10;
    xMax = Math.ceil(Math.max(...xValues) / 10) * 10;
    yMin = Math.floor(Math.min(...yValues) / 10) * 10;
    yMax = Math.ceil(Math.max(...yValues) / 10) * 10;

    // mid values needed for reference line
    xMid = (xMin + xMax) / 2;
    yMid = (yMin + yMax) / 2;

    //min, max values needed to determine what to display on axes
    if (xMin === xMax) {
      xMin -= 10;
      xMax += 10;
    }

    for (let i = xMin; i <= xMax; i += 10) {
      xTicks.push(i);
    }
  }

  const colours = lgaColours[userLGA]?.[darkMode ? "dark" : "light"];

  const fillColour = colours.primary;

  return (
    <div style={{ width: "100%", height: 400 }}>
      {loading ? (
        <p>Loading...</p>
      ) : scatterData.length > 0 ? (
        <ResponsiveContainer>
          <ScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <XAxis
              type="number"
              dataKey="x"
              name="Average Daily Rate"
              unit="(AUD)"
              domain={[xMin, xMax]}
              ticks={xTicks}
              style={{
                fill: colours["primary-content"],
              }}
              padding={{ left: 40, right: 40 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Average Length of Stay"
              domain={[yMin, yMax]}
              unit=" days"
              style={{
                fill: colours["primary-content"],
              }}
              padding={{ top: 20, bottom: 20 }}
            />
            <Tooltip
              content={<CustomTooltip userLGA={userLGA} chartType="scatter" />}
            />
            <ReferenceLine
              x={xMid}
              style={{
                fill: colours["primary-content"],
              }}
            />
            <ReferenceLine
              y={yMid}
              style={{
                fill: colours["primary-content"],
              }}
            />
            <Scatter
              name="Average Daily Rate vs Average Length of Stay"
              data={scatterData}
              shape={<CustomScatterDots />}
            />
          </ScatterChart>
        </ResponsiveContainer>
      ) : (
        <p>No data available for the selected year.</p>
      )}
    </div>
  );
}
