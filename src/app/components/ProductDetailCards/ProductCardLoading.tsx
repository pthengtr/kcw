import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCardLoading() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-64 rounded-full" />
      <Skeleton className="h-4 w-64 rounded-full" />
      <Skeleton className="h-4 w-64 rounded-full" />
      <Skeleton className="h-4 w-64 rounded-full" />
    </div>
  );
}
