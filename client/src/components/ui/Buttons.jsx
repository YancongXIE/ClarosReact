export function ButtonSmallPrimary({ children, onClick }) {
  return (
    <button
      className="btn btn-sm btn-primary text-primary-content"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function ButtonSmallSecondary({ children, onClick }) {
  return (
    <button
      className="btn btn-sm btn-primary text-secondary-content"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function ButtonMedium({ children }) {
  return (
    <button className="btn btn-md btn-primary text-primary-content">
      {children}
    </button>
  );
}

export function ButtonOutline({ children, onClick, id, disabled, className }) {
  return (
    <button
      className={`btn btn-sm btn-outline border-primary text-primary-content hover:text-secondary-content hover:bg-primary hover:outline-none active:text-secondary-content ${className}`}
      id={id}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function ButtonSmallWide({ children }) {
  return (
    <button className="btn btn-sm btn-primary btn-wide">{children}</button>
  );
}

export function ButtonMediumWide({ children, onClick, disabled }) {
  return (
    <button
      className={`btn btn-md btn-primary btn-wide ${
        disabled
          ? "!bg-primary opacity-60 text-primary-content !text-opacity-100 cursor-not-allowed"
          : "text-primary-content"
      }`}
      onClick={onClick}
      disabled={disabled}
      tabIndex={disabled ? "-1" : "0"}
      role="button"
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
}

export function DeleteButton({ onClick, children }) {
  return (
    <button
      className="btn btn-wide bg-red-700 hover:bg-red-800 text-white"
      onClick={onClick}
      aria-label="Delete"
    >
      {children}
    </button>
  );
}

export function ButtonMediumFullWide({
  children,
  onClick,
  id,
  textColor = "text-primary-content",
  disabled,
}) {
  return (
    <button
      id={id}
      className={`btn btn-md btn-primary btn-wide w-full ${textColor}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function ButtonOutlineFullWide({ children, onClick, id }) {
  return (
    <button
      id={id}
      className="btn btn-md btn-outline btn-wide w-full"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function ButtonOpenAIAnalysisModal({ onClick }) {
  return (
    <button onClick={onClick} aria-label="Open AI Analysis Modal">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-8 text-primary-content hover:text-primary cursor-pointer"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z"
        />
      </svg>
    </button>
  );
}

export function ButtonDownloadReport({
  onClick,
  id,
  textColor = "text-primary-content",
}) {
  return (
    <button onClick={onClick} aria-label="Download Report">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-8 text-primary-content hover:text-primary cursor-pointer"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v1.125C3 18.496 3.504 19 
    4.125 19h15.75c.621 0 1.125-.504 
    1.125-1.125V16.5M7.5 10.5l4.5 
    4.5m0 0l4.5-4.5m-4.5 4.5V3"
        />
      </svg>
    </button>
  );
}

export function CloseButton({ onClick }) {
  return (
    <button className="" onClick={onClick} aria-label="Close Popup AI modal">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6 text-primary-content"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18 18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
}
