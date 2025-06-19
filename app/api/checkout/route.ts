import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

type CartItem = {
  item: {
    _id: string;
    title: string;
    price: number;
  };
  quantity: number;
  size?: string;
  color?: string;
};

type Customer = {
  clerkId: string;
};

type CheckoutRequestBody = {
  cartItems: CartItem[];
  customer: Customer;
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const { cartItems, customer }: CheckoutRequestBody = await req.json();

    if (!cartItems || !customer) {
      return new NextResponse("Not enough data to checkout", { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: [
          "US",
          "CA",
          "PH",
          "JP",
          "SG",
          "GB",
          "AU",
          "DE",
          "FR",
          "IT",
          "ES",
        ],
      },
      shipping_options: [
        { shipping_rate: "shr_1RV3tHPoSiSdfDr7WuEOogco" },
        { shipping_rate: "shr_1RV3usPoSiSdfDr7stDKCy3q" },
      ],
      line_items: cartItems.map((cartItem: CartItem) => ({
        price_data: {
          currency: "php",
          product_data: {
            name: cartItem.item.title,
            metadata: {
              productId: cartItem.item._id,
              ...(cartItem.size && { size: cartItem.size }),
              ...(cartItem.color && { color: cartItem.color }),
            },
          },
          unit_amount: Math.round(cartItem.item.price * 100),
        },
        quantity: cartItem.quantity,
      })),
      client_reference_id: customer.clerkId,
      success_url: `${process.env.ECOMMERCE_STORE_URL}/payment_success`,
      cancel_url: `${process.env.ECOMMERCE_STORE_URL}/cart`,
    });

    return NextResponse.json(session, { headers: corsHeaders });
  } catch (err) {
    console.log("[checkout_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
