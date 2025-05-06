import { MinusIcon, PlusIcon, XIcon } from 'lucide-react'
import { CartItem as CartItemType, useCart } from '../context/CartContext'

export const CartItem = ({ item }: { item: CartItemType }) => {
  const { updateQuantity, removeFromCart } = useCart()
  const { product, quantity } = item
  return (
    <div className="flex items-center py-4 border-b border-gray-200">
      <div className="w-20 h-20 bg-gray-200 flex items-center justify-center flex-shrink-0 mr-4">
        <img
          src={`https://covers.openlibrary.org/b/isbn/${product.metadata.isbn}-S.jpg`}
          alt={product.name}
          style={{ width: '38px', height: '58px', objectFit: 'cover', display: 'block' }}
          className="border border-black-800"
        />
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-700 mt-1">
          ${Number(product.price).toFixed(2)}
        </p>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => updateQuantity(product.id, quantity - 1)}
          className="px-2 py-1 border-r text-white border-gray-300 hover:bg-gray-100"
        >
          <MinusIcon className="h-4 w-4" />
        </button>
        <span className="px-3 py-1 text-black">{quantity}</span>
        <button
          onClick={() => updateQuantity(product.id, quantity + 1)}
          className="px-2 py-1 border-l text-white border-gray-300 hover:bg-gray-100"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="w-24 text-center text-black font-medium mx-4">
        ${(Number(product.price) * quantity).toFixed(2)}
      </div>
      <button
        onClick={() => removeFromCart(product.id)}
        className="p-1 hover:bg-gray-100 rounded"
      >
        <XIcon className="h-5 w-5 text-white" />
      </button>
    </div>
  )
}
