"use client";

import { DataTable } from "@/components/custom ui/DataTable";
import Loader from "@/components/custom ui/Loader";
import { columns } from "@/components/orders/OrderColumns";
import { Separator } from "@/components/ui/separator";

import { useEffect, useState } from "react";

const Orders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    try {
      const res = await fetch(`/api/orders`);
      const data = await res.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      console.log("[orders_GET", err);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="px-10 py-5">
      <p className="text-[30px] leading-[100%] font-[700] text-gray-900">
        Orders
      </p>
      <Separator className="bg-[#616161] my-4" />
      <DataTable columns={columns} data={orders} searchKey="_id" />
    </div>
  );
};

export const dynamic = "force-dynamic";

export default Orders;
