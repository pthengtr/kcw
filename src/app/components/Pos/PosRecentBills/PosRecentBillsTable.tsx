import { billType } from "../../Transaction/TransactionProvider";
import BillsTable from "../../Common/BillsTable";

type PosRecentBillsTableProps = {
  posFilterRecentBills: billType[];
  posCurrentRecentBill: billType | undefined;
  handleClickRecentBill: (bill: billType) => void;
};

export default function PosRecentBillsTable({
  posFilterRecentBills,
  posCurrentRecentBill,
  handleClickRecentBill,
}: PosRecentBillsTableProps) {
  return (
    <div className="h-[70vh] relative overflow-auto">
      <BillsTable
        bills={posFilterRecentBills}
        currentBill={posCurrentRecentBill}
        handleClickBill={handleClickRecentBill}
      />
    </div>
  );
}
