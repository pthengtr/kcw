import React from "react";

type PaginationNextProps = {
  handleNextPage: () => void;
};

export default function PaginationNext({
  handleNextPage,
}: PaginationNextProps) {
  return (
    <button
      onClick={handleNextPage}
      className="hover:bg-gray-100 p-3 rounded-md flex gap-2 items-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m8.25 4.5 7.5 7.5-7.5 7.5"
        />
      </svg>
    </button>
  );
}
