import Link from "next/link";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  const userName = session?.user?.name;

  if (process.env.ALLOW_USER?.split(" ").includes(userName ? userName : "")) {
    return redirect("/pos");
  }

  return (
    <main className="grid place-content-center justify-items-center h-full gap-6">
      {!process.env.ALLOW_USER?.split(" ").includes(
        userName ? userName : ""
      ) ? (
        <Link
          href="/api/auth/signin"
          className="border rounded-md px-4 py-2 transition active:bg-secondary active:text-white hover:scale-105 hover:bg-gray-200"
        >
          เข้าสู่ระบบ
        </Link>
      ) : (
        <>Home</>
      )}
    </main>
  );
}
