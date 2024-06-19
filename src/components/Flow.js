"use client";
import { useEffect, useState } from "react";
import { loadCheckoutWebComponents } from "@checkout.com/checkout-web-components";
import { useRouter } from "next/navigation";

export default function Flow() {
  const router = useRouter();

  const [payments, setPayments] = useState(null);

  useEffect(() => {

    async function initializePayment() {
      const orderResponse = await fetch("/api/payment-session", {
        method: "POST",
      });
      const paymentSession = await orderResponse.json();

      if (!orderResponse.ok) {
        console.error("Error creating payment session", paymentSession);
        return;
      }

      // Usage: README file https://www.npmjs.com/package/checkout-web-components?activeTab=code
      const cko = await loadCheckoutWebComponents({
        publicKey: "pk_sbox_ffrilzleqqiso6zphoa6dmpr7eo",
        environment: "sandbox",
        locale: "de-DE",
        paymentSession,
        onReady: () => {
          console.log("onReady");
        },
        onPaymentCompleted: (component, paymentResponse) => {
          // Handle payment success
          router.push("/success");
        },
        onChange: (component) => {
          console.log(
            `onChange() -> isValid: "${component.isValid()}" for "${
              component.type
            }"`
          );
        },
        onError: (component, error) => {
          // Handle payment error
          console.error("Payment error:", error);
        },
      });

      // Create and mount the payments component
      const flowComponent = cko.create("flow");
      setPayments(flowComponent);
      flowComponent.mount("#payments");
    }

    initializePayment();

    // Cleanup function to unmount the payments component
    return () => {
      if (payments) {
        flowComponent.unmount(); // Call the unmount method to clean up
      }
    };
  }, [router, payments]);

  return (
    <div>
      <form id="payment-form">
        <div className="payments-container">
          <div id="payments"></div>{" "}
          {/* This element will host the payment UI */}
        </div>
      </form>
    </div>
  );
}
