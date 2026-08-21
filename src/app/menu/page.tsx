"use client"

import { useState, useEffect } from "react"
import { Coffee, Utensils, Cake, Beef, ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"

interface Product {
  id: string
  name: string
  price: number
  description: string | null
  foodType: string
  image: string | null
}

interface Category {
  id: string
  name: string
  description: string | null
  products: Product[]
}

const categoryIcons = {
  Beverages: Coffee,
  Snacks: Utensils,
  "Main Course": Beef,
  Desserts: Cake
}

export default function MenuPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchData()
    loadCart()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      }
      
      const settingsResponse = await fetch('/api/settings')
      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json()
        setSettings(settingsData.settings)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadCart = () => {
    const savedCart = sessionStorage.getItem("cart")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (e) {
        console.error("Error parsing cart:", e)
      }
    }
  }

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
    alert(`${name} added to cart!`)
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  if (!mounted || loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{settings?.cafeName || "Cafe Menu"}</h1>
              <p className="text-sm text-gray-500">{settings?.address}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Menu</h2>
          <p className="text-gray-600">Delicious food and drinks made with love</p>
        </div>

        <div className="space-y-12">
          {categories.map((category) => {
            const Icon = categoryIcons[category.name as keyof typeof categoryIcons] || Utensils
            
            return (
              <section key={category.id} id={category.name.toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <Icon className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{category.name}</h3>
                    <p className="text-gray-500">{category.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-video bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center relative">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Icon className="h-16 w-16 text-amber-300" />
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{product.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            product.foodType === 'VEG' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {product.foodType}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                          <button 
                            type="button"
                            onClick={() => addToCart(product.id, product.name, product.price, product.foodType)}
                            className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
                          >
                            Add to Cart
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

        {categories.length === 0 && (
          <div className="text-center py-12">
            <Utensils className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Menu not available</h3>
            <p className="text-gray-500">Please check back later</p>
          </div>
        )}
      </main>

      {/* Sticky Cart Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => router.push('/cart')}
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
