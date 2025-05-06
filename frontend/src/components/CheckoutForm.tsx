import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

import { CreditCardIcon } from 'lucide-react';

export const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order_completed`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "An error occurred with your payment.");
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "accordion" as const
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
                <h2 className="font-bold mb-4 flex items-center mt-6">
                  <CreditCardIcon className="h-5 w-5 mr-2" />
                  Payment Information
                </h2>
      <PaymentElement id="payment-element" options={paymentElementOptions} className='mt-3' />
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}