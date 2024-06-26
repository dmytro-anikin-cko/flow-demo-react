"use client";
import { useEffect, useRef, useState } from "react";
import { loadCheckoutWebComponents } from "@checkout.com/checkout-web-components";
import { useRouter } from "next/navigation";
import Loader from "@/UI/Loader";
import { Router } from "next/router";
import { appearance } from "@/constants/constants";

export default function Flow() {
  const router = useRouter();

  // const paymentsRef = useRef(null); // Using ref to store the flowComponent instance
  const [loading, setLoading] = useState(true); // State to track loading
  const [error, setError] = useState(null); // State to track errors

  const [language, setLanguage] = useState(null);
  const [languageLoaded, setLanguageLoaded] = useState(false); // State to track if language is loaded

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage);
    } else {
      setLanguage("en"); // Default to English if no language is set
    }
    setLanguageLoaded(true); // Mark language as loaded
  }, []);
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
          onReady: () => {
            console.log("onReady");
            setLoading(false);
          },
          onPaymentCompleted: (component, paymentResponse) => {
            // Redirect to success page
            router.push("/payment-success");
          },
          // onChange: (component) => {
          //   console.log(
          //     `onChange() -> isValid: "${component.isValid()}" for "${
          //       component.type
          //     }"`
          //   );
          // },
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

        console.log("Flow component:", flowComponent);
        // paymentsRef.current = flowComponent;
        // console.log("Ref:", paymentsRef.current);
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

    // const handleRouteChange = () => {
    //   if (paymentsRef.current) {
    //     paymentsRef.current.unmount();
    //     paymentsRef.current = null;
    //   }
    // };

    // Router.events.on("routeChangeStart", handleRouteChange);

    if (languageLoaded) {
      initializePayment();
    }

    // return () => {
    //   // Router.events.off("routeChangeStart", handleRouteChange);
    //   console.log("Before clean up:", paymentsRef.current);
    //   if (paymentsRef.current) {
    //     console.log("Running cleanup");
    //     paymentsRef.current.unmount(); // Access and unmount the flowComponent instance
    //     paymentsRef.current = null; // Reset the ref
    //   }
    // };
  }, [languageLoaded, router]);

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
