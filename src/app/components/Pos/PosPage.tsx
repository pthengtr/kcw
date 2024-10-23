"use client";
import React, { useState, useContext, useEffect } from "react";
import PosBill from "./PosBill";
import { PosContext, PosContextType } from "./PosProvider";
import { supabase } from "@/app/lib/supabase";

export default function PosPage() {
  const { handleClickAddToCart } = useContext(PosContext) as PosContextType;

  const [barcode, setBarcode] = useState("");

  useEffect(() => {
    function handleKeydownEvent(e: KeyboardEvent) {
      console.log(e);
      if (e.key === " ") setBarcode("");
      else if (e.key === "Enter") handleSearchFromScan();
      else setBarcode((cur) => cur + e.key);
    }

    function handleSearchFromScan() {
      console.log(barcode);
      getItemSupabase(barcode);
      setBarcode("");
    }

    async function getItemSupabase(bcode: string) {
      const { data, error } = await supabase
        .from("products")
        .select(`*`)
        .eq("BCODE", bcode)
        .limit(10);

      console.log(data);
      if (error) return;
      if (data !== null && data.length > 0) handleClickAddToCart(data[0]);
    }

    window.addEventListener("keydown", handleKeydownEvent);

    return () => {
      window.removeEventListener("keydown", handleKeydownEvent);
    };
  }, [barcode, handleClickAddToCart]);

  return (
    <main className="h-[90%] flex mx-auto ">
      <PosBill />
    </main>
  );
}
