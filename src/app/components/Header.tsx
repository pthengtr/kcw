import SearchForm from "./SearchForm";
import NavMenu from "./NavMenu";
import { auth } from "@/app/auth";
import SelectBranch from "./SelectBranch";

export default async function ProductHeader() {
  const session = await auth();
  const userName = session?.user?.name;

  const isAuthenticated = process.env.ALLOW_USER?.split(" ").includes(
    userName ? userName : ""
  );
  return (
    <header className="flex items-center justify-center p-4 bg-gradient-to-tl from-primary to-indigo-900 h-16">
      {isAuthenticated && (
        <>
          {/* empty element to keep SearchForm center */}
          <div className="flex-1">
            <SelectBranch />
          </div>
          <SearchForm />
          <div className="flex-1 flex justify-end">
            <NavMenu />
          </div>
        </>
      )}
    </header>
  );
}
