"use client";
import { createContext } from "react";
import React from "react";
import { productType } from "../Product/ProductProvider";

export type posItemsType = {
  BCODE: string;
  DESCR: string;
  QTY: number;
  UI: string;
  MTP: number;
  PRICE: number;
  AMOUNT: number;
  ISVAT: string;
};

export type PosContextType = {
  posItems: posItemsType[] | undefined;
  setPosItems: (items: posItemsType[] | undefined) => void;
  payment: string;
  setPayment: (payment: string) => void;
  vat: string;
  setVat: (isVat: string) => void;
  handleClickAddToCart: (productDetail: productType) => void;
  handleCLickDeleteItem: (bcode: string) => void;
  handleClickAddQty: (bcode: string) => void;
  handleClickRemoveQty: (bcode: string) => void;
  getSumAmount: () => number;
};

export const PosContext = createContext<PosContextType | null>(null);

type PosProviderProps = {
  children: React.ReactNode;
};

export default function PosProvider({ children }: PosProviderProps) {
  const [posItems, setPosItems] = React.useState<posItemsType[]>();
  const [payment, setPayment] = React.useState("cash");
  const [vat, setVat] = React.useState("vat");

  function getSumAmount() {
    return !!posItems
      ? posItems.reduce(
          (acc, item) =>
            item.QTY *
              item.PRICE *
              (vat === "vat" ? (item.ISVAT === "Y" ? 1 : 1.07) : 1) +
            acc,
          0
        )
      : 0;
  }

  function handleCLickDeleteItem(bcode: string) {
    const newPosItems = posItems?.filter((item) => item.BCODE !== bcode);

    if (newPosItems !== undefined) setPosItems(newPosItems);
  }

  function handleClickAddQty(bcode: string) {
    if (!!posItems && posItems.findIndex((item) => item.BCODE === bcode) > -1) {
      const newPosItems = posItems.map((item) => {
        if (item.BCODE === bcode) item.QTY++;
        return item;
      });

      setPosItems(newPosItems);
    }
  }

  function handleClickRemoveQty(bcode: string) {
    if (!!posItems && posItems.findIndex((item) => item.BCODE === bcode) > -1) {
      const newPosItems = posItems
        .map((item) => {
          if (item.BCODE === bcode) item.QTY--;
          return item;
        })
        .filter((item) => item.QTY > 0);

      setPosItems(newPosItems);
    }
  }

  function handleClickAddToCart(productDetail: productType) {
    if (
      !!posItems &&
      posItems.findIndex((item) => item.BCODE === productDetail.BCODE) > -1
    ) {
      const newPosItems = posItems.map((item) => {
        if (item.BCODE === productDetail.BCODE) item.QTY++;
        return item;
      });

      setPosItems(newPosItems);
    } else {
      const item: posItemsType = {
        BCODE: productDetail.BCODE,
        DESCR: productDetail.DESCR,
        QTY: 1,
        UI: productDetail.UI1,
        MTP: 1,
        PRICE: productDetail.PRICE1,
        AMOUNT: productDetail.PRICE1,
        ISVAT: productDetail.ISVAT,
      };

      const newPosItems = !!posItems ? [...posItems, item] : [item];

      setPosItems(newPosItems);
    }
  }

  const value = {
    posItems,
    setPosItems,
    handleClickAddToCart,
    handleCLickDeleteItem,
    handleClickAddQty,
    handleClickRemoveQty,
    getSumAmount,
    payment,
    setPayment,
    vat,
    setVat,
  };

  return <PosContext.Provider value={value}>{children}</PosContext.Provider>;
}
