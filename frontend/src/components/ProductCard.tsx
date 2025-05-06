import { ShoppingCartIcon } from 'lucide-react'
import { Product, useCart } from '../context/CartContext'

export const ProductCard = (product: Product) => {

    const formatGenre = (genre: string) => {
        if (!genre) return '';
        return genre
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
    }

    const { addToCart } = useCart()
    return (
        <div className="border border-gray-300 rounded-md overflow-hidden hover:shadow-md transition-shadow">
          <div className="bg-gray-200 m-auto mt-6 mb-6 flex items-center justify-center" style={{ width: '180px', height: '271px', overflow: 'hidden' }}>
            <img
              src={`https://covers.openlibrary.org/b/isbn/${product.metadata.isbn}-M.jpg`}
              alt={product.name}
              style={{ width: '180px', height: '271px', objectFit: 'cover', display: 'block' }}
              className="border border-black-800"
            />
          </div>
          <hr></hr>
          <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-1">{product.metadata.author}</p>
            <p className="text-sm text-gray-600 mb-2"><strong>Genre:</strong> {formatGenre(product.sub_type)}</p>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-sm text-gray-600 flex items-center">
                <span className="font-semibold">{product.average_rating}/5</span>
                <span className="ml-1 text-xs text-gray-500">Rating</span>
              </span>
              <span className="text-sm text-gray-600 flex items-center">
                <span className="font-semibold">{product.num_reviews}</span>
                <span className="ml-1 text-xs text-gray-500">Reviews</span>
              </span>
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="font-medium">${product.price}</span>
              <button
                onClick={() => addToCart(product)}
                className="flex items-center justify-center border border-gray-500 rounded px-2 py-1 hover:bg-gray-100"
              >
                <ShoppingCartIcon className="h-4 w-4 mr-1 text-white" />
                <span className="text-sm text-white" >Add</span>
              </button>
            </div>
          </div>
        </div>
      )
}