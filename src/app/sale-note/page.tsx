import React from "react";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import NotePage from "../components/Note/NotePage";
import NoteProvider from "../components/Note/NoteProvider";

export default async function Pos() {
  const session = await auth();
  const userName = session?.user?.name;

  if (!process.env.ALLOW_USER?.split(" ").includes(userName ? userName : "")) {
    return redirect("/");
  }

  return (
    <NoteProvider>
      <NotePage />
    </NoteProvider>
  );
}
