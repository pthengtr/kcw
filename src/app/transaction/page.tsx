import TransactionSearchPage from "../components/Transaction/TransactonSearchPage";
import TransactionProvider from "../components/Transaction/TransactionProvider";

export default async function ProductLanding() {
  return (
    <TransactionProvider>
      <TransactionSearchPage />;
    </TransactionProvider>
  );
}
