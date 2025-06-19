import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { connectToDB } from "@/lib/mongoDB";
import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";

export const POST = async (req: NextRequest) => {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("Stripe-Signature") as string;

    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: [
          "line_items.data.price.product",
          "collected_information.shipping_details.address",
        ],
      });

      const collectedInfo =
        fullSession.collected_information as Stripe.Checkout.Session.CollectedInformation | null;

      const shippingDetails = collectedInfo?.shipping_details;
      const address = shippingDetails?.address;

      const shippingAddress = {
        street: address?.line1 || "",
        city: address?.city || "",
        state: address?.state || "",
        postalCode: address?.postal_code || "",
        country: address?.country || "",
      };

      const customerInfo = {
        clerkId: fullSession.client_reference_id || "",
        name: fullSession.customer_details?.name || "",
        email: fullSession.customer_details?.email || "",
      };

      const lineItems = fullSession.line_items?.data || [];

      const orderItems = lineItems.map((item) => {
        const product = item.price?.product as Stripe.Product;
        return {
          product: product.metadata.productId,
          color: product.metadata.color || "N/A",
          size: product.metadata.size || "N/A",
          quantity: item.quantity,
        };
      });

      await connectToDB();

      const newOrder = new Order({
        customerClerkId: customerInfo.clerkId,
        products: orderItems,
        shippingAddress,
        shippingRate: fullSession.shipping_cost?.shipping_rate || "",
        totalAmount: fullSession.amount_total
          ? fullSession.amount_total / 100
          : 0,
      });

      await newOrder.save();

      let customer = await Customer.findOne({ clerkId: customerInfo.clerkId });

      if (customer) {
        customer.orders.push(newOrder._id);
      } else {
        customer = new Customer({
          ...customerInfo,
          orders: [newOrder._id],
        });
      }

      await customer.save();

      return new NextResponse("Order created", { status: 200 });
    }

    return new NextResponse("Unhandled event", { status: 200 });
  } catch (error) {
    console.error("[webhooks_POST] Error:", error);
    return new NextResponse("Webhook error", { status: 500 });
  }
};
