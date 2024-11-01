"use client";
import React, { useState, useContext, useEffect } from "react";
import PosBill from "./PosBill";
import { PosContext, PosContextType } from "./PosProvider";
import { supabase } from "@/app/lib/supabase";

export default function PosPage() {
  const { handleClickAddToCart, returnMode } = useContext(
    PosContext
  ) as PosContextType;

  const [barcode, setBarcode] = useState("");

  useEffect(() => {
    function handleKeydownEvent(e: KeyboardEvent) {
      if (returnMode) return;

      if (e.code === "Space") setBarcode("");
      else if (e.code === "Enter" && barcode.length > 4) {
        handleSearchFromScan();
      } else if (e.code.includes("Shift")) return;
      else setBarcode((cur) => cur + e.code.slice(-1));
    }

    function handleSearchFromScan() {
      console.log(barcode);
      getItemSupabase(barcode);
      setBarcode("");
    }

    async function getItemSupabase(bcode: string) {
      const { data, error } = await supabase
        .from("products")
        .select(`*, prices(*), prices_m(*)`)
        .or(`BCODE.eq.${bcode}, MCODE.eq.${bcode}`)
        .limit(10);

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
