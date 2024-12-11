import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";
import { accountsType } from "../Transaction/TransactionProvider";

type AccountInfoProps = {
  account: accountsType;
};

export default function AccountInfo({ account }: AccountInfoProps) {
  return (
    <Popover>
      <PopoverTrigger>
        <MoreSVG />
      </PopoverTrigger>
      <PopoverContent className="grid grid-cols-[auto_auto] w-full max-w-[500px] gap-x-8 gap-y-2">
        <span className="text-gray-500">ชื่อ</span>
        <span>{account.ACCTNAME}</span>
        <span className="text-gray-500">ที่อยู่</span>
        <span>{`${account.ADDR1} ${account.ADDR2}`}</span>
        <span className="text-gray-500">โทรศัพท์</span>
        <span>{account.PHONE}</span>
        <span className="text-gray-500">เลขประจำตัวผู้เสียภาษี</span>
        <span>{account.MOBILE}</span>
        <span className="text-gray-500">แฟกซ์</span>
        <span>{account.FAX}</span>
        <span className="text-gray-500">ติดต่อ</span>
        <span>{account.CONTACT}</span>
        <span className="text-gray-500">อีเมล</span>
        <span>{account.EMAIL}</span>
        <span className="text-gray-500">เครดิต</span>
        <span>{account.TERM}</span>
        <span className="text-gray-500">วงเงิน</span>
        <span>{account.ALLOW}</span>
        <span className="text-gray-500">หมายเหตุ</span>
        <span>{account.REMARKS}</span>
      </PopoverContent>
    </Popover>
  );
}

function MoreSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="18px"
      viewBox="0 -960 960 960"
      width="18px"
      fill="currentcolor"
    >
      <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" />
    </svg>
  );
}
