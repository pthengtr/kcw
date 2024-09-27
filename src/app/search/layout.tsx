import React from "react";
import ProductProvider from "../components/ProductProvider";

type SearchLayoutProps = {
  children: React.ReactNode;
};

export default function SearchLayout({ children }: SearchLayoutProps) {
  return <ProductProvider>{children}</ProductProvider>;
}
