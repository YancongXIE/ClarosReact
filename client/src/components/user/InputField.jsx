// Desc: InputField component for user form
const InputField = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  onBlur,
  hasError,
  errorMessage,
  options,
  onKeyDown,
  className,
  labelClassName,
  ariaLabel,
}) => {
  return (
    <div className="form-control">
      <label className={"label"}>
        <span className={`label-text ${labelClassName}`}>{label}</span>
      </label>
      {/* If type is select, render select field, else render input field */}
      {type === "select" ? (
        <select
          className={`input input-bordered ${className} text-black`}
          aria-label="Select Local Area"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {/* Map through options and render each option */}
          {options.map((option, index) => (
            <option key={index} value={option} aria-label={option} className="text-black">
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className={`input input-bordered ${className} text-black`}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          labelClassName={labelClassName}
          aria-label={ariaLabel}
        />
      )}
      {/* If hasError is true, render error message */}
      {hasError && <p className="pt-3 text-error">{errorMessage}</p>}
    </div>
  );
};

export default InputField;
