import SalesChart from "@/components/custom ui/SalesChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  getSalesPerMonth,
  getTotalCustomers,
  getTotalSales,
} from "@/lib/actions/actions";
import { TrendingUp, ShoppingBag, UserRound } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const totalRevenue = await getTotalSales().then((data) => data.totalRevenue);
  const totalOrders = await getTotalSales().then((data) => data.totalOrders);
  const totalCustomers = await getTotalCustomers();

  const graphData = await getSalesPerMonth();

  return (
    <div className="px-10 py-5">
      <p className="text-[30px] leading-[100%] font-[700] text-gray-900">
        Dashboard
      </p>
      <Separator className="bg-[#616161] my-4" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-gray-900">Total Revenue</CardTitle>
            <TrendingUp className="text-[#616161]" />
          </CardHeader>
          <CardContent>
            <p className="text-bold text-gray-900">₱ {totalRevenue}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-gray-900">Total Orders</CardTitle>
            <ShoppingBag className="text-[#616161]" />
          </CardHeader>
          <CardContent>
            <p className="text-bold text-gray-900">{totalOrders}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-gray-900">Total Customer</CardTitle>
            <UserRound className="text-[#616161]" />
          </CardHeader>
          <CardContent>
            <p className="text-bold text-gray-900">{totalCustomers}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-7">
        <CardHeader>
          <CardTitle className="text-gray-900">Sales Chart (₱)</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesChart data={graphData} />
        </CardContent>
      </Card>
    </div>
  );
}
