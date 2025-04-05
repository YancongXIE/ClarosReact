export function TextInput() {
  return (
    <input
      type="text"
      placeholder="Type here"
      className="input input-bordered w-full max-w-xs"
    />
  );
}

export function SearchBar() {
  return (
    <label className="input input-bordered flex items-center gap-2">
      <input type="text" className="grow" placeholder="Search" />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="h-4 w-4 opacity-70"
      >
        <path
          fillRule="evenodd"
          d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
          clipRule="evenodd"
        />
      </svg>
    </label>
  );
}

export function SearchBarWithOptional() {
  return (
    <label className="input input-bordered flex items-center gap-2">
      <input type="text" className="grow" placeholder="Search" />
      <span className="badge badge-info">Optional</span>
    </label>
  );
}

export function TextInputXS() {
  return (
    <input
      type="text"
      placeholder="Type here"
      className="input input-bordered input-xs w-full max-w-xs"
    />
  );
}

export function TextInputSM() {
  return (
    <input
      type="text"
      placeholder="Type here"
      className="input input-bordered input-sm w-full max-w-xs"
    />
  );
}

export function TextInputMD() {
  return (
    <input
      type="text"
      placeholder="Type here"
      className="input input-bordered input-md w-full max-w-xs"
    />
  );
}

export function TextInputLG() {
  return (
    <input
      type="text"
      placeholder="Type here"
      className="input input-bordered input-lg w-full max-w-xs"
    />
  );
}

// others, like ghost or disabled available: https://daisyui.com/components/input/
