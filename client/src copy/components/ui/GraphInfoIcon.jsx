import { useState } from "react";

export default function GraphInfoIcon({ info }) {
  const [onHoverContent, setOnHoverContent] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setOnHoverContent(true)}
      onMouseLeave={() => setOnHoverContent(false)}
    >
      {/* Info Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 text-primary-content cursor-pointer"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0Zm-9-3.75h.008v.008H12V8.25Z"
        />
      </svg>

      {/* Tooltip */}
      {onHoverContent && (
        <div className="absolute right-0 top-0 mt-[-100px] p-2 bg-info text-secondary-content text-sm rounded shadow-md z-10 min-w-[150px] max-w-xs whitespace-normal">
          {info}
        </div>
      )}
    </div>
  );
}
