"use client"

import { useState, useEffect } from "react"
import { Coffee, Utensils, Cake, Beef, ShoppingBag, Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface Product {
  id: string
  name: string
  price: number
  description: string | null
  foodType: string
}

interface Category {
  id: string
  name: string
  description: string | null
  products: Product[]
}

interface MenuContentProps {
  tableId: string
  categories: Category[]
  settings: any
  table: any
}

const categoryIcons: Record<string, any> = {
  Beverages: Coffee,
  Snacks: Utensils,
  "Main Course": Beef,
  Desserts: Cake,
  Momos: Utensils,
  "French Fries": Utensils,
  Pasta: Beef,
  Pizza: Beef,
  "Sweet Corn": Utensils,
  Burger: Beef,
  "Chow Mein": Utensils,
  Sandwich: Utensils,
  Maggi: Utensils,
  Coffee: Coffee,
  Tea: Coffee,
  "Chocolate Bowl": Cake
}

export default function MenuContent({ tableId, categories, settings, table }: MenuContentProps) {
  const router = useRouter()
  const [cart, setCart] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load cart from session storage
    const savedCart = sessionStorage.getItem("cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  const addToCart = (productId: string, name: string, price: number, foodType: string) => {
    const updatedCart = [...cart]
    const existingItemIndex = updatedCart.findIndex(item => item.productId === productId)
    
    if (existingItemIndex >= 0) {
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + 1
      }
    } else {
      updatedCart.push({
        productId,
        name,
        price,
        foodType,
        quantity: 1
      })
    }
    
    setCart(updatedCart)
    sessionStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const scrollToCategory = (categoryId: string) => {
    document.getElementById(`category-${categoryId}`)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">{settings?.cafeName || "Cafe"}</h1>
              <p className="text-sm text-gray-500">Table {table.tableNumber} • {table.name}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Category Navigation */}
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex gap-2 md:gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                className="flex-shrink-0 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:bg-amber-50 hover:border-amber-300 transition-colors whitespace-nowrap"
                onClick={() => scrollToCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search food..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-8">
          {categories.map((category) => {
            const Icon = categoryIcons[category.name] || Utensils
            
            return (
              <section key={category.id} id={`category-${category.id}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <Icon className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {category.products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-square bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                        <Coffee className="h-16 w-16 text-amber-300" />
                      </div>
                      <div className="p-3">
                        <div className="flex items-center gap-1 mb-1">
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                            product.foodType === 'VEG' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {product.foodType === 'VEG' ? '🟢' : '🔴'}
                          </span>
                          <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">{product.name}</h4>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2 mb-2 h-8">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-base font-bold text-gray-900">₹{product.price}</span>
                          <button 
                            type="button"
                            onClick={() => addToCart(product.id, product.name, product.price, product.foodType)}
                            className="px-3 py-1.5 bg-amber-600 text-white text-xs font-medium rounded-lg hover:bg-amber-700 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </main>

      {/* Sticky Cart Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => router.push(`/table/${tableId}/cart?tableId=${tableId}`)}
            className="w-full py-3 bg-amber-600 text-white font-medium rounded-xl hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag className="h-5 w-5" />
            <span>View Cart</span>
            <span className="bg-amber-700 px-2 py-0.5 rounded-full text-sm">
              {cartCount} item{cartCount !== 1 ? 's' : ''}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
