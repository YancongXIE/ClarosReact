import BarChartHome from "../../../components/charts/Barcharts/BarChartHome";
import QuadrantScatterHome from "../../../components/charts/Scattercharts/QuadrantScatterHome";

const ChartRenderer = ({ chartType, ...props }) => {
  switch (chartType) {
    case "bar":
      return <BarChartHome {...props} />;
    case "scatter":
      return <QuadrantScatterHome {...props} />;
  }
};

export default ChartRenderer;
