import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Cart } from './pages/Cart'
import { Checkout } from './pages/Checkout'
import { Navbar } from './components/Navbar'
import './App.css'
import { CartProvider } from './context/CartContext'
import { OrderConfirmation } from './pages/OrderConfirmation'
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51RKj6v2e7Lu3w2SgOqSuWvhfmVJt8rDPSoBGq9wiohgL2KSMrdWPKYn8PQKsQOXZJMMUJrAgrHuwOhia1wf8LNHH00I5mIBlDA");

const OrderConfirmationWrapper = () => {
  const params = new URLSearchParams(window.location.search);
  const clientSecret = params.get('payment_intent_client_secret');
  
  if (!clientSecret) return null;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <OrderConfirmation />
    </Elements>
  );
};

function App() {

  return (
    <>
    <BrowserRouter>
      <CartProvider>
    <div className='min-h-screen min-w-screen bg-white dark:bg-gray'>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order_completed" element={<OrderConfirmationWrapper />} />
            </Routes>
      </main>
    </div>
    </CartProvider>
      </BrowserRouter>
    </>
  )
}

export default App
