import { NextResponse } from "next/server";

export async function POST(request, response) {
  const body = await request.json();
  const { paymentId, sessionId } = body;

  try {
    const response = await fetch(
      `https://api.sandbox.checkout.com/payments/${paymentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SECRET_KEY}`, // Replace YOUR_SECRET_KEY with your actual Checkout.com secret key
        },
      }
    );
    const paymentDetails = await response.json();

    /* Session ID returns the same object as the Payment ID*/
    // const sid = await fetch(
    //   `https://api.sandbox.checkout.com/payments/${sessionId}`,
    //   {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${process.env.SECRET_KEY}`, // Replace YOUR_SECRET_KEY with your actual Checkout.com secret key
    //     },
    //   }
    // );
    // const sidPD = await sid.json();

    // console.log("paymentId:", paymentDetails);
    // console.log("sessionId:", sidPD);

    return NextResponse.json(paymentDetails);
  } catch (error) {
    console.error("Error fetching payment details:", error);
    return NextResponse.json({ error: error.body }, { status: 500 });
  }
}
