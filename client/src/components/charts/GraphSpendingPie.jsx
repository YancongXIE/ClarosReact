//
//  IFQ717 Web Development Capstone
//
//  GraphSpendPie.js - Graphs selected spend data for an single LGA as a pie chart by Gary Cazzulino
//
//

import { AgCharts } from "ag-charts-react";
import { kGraphLineStyle, kGraphColours, kGraphSpendColours } from "../../api/utils/constants";
import { average, convertToLabel, toTitleCase } from "../../api/utils/utils";
import { useWindowWidthResize } from "../../api/hooks/useWindowWidthResize";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function GraphSpendingPie({
  dataSet,
  title,
  selectedCats,
  field,
  scale,
  useRechart,
  LGAs,
}) {

  const { width } = useWindowWidthResize();

  // implement the Rechart option
  if (useRechart) {
    const data = selectedCats.map((cat) => {return (   
      {
        "category" : cat,
        "average" : average(
          dataSet
            .filter((sample) => toTitleCase(sample.category) === cat)
            .map((sample) => {
              return parseFloat(sample[field]) * scale;
            })
        ),
      })});
    
    return (
      <div style={{ width: "100%", height: "90%" }}>
        <ResponsiveContainer>
          <h2
            className="text-primary-content font-light pb-3"
            style={{ textAlign: "center" }}
          >
            {title}
          </h2>
          <PieChart width={730} height={250}>
            <Tooltip />
            {selectedCats.length <= (width < 2040 ? 6 : 15) ? <Legend wrapperStyle={{ fontSize:10, paddingBottom:10 }} /> : null}
            <Pie data={data} nameKey="category" dataKey="average" >
              {data.map((entry, index) => (
                entry !== null ?
                  <Cell key={`cell-${entry.lga}`} fill={kGraphSpendColours[entry.category.toUpperCase()]} /> : null
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  } else {
    // implement the AG Chart option
    return "Unimplemented in AG Charts ATM"; //<AgCharts options={options} />;
  }
}
