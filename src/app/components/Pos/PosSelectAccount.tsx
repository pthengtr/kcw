import { accountsType } from "../Transaction/TransactionProvider";
import { useContext } from "react";
import { PosContext, PosContextType } from "./PosProvider";
import SelectAcount from "../Common/SelectAccount";

export default function PosSelectAcount() {
  const { currentCustomer, setCurrentCustomer, setVat, setPayment } =
    useContext(PosContext) as PosContextType;

  function handleSelectCustomer(account: accountsType) {
    setCurrentCustomer(account);
    if (account.ACCTNO === "000" || account.ACCTNO === "7000") {
      setVat("novat");
      setPayment("CASH");
    }
  }

  return (
    <SelectAcount
      currentCustomer={currentCustomer}
      handleSelectCustomer={handleSelectCustomer}
    />
  );
}
