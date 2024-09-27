import { Prisma } from "@prisma/client";

export const dbTake: number = 50;

export const sizeCategory: Record<string, string> = {
  I: "ลูกปืน",
  C: "ซีล",
  G: "ยอยกากบาท",
  D: "บู๊ช",
  K: "จานคลัช",
  P: "กรองเครื่อง",
  F: "กรองอากาศ",
  E: "ลูกปืนเข็ม",
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
  A: ["กว้าง", "ยาว", "หนา"],
  R: ["ใน", "นอก", "หนา"],
};

export const groupName: Record<string, string> = {
  all: "ทั้งหมด",
  "12": "FORD (รถไถ)",
  "30": "KUBOTA",
  "31": "M/F",
  "35": "YANMAR ISEKI",
  "3": "ISUZU",
  "5": "NISSAN",
  "7": "MAZDA FORD",
  "8": "TOYOTA",
  "11": "MITSU",
  "16": "HONDA",
  "23": "รถยุโรป",
  "29": "ประดับยนต์",
  "1": "TX",
  "2": "JCM",
  "4": "ELF",
  "6": "UD CW CMA",
  "9": "HINO MEGA",
  "10": "FUSO",
  "28": "พ่วง เทเลอร์",
  "32": "แมคโคร",
  "34": "โฟล์คลิฟท์",
  "21": "แบตเตอรี่",
  "22": "น้ำมัน จารบี",
  "13": "ทั่วไป ไฟ ยาง ฯลฯ",
  "14": "เครื่องมือ",
  "15": "ลูกปืน",
  "17,18,19,20": "สกรู",
  "25": "โอริง",
  "26": "สายอ่อน",
  "33": "อัดสายไฮฯ",
  "40": "ค่าแรง",
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
