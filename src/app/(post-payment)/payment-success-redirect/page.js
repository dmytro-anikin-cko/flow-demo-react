"use client"

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Loader from '@/UI/Loader';
import Link from 'next/link';

function PaymentSuccessComponent() {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  const paymentId = searchParams.get('cko-payment-id');
  const paymentSessionId = searchParams.get('cko-payment-session-id');
  const sessionId = searchParams.get('cko-session-id');
  
  console.log("paymentId:", paymentId);
  console.log("paymentSessionId:", paymentSessionId);
  console.log("sessionId:", sessionId);

  async function fetchPaymentDetails(paymentId) {
    const response = await fetch(`/api/getPaymentDetails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentId, sessionId
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch payment details');
    }
    const paymentData = await response.json();
    console.log(paymentData);
    return paymentData;
  }

  useEffect(() => {
    if (paymentId) {
      fetchPaymentDetails(paymentId)
        .then(setPaymentDetails)
        .catch((error) => setError(error.message))
        .finally(() => setLoading(false));
    } else {
      setError('Payment ID not provided');
      setLoading(false);
    }
  }, [paymentId]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Payment Success🎉</h1>
      {paymentDetails && (
        <div>
          <p>Thank you for your order number {paymentDetails.reference}, you paid with your {paymentDetails.source.scheme} ending in {paymentDetails.source.last4}.</p>
          <p><Link className="link link-primary" href="/">Home</Link></p>
        </div>
      )}
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<Loader />}>
      <PaymentSuccessComponent />
    </Suspense>
  );
}