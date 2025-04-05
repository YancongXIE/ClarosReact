import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import DashboardBarChartsSection from "../../sections/data-vis-sections/dashboard/DashboardBarChartsSection";
import DashboardQuadrantScatterSection from "../../sections/data-vis-sections/dashboard/DashboardQuadrantScatterSection";
import Map from "../../components/ui/Map";

import RankingApp from "../../sections/data-vis-sections/dashboard/RankingApp";
//import Example from "../../sections/data-vis-sections/dashboard/ExampleUpset";
import UpsetUI from "../../sections/data-vis-sections/dashboard/Upset";


export default function DashboardHome() {
  const { user } = useContext(AuthContext);
  const userLGA = user?.lga || "Unknown LGA";

  return (
    <div>
      {/* <RankingApp />  */}
      <UpsetUI />
      {/* <Example/> */}
    </div>
  );
}
