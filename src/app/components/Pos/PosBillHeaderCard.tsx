import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";

export default function PosBillHeaderCard() {
  const { data: session } = useSession();

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle>รายละเอียดบิล</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-[auto_auto] gap-x-4 gap-y-2">
        <span>ลูกค้า</span>
        <span>YYY XXXXXXX ZZZZZZ</span>
        <span>พนักงาน</span>
        <span className="font-semibold">{session?.user?.name}</span>
      </CardContent>
    </Card>
  );
}
