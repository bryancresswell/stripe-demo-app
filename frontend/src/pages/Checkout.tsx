import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShippingForm } from '../components/ShippingForm'
import { CheckoutForm } from '../components/CheckoutForm'
import { useCart } from '../context/CartContext'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { ArrowRightIcon, CheckIcon, CreditCardIcon } from 'lucide-react'
import axios from 'axios';

  
const stripePromise = loadStripe("pk_test_51RKj6v2e7Lu3w2SgOqSuWvhfmVJt8rDPSoBGq9wiohgL2KSMrdWPKYn8PQKsQOXZJMMUJrAgrHuwOhia1wf8LNHH00I5mIBlDA") 

export const Checkout = () => {

  const { items, getTotalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clientSecret, setClientSecret] = useState("")
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment'>(
    'shipping',
  )

  const [selectedCountry, setSelectedCountry] = useState('')
  const COUNTRIES_WITH_STATES = ['US', 'CA', 'AU', 'IN']


  const appearance = {
    theme: "stripe" as const
  }

  const loader = "auto";

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    country: '',
    city: '',
    state: '',
    zipCode: '',
    email: '',
    phone: '',
})

const validateShippingInfo = () => {
    const requiresState = COUNTRIES_WITH_STATES.includes(selectedCountry)
    return (
        shippingInfo.firstName &&
        shippingInfo.lastName &&
        shippingInfo.address &&
        shippingInfo.city &&
        (!requiresState || shippingInfo.state) &&
        shippingInfo.zipCode &&
        shippingInfo.email &&
        shippingInfo.phone
    )
    }
    
  // Form state
  const handlePaymentCheckout = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateShippingInfo() && currentStep === 'shipping') {
        // here is where i call backend
        axios.post('http://localhost:3000/api/payments', {
            "amount": getTotalPrice(),
            "currency": "SGD",
            shippingInfo,
            items,
            "order_id": 1
        })
        .then(response => {
            setClientSecret(response.data.client_secret);
            setCurrentStep('payment');
        })
        .catch(error => {
            console.error("Error fetching data:", error)
        }) 
      
    } else if (currentStep === 'payment') {
        const stripePaymentForm = document.getElementById('payment-form');
        if (stripePaymentForm) {
            stripePaymentForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
        
    }
  }

  useEffect(() => {
    if (items.length === 0) {
        navigate('/')
    }
  }, [items.length, navigate])

  return (
    <div className="max-w-5xl mx-auto text-black">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        <div>
        <ShippingForm 
            currentStep={currentStep} 
            shippingInfo={shippingInfo} 
            setShippingInfo={setShippingInfo}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
        />
        { clientSecret && (
        <Elements options={{clientSecret, appearance, loader}} stripe={stripePromise}>
            <CheckoutForm /> 
        </Elements>
        )}
    </div>
      <div className="lg:w-80 mt-8 lg:mt-0">
            <div className="border border-gray-300 rounded-md p-4 sticky top-4">
              <h2 className="font-bold mb-4">Order Summary</h2>
              <div className="max-h-60 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex py-2 border-b border-gray-200 last:border-0"
                  >
                    <div className="w-10 h-10 bg-gray-200 flex items-center justify-center flex-shrink-0 mr-3">
                    <img
                        src={`https://covers.openlibrary.org/b/isbn/${item.product.metadata.isbn}-S.jpg`}
                        alt={item.product.name}
                        style={{ width: '25px', height: '38px', objectFit: 'cover', display: 'block' }}
                        />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      ${(Number(item.product.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              {/* Cost Breakdown */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>$4.99</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(getTotalPrice() * 0.08).toFixed(2)}</span>
                </div>
              </div>
              {/* Total */}
              <div className="border-t border-gray-300 pt-3 mb-4">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>
                    $
                    {(getTotalPrice() + 4.99 + getTotalPrice() * 0.08).toFixed(
                      2,
                    )}
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                    handlePaymentCheckout(e)
                }}
                disabled={isSubmitting}
                className="w-full text-white flex items-center justify-center border border-gray-700 bg-gray-800 rounded-md py-2 px-4 hover:bg-gray-700 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>Processing...</>
                ) : currentStep === 'shipping' ? (
                  <>
                    Proceed to Payment
                    <ArrowRightIcon className="text-white h-4 w-4 ml-2" />
                  </>
                ) : (
                  <>
                    Place Order
                    <CheckIcon className="text-white h-4 w-4 ml-2" />
                  </>
                )}
              </button>
            </div>
        </div>
    </div>
    </div>
  )
}