import { NextResponse } from "next/server";

const generateRandomAmount = () => {
  return Math.floor(1000 + Math.random() * 9000); // Generates a number between 1000 and 9999
};

export async function POST(request, response) {

  try {
    const body = await request.json();
    // console.log("Log body", body);
    
    let { language } = body; // Get the token from the request body

    const transformLanguageCode = (lang) => {
      if (lang === 'en') {
        return 'GB';
      } else if (lang === 'nl' || lang === 'fr') {
        return lang.toUpperCase();
      } else {
        return lang;
      }
    };

    const transformedLanguage = transformLanguageCode(language);

    // Sample data for Klarna: https://docs.klarna.com/resources/developer-tools/sample-data/sample-customer-data/#europe-netherlands
    let paymentRequest = {
      processing_channel_id: process.env.PROCESSING_CHANNEL_ID,
      currency: "EUR", // Necessary for iDeal and Sofort
      amount: 1000,
      reference: `ORD-${generateRandomAmount()}`,
      customer: { // Necessary for Klarna
        name: "Random Name", // Can be random for Klarna
        email: "random@email.com", // NECESSARY!!!! Can be random for Klarna
        // phone: { // Not necessary
        //   country_code: "+34", // Can be random for Klarna
        //   number: "689689689" // Can be random for Klarna
        // }
      },
      "3ds": {
        enabled: true, // For Cartes Bancaires, doesn't work with 'true' (works only when providing 'eci', 'cryptogram', etc.). Error code: 'no_processor_configured_for_card_scheme'. 
      },
      billing: {
        address: {
          country: transformedLanguage, // Necessary for iDeal
          address_line1: "Osdorpplein 137", // NECESSARY!!!! Can be random for Klarna
          // address_line2: "Flat 456", // Not necessary. Can be random for Klarna
          city: "Amsterdam", // NECESSARY!!!! Can be random for Klarna
          zip: "1068 SR", // NECESSARY!!!! Can be random for Klarna
        },
      },
      items: [ // Necessary for Klarna
        {
          name: "Battery Power Pack",
          quantity: 1,
          unit_price: 1000,
          total_amount: 1000,
          reference: "BA67A"
        }
      ],
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

    // console.log("paymentSessionData", paymentSessionData);

    return NextResponse.json(paymentSessionData);
  } catch (error) {
    console.log("Error on the server:", error);
    return NextResponse.json({ error: error.body }, { status: 500 });
  }
}
