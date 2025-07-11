import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/customers/CustomerColumns";
import { Separator } from "@/components/ui/separator";
import Customer from "@/lib/models/Customer";
import { connectToDB } from "@/lib/mongoDB";

const Customers = async () => {
  await connectToDB();

  const rawCustomers = await Customer.find().sort({ createdAt: "desc" });
  const customers = JSON.parse(JSON.stringify(rawCustomers));

  return (
    <div className="px-10 py-5">
      <p className="text-[30px] leading-[100%] font-[700] text-gray-900">
        Customers
      </p>
      <Separator className="bg-[#616161] my-4" />
      <DataTable columns={columns} data={customers} searchKey="name" />
    </div>
  );
};

export const dynamic = "force-dynamic";

export default Customers;
