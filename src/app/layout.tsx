import { Prompt } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import ProductProvider from "./components/ProductProvider";

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
        <ProductProvider>{children}</ProductProvider>
      </body>
    </html>
  );
}
