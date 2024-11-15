import TransactionSearchPage from "../components/Transaction/TransactonSearchPage";
import TransactionProvider from "../components/Transaction/TransactionProvider";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

export default async function ProductLanding() {
  const session = await auth();
  const userName = session?.user?.name;

  if (!process.env.ALLOW_USER?.split(" ").includes(userName ? userName : "")) {
    return redirect("/");
  }

  return (
    <TransactionProvider>
      <TransactionSearchPage />;
    </TransactionProvider>
  );
}
