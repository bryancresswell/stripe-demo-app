import { Link } from 'react-router-dom'
import {ShoppingCartIcon} from 'lucide-react'
import { useCart } from '../context/CartContext'


export const Navbar = () => {
  const { getTotalItems } = useCart()
  return (
    <nav className="border-b border-gray-300 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="font-bold text-xl">
              BooksActually
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <ShoppingCartIcon className='h-6 w-6 text-grey-700' />
              { getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-gray-700 text-xs rounded-full text-white h-5 w-5 flex items-center justify-center">
                  { getTotalItems() }
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
