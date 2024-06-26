"use client";
import { useEffect, useState, useRef } from "react";
import { loadCheckoutWebComponents } from "@checkout.com/checkout-web-components";
import { useRouter } from "next/navigation";
import Loader from "@/UI/Loader";
import { appearance } from "@/constants/constants";

export default function Flow({ language }) {
  const router = useRouter();

  const paymentsRef = useRef(null);
  const [loading, setLoading] = useState(true); // State to track loading
  const [error, setError] = useState(null); // State to track errors

  async function initializePayment() {
    console.log("initializePayment called✅");

    try {
      const orderResponse = await fetch("/api/payment-session", {
        method: "POST",
      });
      const paymentSession = await orderResponse.json();
  
      if (!orderResponse.ok) {
        console.error("Error creating payment session", paymentSession);
        setLoading(false);
        return;
      } else {
        console.log("paymentSession:", paymentSession);
      }
      
      console.log("Before loadCheckoutWebComponents", language);

      try {
        // Usage: README file https://www.npmjs.com/package/checkout-web-components?activeTab=code
        const cko = await loadCheckoutWebComponents({
          publicKey: "pk_sbox_ffrilzleqqiso6zphoa6dmpr7eo",
          environment: "sandbox",
          locale: language,
          appearance,
          paymentSession,
        })

        console.log("CKO:", cko);

  
        // Create and mount the payments component
        const flowComponent = cko.create("flow", {
          onReady: (component) => {
            console.log("onReady", component);
            setLoading(false);
          },
          onPaymentCompleted: (component, paymentResponse) => {
            // Redirect to success page
            router.push("/payment-success");
          },
          onError: (component, error) => {
            console.error("Payment error:", error);
            setLoading(false);
            setError("Payment error occurred");

            // Redirect to failure page
            router.push("/payment-failure");
          },
        });

        // Check if FlowComponent can be rendered
        const isAvailable = await flowComponent.isAvailable(); 
        if (!isAvailable) {
          console.error("FlowComponent is not available");
          setLoading(false);
          setError("FlowComponent is not available");
          return;
        } else {
          console.log("isAvailable:", isAvailable);
        }

        paymentsRef.current = flowComponent;
        // Mount Flow Component
        flowComponent.mount("#payments");
      } catch (sdkError) {
        console.error("Error loading Checkout Web Components SDK:", sdkError);
        setLoading(false);
        setError("Error loading Checkout Web Components SDK");
      }

    } catch (error) {
      console.error("Error initializing payment:", error);
      setLoading(false);
      setError("Error initializing payment");
    }
  }

  useEffect(() => {

    const existingScript = document.querySelector(`script[src="https://checkout-web-components.checkout.com/index.js"]`);
    if (existingScript) { existingScript.remove() }

    initializePayment();

    return () => {

      if (paymentsRef.current) {
        console.log("Unmounting FlowComponent");
        paymentsRef.current.unmount();
        paymentsRef.current = null;
      }
    };
  }, [language, router]);

  return (
    <div>
      {loading && <Loader />}
      {error && <div className="error">{error}</div>}
      <form id="payment-form">
        <div className="payments-container">
          <div id="payments"></div>
        </div>
      </form>
    </div>
  );
}
