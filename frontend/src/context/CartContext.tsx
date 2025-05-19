import { useState, createContext, useContext } from 'react'

export type Product = {
    description: string,
    type: string,
    sub_type: string,
    name: string,
    url: string,
    image_url: string,
    price: string,
    available_stock: number,
    status: string,
    id: number,
    metadata: Record<string, any>,
    average_rating: number,
    num_reviews: number
}

export type CartItem = {
    product: Product,
    quantity: number 
}

type CartContextType = {
    items: CartItem[]
    addToCart: (product: Product) => void
    removeFromCart: (productId: number) => void
    updateQuantity: (productId: number, quantity: number) => void
    clearCart: () => void
    getTotalItems: () => number
    getTotalPrice: () => number
    getTotalTax: () => number
    getTotalShipping: () => number
    getFinalCheckoutAmount: () => number
  }

const TAX_RATE: number = 0.09
const SHIPPING_FEE: number = 4.99


const CartContext = createContext<CartContextType | undefined>(undefined)
export const CartProvider: React.FC<{
children: React.ReactNode
}> = ({ children }) => {
const [items, setItems] = useState<CartItem[]>([])
const addToCart = (product: Product) => {
    setItems((prevItems) => {
    const existingItem = prevItems.find(
        (item) => item.product.id === product.id,
    )
    if (existingItem) {
        return prevItems.map((item) =>
        item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
            }
            : item,
        )
    }
    return [
        ...prevItems,
        {
        product,
        quantity: 1,
        },
    ]
    })
}
const removeFromCart = (productId: number) => {
    setItems((prevItems) =>
    prevItems.filter((item) => item.product.id !== productId),
    )
}
const updateQuantity = (productId: number, quantity: number) => {
    setItems((prevItems) =>
    prevItems.map((item) =>
        item.product.id === productId
        ? {
            ...item,
            quantity: Math.max(1, quantity),
            }
        : item,
    ),
    )
}
const clearCart = () => {
    setItems([])
}
const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
}
const getTotalPrice = () => {
    return items.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0,
    )
}

const getTotalTax = () => {
    return items.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity * TAX_RATE,
    0,
    )
}

// Hardcode shipping fee
const getTotalShipping = () => {
    return SHIPPING_FEE;
}

// Final checkout amount helper
const getFinalCheckoutAmount = () => {
    return Number((getTotalPrice() + getTotalTax() + getTotalShipping()).toPrecision(4));
}

return (
    <CartContext.Provider
    value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        getTotalTax,
        getTotalShipping,
        getFinalCheckoutAmount,
    }}
    >
    {children}
    </CartContext.Provider>
)
}
export const useCart = () => {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
  