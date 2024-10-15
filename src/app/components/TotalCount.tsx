type TransactionTotalCountProps = {
  totalCount: number;
  limit: string;
  setLimit: (limit: string) => void;
};

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TotalCount({
  totalCount,
  limit,
  setLimit,
}: TransactionTotalCountProps) {
  return (
    <div className="flex justify-end gap-2 items-center mt-auto p-2 ">
      <div className="flex">{`แสดงผลทั้งหมด ${
        totalCount <= parseInt(limit)
          ? totalCount.toLocaleString()
          : limit.toLocaleString()
      } จาก ${totalCount} รายการ`}</div>

      <DropdownMenu>
        <DropdownMenuTrigger className="px-2 py-1 rounded-md hover:bg-gray-100 focus:outline-none">
          <MoreSVG />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>เพิ่มจำนวนค้นหา</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={limit} onValueChange={setLimit}>
            <DropdownMenuRadioItem value="50">50</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="100">100</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="200">200</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="500">500</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function MoreSVG() {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="18px"
        fill="#5f6368"
      >
        <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" />
      </svg>
    </div>
  );
}
