import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCartIcon, ArrowRightIcon } from 'lucide-react'
import { CartItem } from '../components/CartItem'
import { useCart } from '../context/CartContext'
export const Cart = () => {
  const { items, getTotalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="border border-dashed border-gray-300 rounded-md p-12">
          <ShoppingCartIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            to="/"
            className="inline-flex items-center border border-gray-500 rounded-md py-2 px-4 hover:bg-gray-100"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }
  return (
    <div className="max-w-4xl mx-auto">
      <p className="text-2xl text-black font-bold mb-6 flex items-center">
        <ShoppingCartIcon className="h-6 w-6 mr-2" />
        Your Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
      </p>
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="border-t border-gray-200">
            {items.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => clearCart()}
              className="text-sm border border-gray-300 text-white rounded-md py-1 px-3 hover:bg-gray-100"
            >
              Clear Cart
            </button>
            <button
              className="text-sm border border-gray-300 rounded-md py-1 px-3 hover:bg-gray-100"
            >
              <Link to='/'>Continue Shopping</Link>
            </button>
          </div>
        </div>
        {/* Cart Summary */}
        <div className="lg:w-80 mt-8 lg:mt-0 text-black">
          <div className="border border-gray-300 rounded-md p-4">
            <h2 className="font-bold mb-4">Order Summary</h2>
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
            <div className="border-t border-gray-300 pt-3 mb-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>
                  $
                  {(getTotalPrice() + 4.99 + getTotalPrice() * 0.08).toFixed(2)}
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center text-white justify-center border border-gray-700 bg-gray-800 rounded-md py-2 px-4 hover:bg-gray-700"
            >
              Checkout
              <ArrowRightIcon className="text-white h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
