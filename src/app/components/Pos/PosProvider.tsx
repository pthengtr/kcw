"use client";
import { createContext } from "react";
import React from "react";
import {
  prices_mType,
  pricesType,
  productType,
} from "../Product/ProductProvider";
import { accountsType, billType } from "../Transaction/TransactionProvider";

export type posItemsType = {
  BCODE: string;
  DESCR: string;
  MODEL: string;
  QTY: number;
  UI1: string;
  UI2: string;
  MTP: number;
  prices: pricesType[];
  prices_m: prices_mType[];
  ISVAT: string;
  atPrice: string;
  atUnit: string;
  isReturn: boolean;
  returnPrice: number;
  returnUnit: string;
  returnQty: number;
  cost: number;
  DISCNT1: number;
  DISCNT2: number;
  DISCNT3: number;
  DISCNT4: number;
};

export type PosContextType = {
  posItems: posItemsType[] | undefined;
  setPosItems: (items: posItemsType[] | undefined) => void;
  payment: string;
  setPayment: (payment: string) => void;
  vat: string;
  setVat: (isVat: string) => void;
  currentCustomer: accountsType | undefined;
  setCurrentCustomer: (customer: accountsType | undefined) => void;
  billDiscount: string;
  setBillDiscount: (discount: string) => void;
  returnMode: boolean;
  setReturnMode: (isReturn: boolean) => void;
  currentReturnBill: billType | undefined;
  setCurrentReturnBill: (bill: billType | undefined) => void;
  handleClickAddToCart: (productDetail: productType) => void;
  handleCLickDeleteItem: (bcode: string) => void;
  handleClickAddQty: (bcode: string) => void;
  handleClickRemoveQty: (bcode: string) => void;
  handleSetNewQty: (bcode: string, newQty: number) => void;
  getSumAmount: () => string;
  getSumBeforeTax: () => string;
  getSumTax: () => string;
  getSumDiscount: () => string;
  getSumFullprice: () => string;
  getPrice: (item: posItemsType) => string;
  getFullPrice: (item: posItemsType) => string;
  getAmount: (item: posItemsType) => string;
  getSumReturnAmount: () => string;
  getReturnItemPrice: (item: posItemsType) => string;
  getReturnItemAmount: (item: posItemsType) => string;
};

export const priceName = {
  PRICE1: "ทั่วไป",
  PRICE2: "ช่าง",
  PRICE3: "ส่ง",
  PRICE5: "LAZ",
};

export const PosContext = createContext<PosContextType | null>(null);

type PosProviderProps = {
  children: React.ReactNode;
};

