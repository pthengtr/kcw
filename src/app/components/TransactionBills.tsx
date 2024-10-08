import React, { useEffect, useContext, useState } from "react";
import { supabase } from "../lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TransactionContext,
  TransactionContextType,
} from "./TransactionProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ItemDetailType, SpanName, SpanValue } from "./ProductDetail";
import { SearchContext, SearchContextType } from "./SearchProvider";

export type salesInfoType = {
  BILLNO: string;
  JOURDATE: string;
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

export default function TransactionCustomerBills({
  customerId,
  customerBillNo,
}: TransactionCustomerBillsProps) {
  const [customerBills, setCustomerBills] = useState<salesInfoType[]>();
  const [customer, setCustomer] = useState<customerType>();
  const { billNo, setBillNo } = useContext(
    TransactionContext
  ) as TransactionContextType;

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
    <div className="p-8 w-full h-full overflow-auto">
      {customerBills && (
        <div className="flex flex-col gap-6 h-full">
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
            <CardContent className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1">
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
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <Table className="max-h-96 overflow-auto relative block">
                <TableHeader className="sticky top-0 bg-white">
                  <TableRow>
                    <TableHead>เลขที่บิล</TableHead>
                    <TableHead>วันที่</TableHead>
                    <TableHead>ราคา</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerBills.map((item, index) => (
                    <TableRow
                      onClick={() => handleClickBill(item.BILLNO)}
                      key={`${item.BILLNO}-${index}`}
                      className={`${
                        billNo === item.BILLNO
                          ? "bg-primary text-white hover:bg-primary"
                          : ""
                      }`}
                    >
                      <TableCell>{item.BILLNO}</TableCell>
                      <TableCell>{item.JOURDATE}</TableCell>
                      <TableCell>{item.AFTERTAX}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
