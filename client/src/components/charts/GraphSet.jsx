//
//  IFQ717 Web Development Capstone
//
//  GraphSet.jsx - Container for a combined detail and average graph by Gary Cazzulino
//
//

import GraphDetails from "../charts/GraphDetails";
import GraphAverages from "../charts/GraphAverages";
import GraphAreaUnderCurve from "../charts/GraphAreaUnderCurve";
import { useWindowWidthResize } from "../../api/hooks/useWindowWidthResize";

export default function GraphSet({
  id,
  useRechart,
  title,
  avgTitle,
  field,
  dataSet,
  startDate,
  setStartDate,
  windowDays,
  setWindowDays,
  totalDateRange,
  setSelectedDateRange,
  LGAs,
  scale,
}) {

  const { width } = useWindowWidthResize();

  // calculate the sizes of the graphs - complicated cause of some higher level container styling issues
  // and the need for it to be responsive even needing non-standard break points
  let graphWidth = (width > 1024 ? "100%" : width * (width > 640 ? 0.65 : 0.75));
  let averagesWidth = (width > 900 ? "100%" : width * 0.8);
 
  const kGraphHeight = 350;
  const kGraphBreakPoint = 900;

  return (
    <div key={field} id={id} className="grid sm:grid-cols-1 md:grid-cols-5 md:gap-4 mb-4 md:p-4 bg-base-300 shadow-md">
      <div className="sm:col-span-1 md:col-span-4">
        <div className="" style={{ height: kGraphHeight, width: graphWidth }}>
          <GraphDetails
            useRechart={useRechart}
            title={title}
            field={field}
            scale={scale}
            dataSet={dataSet}
            startDate={startDate}
            setStartDate={setStartDate}
            windowDays={windowDays}
            setWindowDays={setWindowDays}
            totalDateRange={totalDateRange}
            setSelectedDateRange={setSelectedDateRange}
            LGAs={LGAs}
          />
        </div>
        { width <= kGraphBreakPoint ?
        <div className="mb-10" style={{ height: kGraphHeight, width: averagesWidth }}>
          <br></br>
          {/*GraphAreaUnderCurve*/}
          <GraphAverages
            useRechart={useRechart}
            title={avgTitle }
            scale={scale}
            field={field}
            dataSet={dataSet}
            LGAs={LGAs}
          />
        </div> : null }
      </div>
      <div className="sm:col-span-1 md:col-span-1">
        { width > kGraphBreakPoint ?
        <div className="mb-10" style={{ height: kGraphHeight, width: averagesWidth }}>
          {/*GraphAreaUnderCurve*/}
          <GraphAverages
            useRechart={useRechart}
            title={avgTitle}
            scale={scale}
            field={field}
            dataSet={dataSet}
            LGAs={LGAs}
          />
        </div> : null }
      </div>
    </div>
  );
}
