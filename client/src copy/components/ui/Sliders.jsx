import { addDaysToDate, daysBetweenDates } from "../../api/utils/utils";

export function NumberSliderMedium({ min, max, title, value, setValue }) {
  const handleNumberValueChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        className="range"
        onChange={handleNumberValueChange}
      />
      <div>
        {title}: {value}
      </div>
    </div>
  );
}

export function DateSliderMedium({
  originDate,
  min,
  max,
  title,
  value,
  setValue,
}) {
  const handleDateValueChange = (event) => {
    setValue(addDaysToDate(originDate, event.target.value));
    //setValue(event.target.value);
  };

  return (
    <div>
      <input
        type="range"
        min={min}
        max={max}
        value={daysBetweenDates(originDate, value)}
        className="range"
        onChange={handleDateValueChange}
      />
      <div>
        {title}: {value}{" "}
      </div>
    </div>
  );
}
