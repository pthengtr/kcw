"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContext } from "react";
import { SearchContext, SearchContextType } from "./SearchProvider";

export default function SelectBranch() {
  const { branch, setBranch } = useContext(SearchContext) as SearchContextType;
  return (
    <Select defaultValue={branch} onValueChange={setBranch}>
      <SelectTrigger className="w-fit bg-transparent text-white border-none focus:ring-0 focus:ring-transparent focus:ring-offset-0 font-semibold text-lg">
        <SelectValue placeholder="_1" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="_1">
          KCW เกียรติชัยอะไหล่ยนต์ (สำนักงานใหญ่)
        </SelectItem>
        <SelectItem value="_2">
          KCW เกียรติชัยอะไหล่ยนต์ (สาขาสี่แยกพัฒนา)
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
