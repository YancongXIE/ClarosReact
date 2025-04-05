//
//  IFQ717 Web Development Capstone
//
//  AnalyseModal.jsx - dialog widget for LLM analysis of selected data by Gary Cazzulino
//
//

import { ButtonMediumFullWide } from "../ui/Buttons";
import LoadingSpinner from "../ui/LoadingSpinner";
import LLMResponse from "./LLMResponse";
import { SelectLLMPrompt } from "../ui/Select";
import { getLLMResponseFromServer } from "../../api/utils/getUtils";

// clear custom prompt if a default is selected
function handleSelectChange() {
  document.getElementById("prompt").value = "";
}

const AIAnalysis = ({ dataSet, llmResponse, setllmResponse, setAiAnalysisSelected, afterClickAnalyse }) => {

  // left over from when this was a modal popup still may be usefull
  function closeForm() {
    setllmResponse(kDefaultResponse);
    document.getElementById("analyse_modal").close();
  }

  // make the API call to do the analysis
  async function doAnalysis(e, setAiAnalysisSelected, afterClickAnalyse) {
    // get required fields
    const working = document.getElementById("working");
    const analyseButton = document.getElementById("analyse-button");
    const customPromptField = document.getElementById("prompt");
    const defaultPromptsField = document.getElementById("defaultLLMPrompt");

    setllmResponse("");
    analyseButton.disabled = true;
    working.style = "display:block";
    e.preventDefault();
    e.stopPropagation();

    let promptField = defaultPromptsField;

    if (customPromptField.value.length > 0) promptField = customPromptField;

    try {
      
      // call our backend server for the analysis
      const response = await getLLMResponseFromServer(promptField.value, dataSet);

      setllmResponse(response);
      working.style = "display:none";
      analyseButton.disabled = false;

    } catch (error) {
      // currently amount of data that can be passed is limited
      // need to implement this in a different way in the backend
      setllmResponse(
        "Too much data selected. Please select less data and try again. Version 2 will fix this issue."
      );
      working.style = "display:none";
      analyseButton.disabled = false;
    }

    setAiAnalysisSelected(true);
    afterClickAnalyse();
  }

  return (
    <div>
      <div>
        <form id="prompt-form" method="dialog">
          <label
            id="prompt-label"
            className="form-control text-primary-content"
          >

            <div className="label">
              <span className="text-primary-content">Using a default prompt:</span>
            </div>
            <SelectLLMPrompt
              id="defaultLLMPrompt"
              handleSelectChange={handleSelectChange}
            />
          </label>
          <label
            id="prompt-label"
            className="form-control text-primary-content"
          >
            <div className="label">
              <span className="text-primary-content">
                Write a custom prompt:
              </span>
            </div>
            <textarea
              id="prompt"
              className="textarea textarea-bordered h-24 text-primary-content shadow-lg bg-base-300"
              placeholder=""
              style={{ maxHeight: "40vh" }}
            ></textarea>
          </label>
        </form>

        <label id="response-label" className="form-control mb-5" style={{ display: "none" }}>
          <div className="label">
            <span className="text-primary-content">LLM Response</span>
          </div>
          <div
            className="shadow-lg overflow-scroll bg-base-300"
            style={{ minHeight: "30vh", maxHeight: "40vh" }}
          >
            <LLMResponse content={llmResponse} />
          </div>
        </label>
        <div className="text-center m-2" id="working" style={{ display: "none" }}>
          <LoadingSpinner />
        </div>

        <div></div>
        <div className="mb-4"></div>
        <ButtonMediumFullWide
          id="analyse-button"
          onClick={(e) => {
            doAnalysis(e, setAiAnalysisSelected, afterClickAnalyse);
            return false;
          }}
          textColor={"text-secondary-content"}
        >
          Analyse
        </ButtonMediumFullWide>
      </div>
    </div>
  );
};

export default AIAnalysis;
