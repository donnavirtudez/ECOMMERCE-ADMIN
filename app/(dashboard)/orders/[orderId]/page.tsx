import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/orderItems/OrderItemsColumns";
import { Separator } from "@/components/ui/separator";

interface OrderDetailsPageProps {
  params: {
    orderId: string;
  };
}

const OrderDetails = async ({ params }: OrderDetailsPageProps) => {
  const res = await fetch(`http://localhost:3001/api/orders/${params.orderId}`);
  const { orderDetails, customer } = await res.json();

  const { street, city, state, postalCode, country } =
    orderDetails.shippingAddress;

  return (
    <div className="px-10 py-5">
      <p className="text-[30px] leading-[100%] font-[700] text-gray-900">
        Order Details
      </p>

      <Separator className="bg-[#616161] my-4" />

      <div className="grid gap-4 sm:grid-cols-2 text-sm text-gray-800 mt-6">
        <div className="flex flex-col">
          <span className="text-gray-500 uppercase tracking-wide text-xs mb-1">
            Order ID
          </span>
          <span className="text-gray-900">{orderDetails._id}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-500 uppercase tracking-wide text-xs mb-1">
            Customer Name
          </span>
          <span className="text-gray-900">{customer.name}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-500 uppercase tracking-wide text-xs mb-1">
            Shipping Address
          </span>
          <span className="text-gray-900">
            {street}, {city}, {state}, {postalCode}, {country}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-500 uppercase tracking-wide text-xs mb-1">
            Shipping Rate ID
          </span>
          <span className="text-gray-900">{orderDetails.shippingRate}</span>
        </div>

        <div className="flex flex-col sm:col-span-2">
          <span className="text-gray-500 uppercase tracking-wide text-xs mb-1">
            Total Paid
          </span>
          <span className="text-gray-900">₱{orderDetails.totalAmount}</span>
        </div>
      </div>

      <Separator className="bg-[#616161] my-4" />

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={orderDetails.products}
          searchKey="product"
        />
      </div>
    </div>
  );
};

export default OrderDetails;
