import React, { useEffect, useContext, useState } from "react";
import { supabase } from "../lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TransactionContext,
  TransactionContextType,
} from "./TransactionProvider";

import { ItemDetailType, SpanValue } from "./ProductDetail";
import { SearchContext, SearchContextType } from "./SearchProvider";
import { th } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type salesInfoType = {
  BILLNO: string;
  JOURDATE: Date;
  BILLDATE: string;
  DEDUCT: string;
  BEFORETAX: string;
  VAT: string;
  AFTERTAX: string;
  CASHAMT: string;
  CHKAMT: string;
  DUEAMT: string;
  customerId: number;
  // to remove
  ACCTNO: string;
  customer: customerType;
  salesItems: salesItemType;
};

export type salesItemType = {
  BILLNO: string;
  JOURDATE: string;
  BCODE: string;
  QTY: string;
  UI: string;
  MTP: string;
  DISCNT1: string;
  DISCNT2: string;
  DISCNT3: string;
  DISCNT4: string;
  PRICE: string;
  AMOUNT: string;
  customer: customerType;
  productInfo: ItemDetailType;
};

export type customerType = {
  ACCTNO: string;
  ACCTNAME: string;
  TERM: string;
  ALLOW: string;
  REMARKS: string;
  customerId: number;
  contact: { Attribute: string; Value: string }[];
};

type TransactionCustomerBillsProps = {
  customerId: string;
  customerBillNo: string;
};

function createLastYearDate() {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  return date;
}

