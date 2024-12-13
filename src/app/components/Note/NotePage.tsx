"use client";

import CreateNoteCard from "./CreateNoteCard";
import NoteTotalCard from "./NoteTotalCard";
import NoteSaveDialog from "./NoteSaveDialog";
import RecentNoteSheet from "./RecentNoteSheet";

export default function NotePage() {
  return (
    <main className="h-[90%] flex mx-auto ">
      <div className="w-[1280px] flex gap-4 p-4">
        <div className="flex flex-1 justify-center gap-8">
          <CreateNoteCard />
        </div>
        <div className="flex flex-col justify-start gap-4 min-w-72">
          <NoteTotalCard />
          <NoteSaveDialog />
          <div className="col-span-2  text-center hover:bg-gray-100 p-1 rounded-md text-base">
            <RecentNoteSheet />
          </div>
        </div>
      </div>
    </main>
  );
}
