//
//  IFQ717 Web Development Capstone
//
//  GraphDetails.jsx - Graphs selected details for selected LGAs by Gary Cazzulino
//                     Code support either using AGCharts or Rechart for graphing
//
//

import { AgCharts } from "ag-charts-react";
import { kGraphLineStyle } from "../../api/utils/constants";
import { kGraphColours } from "../../api/utils/constants";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useGesture } from '@use-gesture/react';
import { useState } from 'react';
import { addDaysToDate } from "../../api/utils/utils";

// reorganize data for Rechart option
function denormalizeDataSet(dataSet, field, scale) {
  let prevSampleDate = "";
  let retArray = new Array();
  let daySummary;

  dataSet.forEach((sample) => {
    let currValue = parseFloat(sample[field]) * scale;

    if (sample.sample_date.substring(0, 10) != prevSampleDate) {
      prevSampleDate = sample.sample_date.substring(0, 10);
      daySummary = {
        sample_date: sample.sample_date.substring(0, 10),
      };
      retArray.push(daySummary);
    }

    daySummary[sample.lga_name] = currValue;
  });

  return retArray;
}

export default function GraphDetails({
  dataSet,
  startDate,
  setStartDate,
  totalDateRange,
  setSelectedDateRange,
  windowDays,
  setWindowDays,
  title,
  field,
  scale,
  useRechart,
  LGAs,
}) {

  let prevDragDx = 0;
  let prevDragDy = 0;

  const kYZoomScale = 1.5;

  // code to implment on drag scaling of graph
  const bind = useGesture({
    onDrag: ({ delta: [dx, dy] }) => {

      // calculate the potential new start date and day window size
      let nextStartDate = addDaysToDate(startDate, -(dx - prevDragDx));
      let nextWindowDays = windowDays + ((dy - prevDragDy) * kYZoomScale);

      // now adjust these to be realistic
      if (nextWindowDays < 7) nextWindowDays = 7;

      else if (nextWindowDays > 365) nextWindowDays = 365;

      if (nextStartDate < totalDateRange.firstDate) {
        nextStartDate = totalDateRange.firstDate;

      } else if (nextStartDate > addDaysToDate(totalDateRange.lastDate, -windowDays/*-14*/)) {

        nextStartDate = addDaysToDate(totalDateRange.lastDate, /*-14*/-windowDays);

      } else {

        // set them if they are realistic
        setWindowDays(nextWindowDays);
        setStartDate(nextStartDate);
        setSelectedDateRange({ startDate: nextStartDate, endDate: addDaysToDate(nextStartDate, nextWindowDays)});

        // record previous values to determine the delta for next time
        prevDragDx = dx;
        prevDragDy = dy;
  
      }
    },
  });

  // implement Rechart option
  if (useRechart) {
    const data = denormalizeDataSet(dataSet, field, scale);

    return (
      <div key={field} {...bind()} style={{ width: "100%", height: "90%", userSelect: 'none', touchAction: 'none', margin: 10 }}>
        <ResponsiveContainer style={{}}>
          <h2
            className="text-primary-content font-light pb-3"
            style={{ textAlign: "center" }}
          >
            {title}
          </h2>

          <LineChart style={{ cursor: 'grab' }}
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <XAxis dataKey="sample_date" />
            <YAxis />
            {/*<Tooltip />*/}
            <Legend />
            {LGAs.map((LGA) => {
              return (
                <Line key={LGA}
                  type="monotone"
                  name={LGA}
                  dataKey={LGA}
                  stroke={kGraphColours[LGA]}
                  dot={false}
                  isAnimationActive={false}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  
  // implement AGChart option
  } else {

    let options = {
      title: {
        text: title,
      },
      // Data to be displayed in the chart
      data: dataSet.map((sample) => {
        return {
          sample_date: sample.sample_date.substring(0, 10),
          average_booking_window: parseFloat(sample[field]),

          noosa_sample_date:
            sample.lga_name == "Noosa"
              ? sample.sample_date.substring(0, 10)
              : null,
          gold_coast_sample_date:
            sample.lga_name == "Gold Coast"
              ? sample.sample_date.substring(0, 10)
              : null,
          whitsunday_sample_date:
            sample.lga_name == "Whitsunday"
              ? sample.sample_date.substring(0, 10)
              : null,
          cairns_sample_date:
            sample.lga_name == "Cairns"
              ? sample.sample_date.substring(0, 10)
              : null,

          noosa_value:
            sample.lga_name == "Noosa"
              ? parseFloat(sample[field]) * scale
              : null,
          gold_coast_value:
            sample.lga_name == "Gold Coast"
              ? parseFloat(sample[field]) * scale
              : null,
          whitsunday_value:
            sample.lga_name == "Whitsunday"
              ? parseFloat(sample[field]) * scale
              : null,
          cairns_value:
            sample.lga_name == "Cairns"
              ? parseFloat(sample[field]) * scale
              : null,
        };
      }),
      // Defines which chart type and data to use
      series: [
        LGAs.find((LGA) => LGA === "Noosa")
          ? {
            type: "line",
            xKey: "noosa_sample_date",
            yKey: "noosa_value",
            yName: "Noosa",
            interpolation: { type: kGraphLineStyle },
            strokeWidth: 1,
            marker: {
              enabled: false,
            },
          }
          : {},
        LGAs.find((LGA) => LGA === "Gold Coast")
          ? {
            type: "line",
            xKey: "gold_coast_sample_date",
            yKey: "gold_coast_value",
            yName: "Gold Coast",
            interpolation: { type: kGraphLineStyle },
            strokeWidth: 1,
            marker: {
              enabled: false,
            },
          }
          : {},
        LGAs.find((LGA) => LGA === "Whitsunday")
          ? {
            type: "line",
            xKey: "whitsunday_sample_date",
            yKey: "whitsunday_value",
            yName: "Whitsunday",
            interpolation: { type: kGraphLineStyle },
            strokeWidth: 1,
            marker: {
              enabled: false,
            },
          }
          : {},
        LGAs.find((LGA) => LGA === "Cairns")
          ? {
            type: "line",
            xKey: "cairns_sample_date",
            yKey: "cairns_value",
            yName: "Cairns",
            interpolation: { type: kGraphLineStyle },
            strokeWidth: 1,
            marker: {
              enabled: false,
            },
          }
          : {},
      ],
      axes: [
        {
          type: "date",
          position: "bottom",
        },
        {
          type: "number",
          position: "left",
          label: {
            format: "#{.1f} Days",
          },
        },
      ],
    };

    // implement the AG Chart option
    return <AgCharts options={options} />;
  }
}
