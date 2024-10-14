type TransactionTotalCountProps = {
  totalCount: number;
  maxSearch: number;
};

export default function TransactionTotalCount({
  totalCount,
  maxSearch,
}: TransactionTotalCountProps) {
  return (
    <div className="p-2 mt-auto flex justify-end mr-4">{`แสดงผลท้ั้งหมด ${
      totalCount <= maxSearch
        ? totalCount.toLocaleString()
        : maxSearch.toLocaleString()
    } จาก ${totalCount} รายการ`}</div>
  );
}
