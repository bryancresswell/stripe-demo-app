import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircleIcon, HomeIcon, BookIcon, XCircleIcon } from 'lucide-react'
import { useStripe } from "@stripe/react-stripe-js";
import axios from 'axios';

export const OrderConfirmation = () => {

  const stripe = useStripe()

  const apiBaseUrl = import.meta.env.REACT_APP_API_BASE_URL

  const [orderNumber, setOrderNumber] = useState('');

  const [paymentIntentId, setPaymentIntentId] = useState('');

  const [clientSecret, setClientSecret] = useState('');

  const [paymentStatus, setPaymentStatus] = useState<'succeeded' | 'failed' | 'requires_action' | 'requires_payment_method' | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const secret = params.get('payment_intent_client_secret');
    if (secret) {
      setClientSecret(secret);
    }
  }, []);

  const getNextOrderNumber = async () => {
    // Fetch the latest order number from backend and increment
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stripe/orders`);
    // orders is always an array with the most recent order (or empty)
    if (res.data.length > 0 && res.data[0].length > 0) {
      return 'BA-000001'
    }
    const latestOrder = res.data[0][0];
    let num = parseInt(latestOrder.replace('BA-', '').padStart(6, '0'), 10);
    const nextNum = (num + 1).toString().padStart(6, '0');
    console.log(nextNum)
    return `BA-${nextNum}`;
  };

  useEffect(() => {
    const checkPayment = async () => {
      if (!stripe || !clientSecret) return;
      const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
      setPaymentStatus(paymentIntent?.status === 'succeeded' ? 'succeeded' : 'failed');
    if (paymentIntent && paymentIntent.status === 'succeeded') {
    // store order in db
    (async () => {
        if (!orderNumber) {
            const currentOrderNumber = (await getNextOrderNumber());
            setOrderNumber(currentOrderNumber);
            setPaymentIntentId(paymentIntent.id);
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/stripe/orders`, {
                id: currentOrderNumber,
                payment_intent_id: paymentIntent.id,
                status: 'confirmed',
                total_amount: paymentIntent.amount,
                currency: paymentIntent.currency
            });
        }
        })();
     }
    };
    checkPayment();
  }, [stripe, clientSecret]);

    
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="border border-gray-300 rounded-md p-8">
        {paymentStatus === null ? (
          <div>
            <div className="flex justify-center mb-4">
              <svg className="animate-spin h-10 w-10 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Checking your payment...</h1>
            <p className="text-gray-600 mb-6">
              Please wait while we confirm your order.
            </p>
          </div>
        ) : paymentStatus === 'succeeded' ? (
          <>
            <div className="flex justify-center mb-4">
              <CheckCircleIcon className="h-16 w-16 text-gray-700" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. We've received your order.
            </p>
            <div className="flex justify-between items-center bg-gray-100 rounded-md p-4 mb-8">
                <div className="flex-1 flex flex-col items-center">
                    <p className="font-medium mb-1 text-sm text-center">Order Number</p>
                    <p className="font-bold text-base text-center">{orderNumber}</p>
                </div>
                <div className="flex-1 flex flex-col items-center border-l border-gray-300 pl-6 ml-6">
                    <p className="font-medium mb-1 text-sm text-center">Stripe Payment Reference</p>
                    <p className="font-bold text-base text-center">{paymentIntentId}</p>
                </div>
            </div>
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h2 className="font-bold mb-3">What happens next?</h2>
              <div className="text-left space-y-4">
                <div className="flex">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Order Processing</p>
                    <p className="text-sm text-gray-600">
                      We're preparing your order for shipment.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Order Shipped</p>
                    <p className="text-sm text-gray-600">
                      You'll receive a shipping confirmation email with tracking
                      details.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Delivery</p>
                    <p className="text-sm text-gray-600">
                      Your order will be delivered to your shipping address.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-x-4">
              <Link
                to="/"
                className="inline-flex items-center border border-gray-500 rounded-md py-2 px-4 hover:bg-gray-100"
              >
                <HomeIcon className="h-4 w-4 mr-2" />
                Return Home
              </Link>
              <Link
                to="/"
                className="inline-flex items-center border border-gray-500 rounded-md py-2 px-4 hover:bg-gray-100"
              >
                <BookIcon className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </div>
          </>
        ) : paymentStatus === 'requires_action' ? (
          <>
            <div className="flex justify-center mb-4">
              <svg className="h-16 w-16 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Action Required</h1>
            <p className="text-gray-600 mb-6">
              Your payment requires additional action. Please check your email or payment provider to complete the process.
            </p>
            <div className="space-x-4">
              <Link
                to="/"
                className="inline-flex items-center border border-gray-500 rounded-md py-2 px-4 hover:bg-gray-100"
              >
                <HomeIcon className="h-4 w-4 mr-2" />
                Return Home
              </Link>
            </div>
          </>
        ) : paymentStatus === 'requires_payment_method' || paymentStatus === 'failed' ? (
          <>
            <div className="flex justify-center mb-4">
              <XCircleIcon className="h-16 w-16 text-gray-700" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Declined</h1>
            <p className="text-gray-600 mb-6">
              Your payment could not be completed. Please try again with a different payment method.
            </p>
            <div className="space-x-4">
              <Link
                to="/"
                className="inline-flex items-center border border-gray-500 rounded-md py-2 px-4 hover:bg-gray-100"
              >
                <HomeIcon className="h-4 w-4 mr-2" />
                Return Home
              </Link>
              <Link
                to="/"
                className="inline-flex items-center border border-gray-500 rounded-md py-2 px-4 hover:bg-gray-100"
              >
                <BookIcon className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <XCircleIcon className="h-16 w-16 text-gray-700" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Unknown Payment Status</h1>
            <p className="text-gray-600 mb-6">
              We couldn't determine your payment status. Please contact support or try again.
            </p>
            <div className="space-x-4">
              <Link
                to="/"
                className="inline-flex items-center border border-gray-500 rounded-md py-2 px-4 hover:bg-gray-100"
              >
                <HomeIcon className="h-4 w-4 mr-2" />
                Return Home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}