import { NextResponse } from "next/server";

const generateRandomAmount = () => {
  return Math.floor(1000 + Math.random() * 9000); // Generates a number between 1000 and 9999
};

export async function POST(request, response) {
  try {
    // const body = await request.json();
    // console.log("Log body", body);
    // const { amount, name } = body; // Get the token from the request body

    let paymentRequest = {
      processing_channel_id: process.env.PROCESSING_CHANNEL_ID,
      currency: "EUR", // Necessary for iDeal and Sofort
      amount: generateRandomAmount(),
      reference: `ORD-${generateRandomAmount()}`,
      customer: {
        name: "Test Name",
      },
      billing: {
        address: {
          country: "NL", // Necessary for iDeal
        },
      },
      // locale: "en",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
      failure_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-failure`,
    };

    const paymentSessionResponse = await fetch(
      "https://api.sandbox.checkout.com/payment-sessions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SECRET_KEY}`,
        },
        body: JSON.stringify(paymentRequest),
      }
    );

    const paymentSessionData = await paymentSessionResponse.json();

    console.log("paymentSessionData", paymentSessionData);

    return NextResponse.json(paymentSessionData);
  } catch (error) {
    console.log("Error on the server:", error);
    return NextResponse.json({ error: error.body }, { status: 500 });
  }
}
