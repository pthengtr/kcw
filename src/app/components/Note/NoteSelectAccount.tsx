import { accountsType } from "../Transaction/TransactionProvider";
import { useContext } from "react";
import SelectAcount from "../Common/SelectAccount";
import { NoteContext, NoteContextType } from "./NoteProvider";

export default function NoteSelectAcount() {
  const { currentAccount, setCurrentAccount } = useContext(
    NoteContext
  ) as NoteContextType;

  function handleSelectCustomer(value: accountsType) {
    setCurrentAccount(value);
  }

  return (
    <SelectAcount
      currentCustomer={currentAccount}
      handleSelectCustomer={handleSelectCustomer}
    />
  );
}
