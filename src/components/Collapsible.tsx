import React, { useState } from "react";

interface CollapsibleProps {
  children: React.ReactNode;
  label?: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export default function Collapsible({
  children,
  label,
  defaultOpen = false,
  className = "",
}: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`flex items-center ${className}`}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 p-1 rounded border border-gray-300 bg-white hover:bg-gray-100 transition"
      >
        <span
          className={`inline-block transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M8 6l4 4-4 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        </span>
        {label && <span>{label}</span>}
      </button>
      <div
        className="ml-4 flex-1 overflow-hidden transition-opacity duration-300"
        style={{
          opacity: open ? 1 : 0,
        }}
        aria-hidden={!open}
      >
        {children}
      </div>
    </div>
  );
}
