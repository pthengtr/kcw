import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useContext } from "react";
import { PosContext, PosContextType } from "./PosProvider";

export default function PosBillTotalCard() {
  const { getSumAmount } = useContext(PosContext) as PosContextType;
  return (
    <Card className="W-full shadow-md">
      <CardHeader>
        <CardTitle className="text-center">ยอดรวม</CardTitle>
      </CardHeader>
      <CardContent className="grid place-content-center gap-8">
        <div className="rounded-md text-6xl py-2 px-4 bg-primary text-white font-semibold">
          {getSumAmount()}
        </div>
      </CardContent>
    </Card>
  );
}
