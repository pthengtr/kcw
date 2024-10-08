import TransactionSearchPage from "../components/TransactonSearchPage";
import TransactionProvider from "../components/TransactionProvider";

export default async function ProductLanding() {
  return (
    <TransactionProvider>
      <TransactionSearchPage />;
    </TransactionProvider>
  );
}