export default function TransactionCustomerBills({
  customerId,
  customerBillNo,
}: TransactionCustomerBillsProps) {
  const [customerBills, setCustomerBills] = useState<salesInfoType[]>();
  const [customer, setCustomer] = useState<customerType>();
  const { billNo, setBillNo } = useContext(
    TransactionContext
  ) as TransactionContextType;

  const [filterText, setFilterText] = useState("");
  const [fromDate, setFromDate] = useState<Date | undefined>(
    createLastYearDate()
  );
  const [toDate, setToDate] = useState<Date | undefined>(new Date());

  const { searchKey } = useContext(SearchContext) as SearchContextType;

  const isCustomer = searchKey === "customer" || searchKey === "salesInfo";
  const searchTableBill = isCustomer ? "salesInfo" : "billInfo";
  const searchTableContact = isCustomer ? "customer" : "supplier";
  const searchId = isCustomer ? "customerId" : "supplierId";

  function handleClickBill(billno: string) {
    setBillNo(billno);
  }

  useEffect(() => {
    async function getBillSupabase() {
      const { data, error } = await supabase
        .from(searchTableBill)
        .select(`*`)
        .eq(searchId, customerId.normalize())
        .order("JOURDATE", { ascending: false })
        .limit(100);

      if (error) return;
      if (data !== null) setCustomerBills(data);
    }

    async function getCustomersSupabase() {
      const { data, error } = await supabase
        .from(searchTableContact)
        .select(`*, contact:${searchTableContact}Contact(*)`)
        .eq(searchId, customerId)
        .limit(10);

      if (error) return;
      if (data !== null) setCustomer(data[0]);
    }

    if (customerId !== "") {
      getBillSupabase();
      getCustomersSupabase();
      if (customerBillNo !== "") {
        setBillNo(customerBillNo);
      } else {
        setBillNo("");
      }
    } else {
      setCustomerBills(undefined);
    }
  }, [
    customerId,
    customerBillNo,
    searchId,
    searchTableBill,
    searchTableContact,
    setBillNo,
  ]);

  return (
    <div className="p-8 w-full h-fit overflow-auto">
      {customerBills && (
        <div className="flex flex-col gap-6 h-full overflow-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row gap-4 items-center">
                <SpanValue
                  className={`p-1 text-white ${
                    isCustomer ? "bg-primary" : "bg-secondary"
                  }`}
                >
                  {customer?.ACCTNO}
                </SpanValue>
                <span>{customer && customer.ACCTNAME}</span>
              </CardTitle>
            </CardHeader>
            {/* <CardContent className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1">
              {customer &&
                customer.contact.map((contact) => (
                  <React.Fragment key={contact.Attribute}>
                    <SpanName>{contact.Attribute}</SpanName>
                    <SpanValue className="text-wrap">{contact.Value}</SpanValue>
                  </React.Fragment>
                ))}
              <div className="grid grid-cols-2 col-span-2 mt-2">
                {customer?.ALLOW && (
                  <div className="flex flex-1 gap-2">
                    <SpanName>วงเงิน</SpanName>
                    <SpanValue className="text-wrap">
                      {customer?.ALLOW}
                    </SpanValue>
                  </div>
                )}
                {customer?.TERM && (
                  <div className="flex flex-1 gap-2">
                    <SpanName>เครดิต (วัน)</SpanName>
                    <SpanValue className="text-wrap">
                      {customer?.TERM}
                    </SpanValue>
                  </div>
                )}
              </div>
            </CardContent> */}
          </Card>

          <Card>
            <CardContent className="flex gap-4 p-6 items-center">
              <div className="flex gap-4 w-full items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#5f6368"
                >
                  <path d="M440-160q-17 0-28.5-11.5T400-200v-240L168-736q-15-20-4.5-42t36.5-22h560q26 0 36.5 22t-4.5 42L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-308 198-252H282l198 252Zm0 0Z" />
                </svg>
                <Input
                  className="roundeก-md flex-1"
                  type="text"
                  placeholder="กรองผลการค้นหา..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                ></Input>
              </div>

              <div className="flex gap-4 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#5f6368"
                >
                  <path d="M600-80v-80h160v-400H200v160h-80v-320q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H600ZM320 0l-56-56 103-104H40v-80h327L264-344l56-56 200 200L320 0ZM200-640h560v-80H200v80Zm0 0v-80 80Z" />
                </svg>

                <Popover>
                  <PopoverTrigger className="bg-gray-200 px-4 py-2 w-32 rounded-md">
                    {fromDate ? (
                      fromDate.toLocaleDateString("th-TH")
                    ) : (
                      <span>เลือกวันที่...</span>
                    )}
                  </PopoverTrigger>
                  <PopoverContent className="bg-white z-10 shadow-lg rounded-md">
                    <Calendar
                      mode="single"
                      locale={th}
                      selected={fromDate}
                      onSelect={setFromDate}
                      formatters={{
                        formatCaption: (date) =>
                          date.toLocaleDateString("th-TH", {
                            month: "long",
                            year: "numeric",
                          }),
                      }}
                      classNames={{
                        day_selected:
                          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#5f6368"
                >
                  <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z" />
                </svg>
                <Popover>
                  <PopoverTrigger className="bg-gray-200 px-4 py-2 w-32 rounded-md">
                    {toDate ? (
                      toDate.toLocaleDateString("th-TH")
                    ) : (
                      <span>เลือกวันที่...</span>
                    )}
                  </PopoverTrigger>
                  <PopoverContent className="bg-white z-10 shadow-lg rounded-md">
                    <Calendar
                      mode="single"
                      locale={th}
                      selected={toDate}
                      onSelect={setToDate}
                      formatters={{
                        formatCaption: (date) =>
                          date.toLocaleDateString("th-TH", {
                            month: "long",
                            year: "numeric",
                          }),
                      }}
                      toYear={toDate?.getFullYear()}
                      toMonth={toDate}
                      toDate={toDate}
                      classNames={{
                        day_selected:
                          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>

          <div className="overflow-auto h-[500px] w-full">
            <Table>
              <TableHeader className="sticky top-0 bg-white">
                <TableRow className="w-full">
                  <TableHead>วันที่</TableHead>
                  <TableHead>เลขที่บิล</TableHead>
                  <TableHead>ยอดรวม</TableHead>
                  <TableHead>ค้าง</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>ใบสำคัญรับ-จ่าย</TableHead>
                  <TableHead>วันที่ใบสำคัญ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerBills.map((item, index) => (
                  <TableRow
                    onClick={() => handleClickBill(item.BILLNO)}
                    key={`${item.BILLNO}-${index}`}
                    className={`w-full ${
                      billNo === item.BILLNO
                        ? "bg-primary text-white hover:bg-primary"
                        : ""
                    }`}
                  >
                    <TableCell>
                      {new Date(item.JOURDATE).toLocaleDateString("th-TH")}
                    </TableCell>
                    <TableCell>{item.BILLNO}</TableCell>
                    <TableCell>
                      {(
                        parseFloat(item.CASHAMT) +
                        parseFloat(item.CHKAMT) +
                        parseFloat(item.DUEAMT)
                      ).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {parseFloat(item.DUEAMT).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {parseFloat(item.DUEAMT) !== 0 ? "ค้างชำระ" : "จ่ายแล้ว"}
                    </TableCell>
                    <TableCell>XXX-XXXX</TableCell>
                    <TableCell>XX/XX/XX</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
