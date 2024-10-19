import { Prompt } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import ProductProvider from "./components/Product/ProductProvider";
import SearchProvider from "./components/SearchProvider";
import Header from "./components/Header";
import AuthProvider from "./components/AuthProvider";

const prompt = Prompt({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KCW",
  description: "KCW Autoparts 2007",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${prompt.className} antialiased h-full`}>
        <AuthProvider>
          <ProductProvider>
            <SearchProvider>
              <div className="flex flex-col gap-2 h-full">
                <Header />
                {children}
              </div>
            </SearchProvider>
          </ProductProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
