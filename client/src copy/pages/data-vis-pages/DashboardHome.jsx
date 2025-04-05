import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import DashboardBarChartsSection from "../../sections/data-vis-sections/dashboard/DashboardBarChartsSection";
import DashboardQuadrantScatterSection from "../../sections/data-vis-sections/dashboard/DashboardQuadrantScatterSection";
import Map from "../../components/ui/Map";

import RankingApp from "../../sections/data-vis-sections/dashboard/RankingApp";
import UpSetChart from "../../sections/data-vis-sections/dashboard/Upset";
import QMethodAnalysis from "../../sections/data-vis-sections/dashboard/ComplexHeatMap";
import QMethod from "../../sections/data-vis-sections/dashboard/QMethod";
import ExampleUpSetChart from "../../sections/data-vis-sections/dashboard/ExampleUpset";

export default function DashboardHome() {
  const { user } = useContext(AuthContext);
  const userLGA = user?.lga || "Unknown LGA";

  return (
    <div>
      <div className="pb-5 md:p-8">
        <div className="grid gap-6 lg:grid-cols-2 items-start pb-8">
          <div>
            <h1 className="font-light text-xl sm:text-2xl lg:text-3xl text-primary-content mb-4 lg:mb-0 pb-4">
              Overview for{" "}
              <span className="font-bold text-primary-content underline underline-offset-2 decoration-primary decoration-4">
                {userLGA}
              </span>
            </h1>
            <p className="text-base sm:text-lg text-primary-content">
              Detailed overview of the latest data and insights for your area.
              Explore charts and maps below to analyse trends and patterns.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end mt-4 lg:mt-0">
            <Map location={userLGA} />
          </div>
        </div>
      </div>
       {/* <RankingApp /> */}
      {/* <UpSetChart /> */}
      {/* <QMethodAnalysis/>
        <QMethod /> */}
      {/* <ExampleUpSetChart /> */}
      {/* <DashboardBarChartsSection /> */}
      {/* <DashboardQuadrantScatterSection /> */}
    </div>
  );
}
