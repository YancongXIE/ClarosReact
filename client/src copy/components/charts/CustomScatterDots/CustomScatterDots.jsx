/*
Configuration for turning regular Recharts scatter dots into letters representing each month
by Matthew Campbell
*/

import { monthColours } from "../../../api/utils/graphColourConfig";

export default function CustomScatterDots({ cx, cy, payload }) {
  const { month } = payload;
  const fillColour = monthColours[month];

  return (
    <text
      x={cx}
      y={cy}
      dy={4}
      textAnchor="middle"
      fontSize={16}
      fill={fillColour}
      fontWeight={900}
    >
      {month[0]}
    </text>
  );
}
