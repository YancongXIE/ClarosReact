/*
Scatter charts are rendered here in a section by themselves on the DashboardHome page/endpoint.
Contains the chart configuration logic (useChartDataConfig) and state for setting the year, and opening and closing the modal.
Data and other configuration passed down to AI Analysis modal as props.
*/

import { useState } from "react";
import { useChartDataConfig } from "../../../api/hooks/useChartDataConfig";
import QuadrantScatterHome from "../../../components/charts/Scattercharts/QuadrantScatterHome";
import { SelectWithBorderSmall } from "../../../components/ui/Selects";
import { AIAnalysisModal } from "../../../components/layout/analysis/AIAnalysisModal";
import { ButtonOpenAIAnalysisModal } from "../../../components/ui/Buttons";
// import { AiAnalysisProvider } from "../../../context/AiAnalysisProvider";

export default function DashboardQuadrantScatterSection() {
  const [year, setYear] = useState(2023);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dataFields = ["average_daily_rate", "average_length_of_stay"];

  const { loading, data, error, user } = useChartDataConfig({
    endpoint: "/combined_data",
    year,
    dataFields,
    chartType: "quadrantScatter",
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="quadrant-scatter-section mb-5s">
      {error && (
        <p className="text-error">
          Graphs could not be displayed. Please try again later.
        </p>
      )}
      <div className="pb-5 flex justify-end gap-2">
        <ButtonOpenAIAnalysisModal onClick={openModal} />
        <SelectWithBorderSmall
          onChange={(e) => setYear(Number(e.target.value))}
        >
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </SelectWithBorderSmall>
      </div>
      <div className="p-4 bg-base-300 rounded-md shadow-md">
        <QuadrantScatterHome
          year={year}
          data={data}
          user={user}
          loading={loading}
        />
      </div>

      {isModalOpen && data && (
        <AIAnalysisModal
          closeModal={closeModal}
          data={data}
          user={user}
          year={year}
          fields={dataFields}
          loading={loading}
          chartType="scatter"
        />
      )}
    </div>
  );
}
