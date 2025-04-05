import { useContext } from "react";
import { AiAnalysisContext } from "../../../context/AiAnalysisProvider";
import ChartRenderer from "./ChartRenderer";
import {
  ButtonOutline,
  ButtonSmallSecondary,
  CloseButton,
} from "../../ui/Buttons";
import LoadingSpinner from "../../ui/LoadingSpinner";
import { SelectLLMPrompt } from "../../ui/Select";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Draggable from "react-draggable";
import { PDFDownloadLink } from "@react-pdf/renderer";
import AiReportDocument from "../../pdf/AiReportDocument";
// import { getLLMResponseFromServer } from "../../api/utils/getUtils";

export function AIAnalysisModal({
  closeModal,
  data,
  user,
  year,
  fields,
  loading,
  chartType,
}) {
  const {
    isButtonDisabled,
    customPrompt,
    setCustomPrompt,
    defaultPrompt,
    setDefaultPrompt,
    LLMResponse: responseContent,
    doAnalysis,
    handleSelectChange,
  } = useContext(AiAnalysisContext);

  const handleDoAnalysis = (e) => {
    e.preventDefault();
    console.log("handleDoAnalysis called");
    doAnalysis(e, data, user, year, chartType);
  };

  return (
    <div>
      <Draggable>
        <dialog
          id="analyse_modal"
          className="modal w-full max-w-6xl mx-auto p-4 fixed bottom-1/2 right-1/8 transform -translate-x-1/2 -translate-y-1/2"
          open
        >
          <div className="shadow-md border-1 rounded p-6 relative shadow-lg bg-base-300 bg-opacity-95">
            <div className="flex justify-end">
              <CloseButton onClick={closeModal} />
            </div>
            {!responseContent && (
              <form
                id="prompt-form"
                method="dialog"
                onSubmit={handleDoAnalysis}
              >
                <label
                  id="prompt-label"
                  className="form-control text-primary-content"
                >
                  <div className="label">
                    <span className="font-bold text-primary-content pb-4 underline decoration-primary">
                      Instant AI data report
                    </span>
                  </div>
                  <div className="label">
                    <span className="text-primary-content pb-2">
                      Use a default prompt:
                    </span>
                  </div>
                  <div className="pb-4">
                    <SelectLLMPrompt
                      handleSelectChange={handleSelectChange}
                      value={defaultPrompt}
                      onChange={(e) => setDefaultPrompt(e.target.value)}
                    />
                  </div>
                </label>
                <label
                  id="prompt-label"
                  className="form-control text-primary-content"
                >
                  <div className="label">
                    <span className="text-primary-content pb-2">
                      Write a custom prompt:
                    </span>
                  </div>
                  <div className="pb-4">
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      className="textarea textarea-bordered h-24 w-full text-primary-content shadow-lg bg-base-300 max-h-40"
                      placeholder="Write your custom prompt here."
                    ></textarea>
                  </div>
                </label>
                <div className="flex justify-end">
                  <ButtonOutline
                    onClick={handleDoAnalysis}
                    disabled={isButtonDisabled}
                    className={
                      isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
                    }
                  >
                    Analyse
                  </ButtonOutline>
                </div>
              </form>
            )}

            {loading && (
              <div className="text-center m-2">
                <LoadingSpinner />
              </div>
            )}

            {responseContent && (
              <div className="mb-5">
                <div className="text-primary font-semibold mb-4 p-2">
                  AI-Generated Report:
                </div>

                <div className="overflow-auto max-h-[80vh]">
                  {chartType === "scatter" ? (
                    <div className>
                      <ChartRenderer
                        chartType={chartType}
                        year={year}
                        dataField={fields}
                        data={data}
                        loading={loading}
                        user={user}
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
                      {fields.map((field) => (
                        <div
                          key={field}
                          className="relative p-4 bg-base-200 rounded-md shadow-md"
                        >
                          <ChartRenderer
                            chartType={chartType}
                            year={year}
                            dataField={field}
                            data={data}
                            loading={loading}
                            user={user}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="bg-base-200 min-h-30 text-primary-content p-4 rounded-md">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {responseContent}
                    </ReactMarkdown>
                  </div>
                  <div className="flex justify-end pt-6 gap-4">
                    <ButtonSmallSecondary>Save Report</ButtonSmallSecondary>
                    <PDFDownloadLink
                      document={
                        <AiReportDocument
                          data={data}
                          fields={fields}
                          year={year}
                          user={user}
                          responseContent={responseContent}
                        />
                      }
                      fileName={`AI_Report_${year}.pdf`}
                      className="btn btn-secondary btn-sm text-secondary-content"
                    >
                      {({ loading }) =>
                        loading ? "Preparing Document..." : "Download Report"
                      }
                    </PDFDownloadLink>
                  </div>
                </div>
              </div>
            )}
          </div>
        </dialog>
      </Draggable>
    </div>
  );
}
