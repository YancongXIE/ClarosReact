/*
Bar charts are rendered here in a section by themselves on the DashboardHome page/endpoint.
Contains the chart configuration logic (useChartDataConfig) and state for setting the year, and opening and closing the modal.
Data and other configuration passed down to AI Analysis modal as props.
*/

import { useContext, useState } from "react";
import { useChartDataConfig } from "../../../api/hooks/useChartDataConfig";
import BarChartHome from "../../../components/charts/Barcharts/BarChartHome";
import { SelectWithBorderSmall } from "../../../components/ui/Selects";
import { fields } from "../../../api/utils/constants";
// import GraphInfoIcon from "../../../components/ui/GraphInfoIcon";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import { ButtonOpenAIAnalysisModal } from "../../../components/ui/Buttons";
import { AIAnalysisModal } from "../../../components/layout/analysis/AIAnalysisModal";
import { AiAnalysisContext } from "../../../context/AiAnalysisProvider";

export default function DashboardBarChartsSection() {
  const [year, setYear] = useState(2023);
  const { setYear: setAnalysisYear } = useContext(AiAnalysisContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { loading, data, error, user } = useChartDataConfig({
    endpoint: "/combined_data",
    year,
    dataFields: fields,
    chartType: "bar",
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="mb-5">
      {error && (
        <p className="text-error">
          Graphs could not be displayed. Please try again later.
        </p>
      )}
      <div className="pb-5 flex justify-end gap-2 items-center">
        <ButtonOpenAIAnalysisModal onClick={openModal} />
        <SelectWithBorderSmall
          onChange={(e) => {
            const selectedYear = Number(e.target.value);
            console.log("Year selected:", selectedYear);
            setYear(selectedYear);
            setAnalysisYear(selectedYear);
          }}
        >
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </SelectWithBorderSmall>
      </div>
      {/* <div className="flex flex-wrap md:flex-nowrap items-center gap-4 mb-10">
        <div className="shadow-md border-1 rounded p-2 w-[430px] h-[325px]">
          <Map location={user.lga}></Map>
        </div>
        <div className="flex items-center">
          {!loading && !error ? (
            <div className="shadow-md border-1 rounded mb-3 bg-base-300 h-[325px]">
              <LLMResponse content={responseFromLLM}></LLMResponse>
            </div>
          ) : (
            <LoadingSpinner></LoadingSpinner>
          )}
        </div>
      </div> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {fields.map((field) => (
          <div
            key={field}
            className="relative p-4 bg-base-300 rounded-md shadow-md"
          >
            <BarChartHome
              year={year}
              dataField={field}
              data={data}
              loading={loading}
              user={user}
            />
            {/* {field && (
              <div className="absolute top-2 right-2 pointer-events-auto">
                <GraphInfoIcon
                  info={
                    "Average daily rate refers to how much money a room makes on average per day."
                  }
                />
              </div>
            )} */}
          </div>
        ))}
      </div>

      {isModalOpen && data && (
        <AIAnalysisModal
          closeModal={closeModal}
          data={data}
          user={user}
          year={year}
          fields={fields}
          loading={loading}
          chartType="bar"
        />
      )}
    </div>
  );
}
