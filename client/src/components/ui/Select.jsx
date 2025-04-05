export function SelectLLMPrompt({ id, handleSelectChange }) {
  return (
    <select
      id={id}
      className="select select-bordered w-full text-primary-content shadow-lg bg-base-300"
      onChange={handleSelectChange}
    >
      <option disabled>Select one of these default prompts</option>
      <option>Please analyse the selected data</option>
      <option>Please compare the different LGAs in this data</option>
      <option>
        Which LGA is the best area for me to buy an investment property in?
      </option>
      <option>Please write a 150 word summary of the selected data</option>
      <option>
        Please highlight and explain any anomolies in the selected data
      </option>
      <option>
        Please write a 200 word newsletter article about the selected data
      </option>
    </select>
  );
}
