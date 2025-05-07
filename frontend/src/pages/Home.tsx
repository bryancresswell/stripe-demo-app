import React, { useState, useEffect } from 'react'
import { ProductCard } from '../components/ProductCard'
import axios from 'axios';
import { Product } from '../context/CartContext';

export const Home = () => {
  const [selectedType, setSelectedType] = useState<'book' | 'accessory' | null>(
    null,
  )

  const [catalog, setCatalog] = useState<Product[]>([]);

  useEffect(() => {
    
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stripe/products`)
      .then(response => {
        console.log(response.data);
        setCatalog(response.data);
      })
      .catch(error => {
        console.error('Failed to fetch products:', error);
      });
  }, []);
  
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl text-gray-600 font-bold mb-2">Our Collection</h2>
        <p className="text-gray-600">
          We'll help you find your favourite books.
        </p>
      </div>
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {catalog.length > 0 ? (
              catalog.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-8">
                Loading products...
              </div>
            )}
          </div>
        </div>
      </div>
  )
}
