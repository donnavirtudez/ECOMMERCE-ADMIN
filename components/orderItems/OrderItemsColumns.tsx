"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

type ProductType = {
  _id: string;
  title: string;
};

type OrderItemType = {
  product: ProductType;
  color: string;
  size: string;
  quantity: number;
};

export const columns: ColumnDef<OrderItemType>[] = [
  {
    id: "product",
    accessorFn: (row) => row.product.title,
    header: "Product",
    cell: ({ row }) => {
      const product = row.original.product;
      return (
        <Link
          href={`/products/${product._id}`}
          className="hover:text-[#4E71FF]"
        >
          {product.title}
        </Link>
      );
    },
  },
  {
    accessorKey: "color",
    header: "Color",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
];
