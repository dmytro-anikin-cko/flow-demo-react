import { NextResponse } from "next/server";

export async function POST(request, response) {

  const body = await request.json();
  const { sessionId } = body; 

  try {
    const response = await fetch(`https://api.sandbox.checkout.com/payments/${sessionId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SECRET_KEY}`, // Replace YOUR_SECRET_KEY with your actual Checkout.com secret key
        },
    });
    const paymentDetails = await response.json()
    return NextResponse.json(paymentDetails);
  } catch (error) {
    console.error("Error fetching payment details:", error);
    return NextResponse.json({ error: error.body }, { status: 500 });
  }
}