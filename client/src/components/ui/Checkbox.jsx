export default function Checkbox({ label, value, setValue }) {
  const handleChange = () => {
    setValue(!value);
  };

  return (
    <div className="grid grid-cols-[25px_1fr] mt-2">
      <div className="p-0">
        <input
          id={label}
          type="checkbox"
          checked={value}
          // className="checkbox checkbox-xl checkbox-primary m-0"
          className="appearance-none h-6 w-6 border border-primary rounded-md checked:before:content-['✓'] checked:bg-primary checked:text-secondary-content flex checked:items-center checked:justify-center"
          onChange={handleChange}
          aria-label={`Toggle ${value ? "on" : "off"} checkbox`}
        />
      </div>
      <div className="pl-2">
        <label className="whitespace-nowrap text-primary-content font-light">
          {label}
        </label>
      </div>
    </div>
  );
}

export function CheckboxCustomOnChange({ label, value, onChange }) {
  return (
    <div className="grid grid-cols-[25px_1fr] mt-2">
      <div className="p-0">
        <input
          id={label}
          type="checkbox"
          checked={value}
          // className="checkbox checkbox-xl checkbox-primary m-0"
          className="appearance-none h-6 w-6 border border-primary rounded-md checked:before:content-['✓'] checked:bg-primary checked:text-secondary-content flex checked:items-center checked:justify-center"
          onChange={onChange}
          aria-label={`Toggle ${value ? "on" : "off"} checkbox`}
        />
      </div>
      <div className="pl-2">
        <label className="whitespace-nowrap text-primary-content font-light">
          {label}
        </label>
      </div>
    </div>
  );
}
