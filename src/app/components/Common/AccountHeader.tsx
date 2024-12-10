import { accountsType } from "../Transaction/TransactionProvider";

type AccountHeaderProps = {
  currentAccount: accountsType;
};

export default function AccountHeader({ currentAccount }: AccountHeaderProps) {
  return (
    <div className="flex gap-2">
      <span
        className={`${
          currentAccount.ACCTTYPE === "S" ? "bg-green-800" : "bg-red-800"
        } rounded-sm text-white px-1`}
      >
        {currentAccount.ACCTNO}
      </span>
      <span>{currentAccount.ACCTNAME}</span>
    </div>
  );
}
