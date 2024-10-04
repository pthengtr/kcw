import SearchForm from "./SearchForm";

export default function ProductHeader() {
  return (
    <header className="flex justify-center p-4 bg-gradient-to-tl from-primary to-primary-foreground">
      <SearchForm />
    </header>
  );
}
