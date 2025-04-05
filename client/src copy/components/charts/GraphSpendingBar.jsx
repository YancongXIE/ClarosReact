//
//  IFQ717 Web Development Capstone
//
//  GraphSpendPie.js - Graphs selected spend data for an single LGA as a bar chart by Gary Cazzulino
//
//                     NOTE: Not fully implemented as pie chart is the current preferred option
//
//

import { AgCharts } from "ag-charts-react";
import { kGraphLineStyle, kGraphColours, kGraphSpendColours } from "../../api/utils/constants";
import { average, convertToLabel, toTitleCase } from "../../api/utils/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function GraphSpendingBar({
  dataSet,
  title,
  selectedCats,
  field,
  scale,
  useRechart,
  LGAs,
}) {

  // implement Rechart option
  if (useRechart) {
    const data = selectedCats.map((cat) => {
      return (
        {
          "category": cat,
          [convertToLabel(cat) + "_average"]: average(
            dataSet
              .filter((sample) => toTitleCase(sample.category) === cat)
              .map((sample) => {
                return parseFloat(sample[field]) * scale;
              })
          ),
        })
    });

    return (
      <div key={LGAs[0]} style={{ width: "100%", height: "90%" }}>
        <ResponsiveContainer>
          <h2
            className="text-primary-content font-light pb-3"
            style={{ textAlign: "center" }}
          >
            {title}
          </h2>
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            
            <YAxis />
            <Tooltip />
            {selectedCats.length < 7 ? <Legend /> : null}
            {selectedCats.map((cat) => {
              return (
                <Bar key={`${cat}_${LGAs[0]}`}
                  type="monotone"
                  name={cat}
                  dataKey={convertToLabel(cat) + "_average"}
                  stroke={kGraphSpendColours[cat.toUpperCase()]}
                  fill={kGraphSpendColours[cat.toUpperCase()]}
                  dot={false}
                  isAnimationActive={true}
                />
              );
            })}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  } else {

    // implement AG Chart option
    return <AgCharts options={options} />;
  }
}
