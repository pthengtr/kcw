import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/app/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useEffect, useState } from "react";
import { billType, itemsType } from "../Transaction/TransactionProvider";
import TransactionBillsItemList from "../Transaction/TransactionBillsItemList";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

type paymentFilterType = {
  filterText: string;
  cash: boolean;
  transfer: boolean;
  check: boolean;
  credit: boolean;
};

const initialPaymentFilter = {
  filterText: "",
  cash: true,
  transfer: true,
  check: true,
  credit: true,
};

export default function PosRecentBillSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [billDate, setBillDate] = useState(new Date());
  const [paymentFilter, setPaymentFilter] =
    useState<paymentFilterType>(initialPaymentFilter);
  const [posCurrentRecentBill, setCurrentRecentBill] = useState<
    billType | undefined
  >();
  const [posRecentBills, setPosRecentBills] = useState<
    billType[] | undefined
  >();
  const [posFilterRecentBills, setPosFilterRecentBills] = useState<
    billType[] | undefined
  >();
  const [posRecentBillItems, setPosRecentBillItems] = useState<
    itemsType[] | undefined
  >();

  useEffect(() => {
    async function getBillsSupabase() {
      const { data, error } = await supabase
        .from("bills")
        .select(`*, vouchers(*), notes(*), accounts(*), bill_payment(*)`, {
          count: "exact",
        })
        .ilike("BILLTYPE", `1S%`)
        .order("JOURDATE", { ascending: false })
        .lte(
          "JOURDATE",
          new Date(
            `${billDate.getUTCFullYear()}-${billDate.getUTCMonth() + 1}-${
              billDate.getUTCDate() + 1
            } 23:59:59`
          ).toLocaleString("en-US")
        )
        .gte(
          "JOURDATE",
          new Date(
            `${billDate.getUTCFullYear()}-${billDate.getUTCMonth() + 1}-${
              billDate.getUTCDate() + 1
            } 00:00:00`
          ).toLocaleString("en-US")
        )
        .limit(500);

      console.log("rerender");
      if (error) return;
      if (data !== null) {
        setPosRecentBills(data);
        filterRecentBills(initialPaymentFilter, data);
      }
    }

    if (isOpen) getBillsSupabase();
  }, [isOpen, billDate, setPosRecentBills, setPosFilterRecentBills]);

  async function getBillItemsSupabase(billId: string) {
    const { data, error } = await supabase
      .from("items")
      .select(`*, bills(*), products(*)`, { count: "exact" })
      .eq("billId", billId)
      .order("JOURDATE", { ascending: false })
      .limit(50);

    if (error) return;
    if (data !== null) setPosRecentBillItems(data);
  }

  function handleClickRecentBill(bill: billType) {
    getBillItemsSupabase(bill.billId.toString());
    setCurrentRecentBill(bill);
  }

  function handleSheetOpen(open: boolean) {
    setIsOpen(open);
    if (open) {
      setBillDate(new Date());
      setCurrentRecentBill(undefined);
      setPosRecentBillItems(undefined);
    }
  }

  function handleFilterChange(filter: paymentFilterType) {
    setPaymentFilter(filter);

    if (!!posRecentBills) {
      filterRecentBills(filter, posRecentBills);
    }
  }

  function filterRecentBills(filter: paymentFilterType, bills: billType[]) {
    //Filter payment type
    let newPosRecentBills = bills.filter(
      (bill) =>
        bill.bill_payment.filter(
          (payment) =>
            (filter.cash && payment.PAYTYPE === "CASH") ||
            (filter.transfer && payment.PAYTYPE === "TRANSFER") ||
            (filter.check && payment.PAYTYPE === "CHECK") ||
            (filter.credit && payment.PAYTYPE === "VOUCHER")
        ).length != 0
    );

    newPosRecentBills = filter.credit
      ? [
          ...newPosRecentBills,
          ...bills.filter(
            (bill) =>
              bill.bill_payment.reduce(
                (acc, payment) => acc - payment.AMOUNT,
                bill.AFTERTAX
              ) !== 0 || bill.bill_payment.length === 0
          ),
        ]
      : newPosRecentBills;

    newPosRecentBills =
      filter.filterText !== ""
        ? newPosRecentBills.filter(
            (bill) =>
              bill.BILLNO.includes(filter.filterText) ||
              bill.accounts?.ACCTNAME.includes(filter.filterText) ||
              bill.accounts?.ACCTNO.includes(filter.filterText)
          )
        : newPosRecentBills;

    setPosFilterRecentBills(newPosRecentBills);
  }

  function getSumPaytype(paytype: string) {
    return _getSumPaytype(paytype)?.toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function _getSumPaytype(paytype: string) {
    if (!posRecentBills) return;

    if (paytype === "CREDIT") {
      return posRecentBills.reduce(
        (acc, bill) =>
          acc +
          bill.bill_payment.reduce(
            (acc, payment) =>
              payment.PAYTYPE !== "VOUCHER" ? acc - payment.AMOUNT : acc,
            bill.AFTERTAX
          ),
        0
      );
    } else {
      const paytypeBills = posRecentBills.filter(
        (bill) =>
          bill.bill_payment.filter((payment) => payment.PAYTYPE === paytype)
            .length != 0
      );
      return paytypeBills.reduce(
        (acc, bill) =>
          acc +
          bill.bill_payment.reduce((acc, payment) => acc + payment.AMOUNT, 0),
        0
      );
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleSheetOpen}>
      <SheetTrigger className="w-full">ดูประวัติบิลขาย</SheetTrigger>
      <SheetContent className="sm:max-w-full grid grid-cols-2">
        {posFilterRecentBills && (
          <div className="h-full overflow-auto flex flex-col gap-4">
            {/* Filter section */}
            <div className="flex gap-6 items-center justify-center">
              <Input
                value={paymentFilter.filterText}
                onChange={(e) =>
                  handleFilterChange({
                    ...paymentFilter,
                    filterText: e.target.value,
                  })
                }
                className="w-36 focus-visible:ring-transparent"
              />
              <div className="flex gap-2 items-center">
                <Checkbox
                  className="data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                  checked={paymentFilter.cash}
                  onCheckedChange={() =>
                    handleFilterChange({
                      ...paymentFilter,
                      cash: !paymentFilter.cash,
                    })
                  }
                  id="cash"
                />
                <label htmlFor="cash">เงินสด</label>
              </div>
              <div className="flex gap-2 items-center">
                <Checkbox
                  className="data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                  checked={paymentFilter.transfer}
                  onCheckedChange={() =>
                    handleFilterChange({
                      ...paymentFilter,
                      transfer: !paymentFilter.transfer,
                    })
                  }
                  id="transfer"
                />
                <label htmlFor="transfer">โอน</label>
              </div>
              <div className="flex gap-2 items-center">
                <Checkbox
                  className="data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                  checked={paymentFilter.credit}
                  onCheckedChange={() =>
                    handleFilterChange({
                      ...paymentFilter,
                      credit: !paymentFilter.credit,
                    })
                  }
                  id="credit"
                />
                <label htmlFor="check">ลงบัญชี</label>
              </div>
              <div className="flex gap-2 items-center">
                <Checkbox
                  className="data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                  checked={paymentFilter.check}
                  onCheckedChange={() =>
                    handleFilterChange({
                      ...paymentFilter,
                      check: !paymentFilter.check,
                    })
                  }
                  id="check"
                />
                <label htmlFor="check">เช็ค</label>
              </div>

              <Popover>
                <PopoverTrigger className="bg-gray-100 py-1 px-2 rounded-md hover:bg-gray-200">
                  {billDate.toLocaleDateString("th-TH")}
                </PopoverTrigger>
                <PopoverContent className="pointer-events-auto">
                  <Calendar
                    mode="single"
                    selected={billDate}
                    onDayClick={setBillDate}
                    defaultMonth={billDate}
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
            </div>
            {/* Table section */}
            <div className="h-[70vh] relative overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white">
                  <TableRow>
                    <TableHead>วันที่</TableHead>
                    <TableHead>เวลา</TableHead>
                    <TableHead>เลขที่บิล</TableHead>
                    <TableHead>เลขที่ใบสำคัญ</TableHead>
                    <TableHead>ชื่อลูกค้า</TableHead>
                    <TableHead>ยอดรวม</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posFilterRecentBills.map((bill) => (
                    <TableRow
                      key={bill.billId}
                      className={`${
                        posCurrentRecentBill?.billId === bill.billId
                          ? "bg-primary text-white hover:bg-primary"
                          : ""
                      }`}
                      onClick={() => handleClickRecentBill(bill)}
                    >
                      <TableCell>
                        {new Date(bill.JOURDATE).toLocaleDateString("th-TH")}
                      </TableCell>
                      <TableCell>
                        {new Date(bill.JOURDATE).toLocaleTimeString("th-TH")}
                      </TableCell>
                      <TableCell>{bill.BILLNO}</TableCell>
                      <TableCell>{bill.vouchers?.VOUCNO}</TableCell>
                      <TableCell className="w-48">
                        {bill.accounts?.ACCTNAME}
                      </TableCell>
                      <TableCell className="text-right">
                        {bill.AFTERTAX.toLocaleString("th-TH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* Summary section */}
            <div className="flex gap-4 justify-end mx-4">
              <div className="grid grid-cols-[auto_auto] gap-x-4 gap-y-2 p-4 w-fit border rounded-md h-fit">
                <span>รายการบิลที่แสดง</span>
                <span className="font-semibold text-right">
                  {posFilterRecentBills?.length}
                </span>
                <span>รายการบิลทั้งหมด</span>
                <span className="font-semibold text-right">
                  {posRecentBills?.length}
                </span>
              </div>
              <div className="grid grid-cols-[auto_auto] gap-x-4 gap-y-2 p-4 w-fit border rounded-md h-fit">
                {_getSumPaytype("CASH") !== 0 && (
                  <>
                    <span>เงินสด</span>
                    <span className="font-semibold text-right">
                      {getSumPaytype("CASH")}
                    </span>
                  </>
                )}

                {_getSumPaytype("TRANSFER") !== 0 && (
                  <>
                    <span>โอน</span>
                    <span className="font-semibold text-right">
                      {getSumPaytype("TRANSFER")}
                    </span>
                  </>
                )}

                {_getSumPaytype("CHECK") !== 0 && (
                  <>
                    <span>เช็ค</span>
                    <span className="font-semibold text-right">
                      {getSumPaytype("CHECK")}
                    </span>
                  </>
                )}

                {_getSumPaytype("CREDIT") !== 0 && (
                  <>
                    <span>ลงบัญชี</span>
                    <span className="font-semibold text-right">
                      {getSumPaytype("CREDIT")}
                    </span>
                  </>
                )}
                <Separator className="col-span-2" />
                <span>ยอดขาย</span>
                <span className="font-semibold text-right">
                  {posRecentBills
                    ?.reduce((acc, bill) => acc + bill.AFTERTAX, 0)
                    .toLocaleString("th-TH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                </span>
              </div>
            </div>
          </div>
        )}

        {!!posRecentBillItems && (
          <div className="h-[90vh]">
            <TransactionBillsItemList
              currentBillItems={posRecentBillItems}
              currentBill={posCurrentRecentBill}
            />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
