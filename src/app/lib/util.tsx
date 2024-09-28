import { Prisma } from "@prisma/client";

export const dbTake: number = 50;

export const groupProducts: Record<string, string[]> = {
  รถไถ: ["12", "30", "31", "35", "12,30,31,35"],
  รถยนต์: ["3", "5", "7", "8", "11", "16", "23", "29", "3,5,7,8,11,16,23,29"],
  "รถใหญ่ 6-10 ล้อ": ["1", "2", "4", "6", "9", "10", "28", "1,2,4,6,9,10,28"],
  "แมคโคร โฟล์คลิฟท์": ["32", "34", "32,34"],
  "น้ำมัน แบตฯ": ["21", "22", "21,22"],
  อื่นๆ: [
    "13",
    "14",
    "15",
    "17,18,19,20",
    "25",
    "26",
    "13,14,15,17,18,19,20,25,26",
  ],
  บริการ: ["33", "40", "33,40"],
};

export const sizeCategory: Record<string, string> = {
  I: "ลูกปืน",
  C: "ซีล",
  G: "ยอยกากบาท",
  D: "บู๊ช",
  K: "จานคลัช",
  P: "กรองเครื่อง",
  F: "กรองอากาศ",
  E: "ลูกปืน เข็ม/กรงนก",
  Q: "ลูกหมาก",
  L: "สายอ่อน",
  A: "ถ่าน",
  R: "ลูกยาง",
};

export const sizeType: Record<string, string[]> = {
  I: ["ใน", "นอก", "หนา"],
  C: ["ใน", "นอก", "หนา"],
  G: ["ปลอก", "ยาว", "ล็อค"],
  D: ["ใน", "นอก", "หนา"],
  K: ["ยาว(นิ้ว)", "ฟัน", "ขนาดรู"],
  P: ["ใน", "นอก", "สูง"],
  F: ["ใน", "นอก", "หนา"],
  E: ["ใน", "นอก", "หนา"],
  Q: ["เตเปอร์", "แกนโต"],
  L: ["หัวสาย 1", "หัวสาย 2", "ยาว"],
  A: ["หนา", "กว้าง", "ยาว"],
  R: ["ใน", "นอก", "หนา"],
};

export const groupName: Record<string, string> = {
  all: "ทั้งหมด",
  "12": "รถไถ FORD",
  "30": "KUBOTA",
  "31": "MASSEY M/F",
  "35": "YANMAR ISEKI",
  "12,30,31,35": "รถไถทั้งหมด",
  "3": "ISUZU",
  "5": "NISSAN",
  "7": "MAZDA FORD",
  "8": "TOYOTA",
  "11": "MITSU",
  "16": "HONDA",
  "23": "รถยุโรป",
  "29": "ประดับยนต์",
  "3,5,7,8,11,16,23,29": "รถยนต์ทั้งหมด",
  "1": "TX",
  "2": "JCM DECCA",
  "4": "ELF KS NPR NKR",
  "6": "UD CW CMA",
  "9": "HINO MEGA",
  "10": "FUSO",
  "28": "พ่วง เทเลอร์",
  "1,2,4,6,9,10,28": "รถใหญ่ 6-10 ล้อ ทั้งหมด",
  "32": "แมคโคร",
  "34": "โฟล์คลิฟท์ รถยก",
  "32,34": "แมคโคร โฟล์คลิฟท์ ทั้งหมด",
  "21": "แบตเตอรี่ น้ำกลั่น",
  "22": "น้ำมัน จารบี น้ำยา",
  "21,22": "น้ำมัน แบตเตอรี่ ทั้งหมด",
  "13": "ทั่วไป ไฟ ยาง ฯลฯ",
  "14": "เครื่องมือ",
  "15": "ลูกปืน",
  "17,18,19,20": "สกรู",
  "25": "โอริง",
  "26": "สายอ่อน",
  "13,14,15,17,18,19,20,25,26": "อื่นๆทั้งหมด",
  "33": "อัดสายไฮฯ",
  "40": "ค่าแรง",
  "33,40": "บริการทั้งหมด",
};

export function formatWordsSearch(
  status: string,
  groups: number[] | null,
  words: string[]
) {
  const andArray = [];
  const orGroup: Prisma.ProductInfoWhereInput[] = [];

  words.forEach((word) =>
    andArray.push({
      OR: [
        { BCODE: { contains: word } },
        { XCODE: { contains: word } },
        { PCODE: { contains: word } },
        { MCODE: { contains: word } },
        { PCODE: { contains: word } },
        { DESCR: { contains: word } },
        { MODEL: { contains: word } },
        { VENDOR: { contains: word } },
        { BRAND: { contains: word } },
      ],
    })
  );

  if (groups !== null) {
    groups.forEach((group) => orGroup.push({ MAIN: { equals: group } }));

    andArray.push({ OR: orGroup });
  }

  if (status === "true") {
    andArray.push({ STATUS: { equals: 1 } });
  }
  return { AND: andArray };
}

export function formatSizeSearch(
  status: string,
  category: string,
  sizeArray: string[]
) {
  const andArray: Prisma.ProductInfoWhereInput[] = [
    { CODE1: { contains: category } },
  ];

  sizeArray.forEach((size, index) => {
    if (size !== "")
      andArray.push({
        [`SIZE${(index + 1).toString()}`]: { contains: size },
      });
  });

  if (status === "true") {
    andArray.push({ STATUS: { equals: 1 } });
  }

  return { AND: andArray };
}
