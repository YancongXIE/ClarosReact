export function SelectWithBorder({ onChange, value, children }) {
  return (
    <select
      className="select select-bordered w-full max-w-xs bg-base-300"
      onChange={onChange}
      value={value}
      aria-label="Select year"
    >
      {children}
    </select>
  );
}

export function SelectWithBorderSmall({ onChange, value, children }) {
  return (
    <select
      className="select select-bordered select-sm w-fit max-w-xs bg-base-300 text-primary-content"
      onChange={onChange}
      value={value}
      aria-label="Select year"
    >
      {children}
    </select>
  );
}
