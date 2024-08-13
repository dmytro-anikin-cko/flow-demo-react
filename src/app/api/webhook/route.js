import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req, res) {
  try {
    // Get the raw body as a buffer
    const rawBody = await req.text();

    // Extract the signature from the headers
    const signature = req.headers.get("cko-signature");

    const secret = process.env.WEBHOOK_SIGNATURE_KEY; // Your secret key from Checkout.com

    const hash = crypto
      .createHmac("sha256", secret)
      .update(rawBody, "utf8")
      .digest("hex");

    if (hash !== signature) {
      console.error("Invalid signature. Possible tampering detected.");
      return NextResponse.json(
        { received: false, message: "Invalid signature" },
        { status: 400 }
      );
    }

    // Parse the raw body
    const event = JSON.parse(rawBody);
    console.log(event);
    
    // Handle the webhook event
    if (event.type === "payment_approved") {
      console.log("Message from CKO: payment_approved");
    } 

    // Return a response to acknowledge receipt of the webhook
    // return res.status(200).json({ received: true });
    return NextResponse.json(
      { received: true, message: "CKO payment approved" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: error.body }, { status: 500 });
  }
}
