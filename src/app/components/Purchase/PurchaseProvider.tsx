"use client";
import { createContext, useContext, useState } from "react";
import React from "react";
import { PosContext, PosContextType } from "../Pos/PosProvider";
import { posItemsType } from "../Pos/PosProvider";

export type PurchaseContextType = {
  purchaseBillNo: string;
  setPurchaseBillNo: (billno: string) => void;
  purchaseBillDate: Date;
  setPurchaseBillDate: (billdate: Date) => void;
  getItemAmount: (item: posItemsType) => string;
  getItemAmountBeforeVat: (item: posItemsType) => string;
  getTotalFullCostBeforeVat: () => string;
  getTotalCostBeforeVat: () => string;
  getTotalCostAfterVat: () => string;
  getTotalDiscount: () => string;
  getTotalTax: () => string;
};

export const PurchaseContext = createContext<PurchaseContextType | null>(null);

type PurchaseProviderProps = {
  children: React.ReactNode;
};

export default function PurchaseProvider({ children }: PurchaseProviderProps) {
  const [purchaseBillNo, setPurchaseBillNo] = useState("");
  const [purchaseBillDate, setPurchaseBillDate] = useState(new Date());

  const { posItems } = useContext(PosContext) as PosContextType;

  function getTotalDiscount() {
    return (
      _getTotalFullCostBeforeVat() - _getTotalCostBeforeVat()
    ).toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function getTotalTax() {
    return (_getTotalCostAfterVat() - _getTotalCostBeforeVat()).toLocaleString(
      "th-TH",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  }

  function _getItemFullAmountBeforeVat(item: posItemsType) {
    return (item.cost / 1.07) * item.QTY;
  }

  function _getTotalCostAfterVat() {
    return !!posItems
      ? posItems.reduce((acc, posItem) => _getItemAmount(posItem) + acc, 0)
      : 0;
  }

  function getTotalCostAfterVat() {
    return _getTotalCostAfterVat().toLocaleString("th-TH", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  }

  function _getTotalFullCostBeforeVat() {
    return !!posItems
      ? posItems.reduce(
          (acc, posItem) => _getItemFullAmountBeforeVat(posItem) + acc,
          0
        )
      : 0;
  }

  function getTotalFullCostBeforeVat() {
    return _getTotalFullCostBeforeVat().toLocaleString("th-TH", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  }

  function _getTotalCostBeforeVat() {
    return !!posItems
      ? posItems.reduce(
          (acc, posItem) => _getItemAmountBeforeVat(posItem) + acc,
          0
        )
      : 0;
  }

  function getTotalCostBeforeVat() {
    return _getTotalCostBeforeVat().toLocaleString("th-TH", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  }

  function _getItemAmount(item: posItemsType) {
    return (
      item.cost *
      item.QTY *
      (1 - item.DISCNT1 / 100) *
      (1 - item.DISCNT2 / 100) *
      (1 - item.DISCNT3 / 100) *
      (1 - item.DISCNT4 / 100)
    );
  }

  function getItemAmount(item: posItemsType) {
    return _getItemAmount(item).toLocaleString("th-TH", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  }

  function _getItemAmountBeforeVat(item: posItemsType) {
    return (
      (item.cost / 1.07) *
      item.QTY *
      (1 - item.DISCNT1 / 100) *
      (1 - item.DISCNT2 / 100) *
      (1 - item.DISCNT3 / 100) *
      (1 - item.DISCNT4 / 100)
    );
  }

  function getItemAmountBeforeVat(item: posItemsType) {
    return _getItemAmountBeforeVat(item).toLocaleString("th-TH", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  }

  const value = {
    purchaseBillNo,
    setPurchaseBillNo,
    purchaseBillDate,
    setPurchaseBillDate,
    getItemAmount,
    getItemAmountBeforeVat,
    getTotalFullCostBeforeVat,
    getTotalCostBeforeVat,
    getTotalCostAfterVat,
    getTotalDiscount,
    getTotalTax,
  };

  return (
    <PurchaseContext.Provider value={value}>
      {children}
    </PurchaseContext.Provider>
  );
}
