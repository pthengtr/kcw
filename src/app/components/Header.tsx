import SearchForm from "./SearchForm";
import NavMenu from "./NavMenu";

export default function ProductHeader() {
  return (
    <header className="flex justify-center p-4 bg-gradient-to-tl from-primary to-indigo-900">
      {/* empty element to keep SearchForm center */}
      <div className="flex-1"></div>
      <SearchForm />
      <div className="flex-1 flex justify-end">
        <NavMenu />
      </div>
    </header>
  );
}
