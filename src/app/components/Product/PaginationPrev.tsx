import React from "react";
type PaginationPrevProps = {
  handlePrevPage: () => void;
};

export default function PaginationPrev({
  handlePrevPage,
}: PaginationPrevProps) {
  return (
    <button
      onClick={handlePrevPage}
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
          d="M15.75 19.5 8.25 12l7.5-7.5"
        />
      </svg>
      {/* <span>ก่อนหน้า</span> */}
    </button>
  );
}
