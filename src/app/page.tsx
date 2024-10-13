import Link from "next/link";

export default function Home() {
  return (
    <main className="grid place-content-center h-full">
      <Link
        href="/product"
        className="border rounded-md px-4 py-2 transition active:bg-secondary active:text-white hover:scale-105 hover:bg-gray-200"
      >
        เข้าสู่ระบบ
      </Link>
    </main>
  );
}