export default function PosProvider({ children }: PosProviderProps) {
  const [posItems, setPosItems] = React.useState<posItemsType[]>();
  const [payment, setPayment] = React.useState("CASH");
  const [vat, setVat] = React.useState("novat");
  const [currentCustomer, setCurrentCustomer] = React.useState<accountsType>();
  const [billDiscount, setBillDiscount] = React.useState("");
  const [returnMode, setReturnMode] = React.useState(false);
  const [currentReturnBill, setCurrentReturnBill] = React.useState<
    billType | undefined
  >();

  function getSumBeforeTax() {
    return (
      !!posItems
        ? posItems?.reduce((acc, item) => _getPrice(item) * item.QTY + acc, 0) *
          (100 / 107)
        : 0
    )?.toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function getSumTax() {
    return (
      !!posItems
        ? posItems?.reduce((acc, item) => _getPrice(item) * item.QTY + acc, 0) *
          (1 - 100 / 107)
        : 0
    )?.toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function getSumAmount() {
    return (
      !!posItems
        ? posItems?.reduce((acc, item) => _getPrice(item) * item.QTY + acc, 0) -
          parseFloat(!!billDiscount ? billDiscount : "0")
        : 0
    )?.toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function getSumFullprice() {
    return (
      !!posItems
        ? posItems?.reduce(
            (acc, item) => _getFullPrice(item) * item.QTY + acc,
            0
          )
        : 0
    )?.toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function getSumDiscount() {
    return (
      !!posItems
        ? posItems.reduce(
            (acc, item) => _getDiscount(item) * item.QTY + acc,
            0
          ) + parseFloat(!!billDiscount ? billDiscount : "0")
        : 0
    )?.toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function _getDiscount(item: posItemsType) {
    return _getFullPrice(item) - _getPrice(item);
  }

  function _getPrice(item: posItemsType) {
    const prices = Object.fromEntries(
      item.prices.map((price) => [price.Attribute, price.Value])
    );
    const prices_m = Object.fromEntries(
      item.prices_m.map((price) => [price.Attribute, price.Value])
    );

    const itemPrice = item.atUnit === "UI1" ? prices : prices_m;

    return vat === "vat"
      ? item.ISVAT === "Y"
        ? itemPrice[item.atPrice]
        : itemPrice[item.atPrice] * 1.07
      : itemPrice[item.atPrice];
  }

  function _getFullPrice(item: posItemsType) {
    const prices = Object.fromEntries(
      item.prices.map((price) => [price.Attribute, price.Value])
    );
    const prices_m = Object.fromEntries(
      item.prices_m.map((price) => [price.Attribute, price.Value])
    );

    const itemPrice = item.atUnit === "UI1" ? prices : prices_m;
    const atPrice = "PRICE1";

    return vat === "vat"
      ? item.ISVAT === "Y"
        ? itemPrice[atPrice]
        : itemPrice[atPrice] * 1.07
      : itemPrice[atPrice];
  }

  function getFullPrice(item: posItemsType) {
    return _getFullPrice(item).toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function getAmount(item: posItemsType) {
    return (_getPrice(item) * item.QTY).toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function getPrice(item: posItemsType) {
    return _getPrice(item).toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function getReturnItemPrice(item: posItemsType) {
    return _getReturnItemPrice(item).toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function _getReturnItemPrice(item: posItemsType) {
    return !!currentReturnBill && currentReturnBill.TAX > 0
      ? item.ISVAT === "Y"
        ? item.returnPrice
        : item.returnPrice * 1.07
      : item.returnPrice;
  }

  function getReturnItemAmount(item: posItemsType) {
    return (_getReturnItemPrice(item) * item.QTY).toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function getSumReturnAmount() {
    return (
      !!posItems
        ? posItems.reduce(
            (acc, cur) =>
              cur.isReturn ? acc + _getReturnItemPrice(cur) * cur.QTY : acc,
            0
          )
        : 0
    ).toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function handleCLickDeleteItem(bcode: string) {
    const newPosItems = posItems?.filter((item) => item.BCODE !== bcode);

    if (newPosItems !== undefined) setPosItems(newPosItems);
  }

  function handleSetNewQty(bcode: string, newQty: number) {
    if (!!posItems && posItems.findIndex((item) => item.BCODE === bcode) > -1) {
      const newPosItems = posItems.map((item) => {
        if (item.BCODE === bcode) item.QTY = newQty;
        return item;
      });

      setPosItems(newPosItems);
    }
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
        MODEL: productDetail.MODEL,
        QTY: 1,
        UI1: productDetail.UI1,
        UI2: productDetail.UI2,
        MTP: productDetail.MTP2,
        prices: productDetail.prices,
        prices_m: productDetail.prices_m,
        ISVAT: productDetail.ISVAT,
        atPrice: "PRICE1",
        atUnit: "UI1",
        isReturn: false,
        returnUnit: productDetail.UI1,
        returnPrice: productDetail.PRICE1,
        returnQty: 1,
        cost: 0,
        DISCNT1: 0,
        DISCNT2: 0,
        DISCNT3: 0,
        DISCNT4: 0,
      };

      const newPosItems = !!posItems ? [...posItems, item] : [item];

      setPosItems(newPosItems);
    }
  }

  const value = {
    billDiscount,
    setBillDiscount,
    posItems,
    setPosItems,
    currentReturnBill,
    setCurrentReturnBill,
    handleClickAddToCart,
    handleCLickDeleteItem,
    handleClickAddQty,
    handleClickRemoveQty,
    handleSetNewQty,
    getSumAmount,
    getSumBeforeTax,
    getSumTax,
    getSumFullprice,
    getSumDiscount,
    getPrice,
    getFullPrice,
    getAmount,
    getReturnItemAmount,
    getReturnItemPrice,
    getSumReturnAmount,
    payment,
    setPayment,
    vat,
    setVat,
    currentCustomer,
    setCurrentCustomer,
    returnMode,
    setReturnMode,
  };

  return <PosContext.Provider value={value}>{children}</PosContext.Provider>;
}
