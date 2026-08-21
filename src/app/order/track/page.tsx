"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Clock, CheckCircle, ChefHat, Truck, Home, RefreshCw, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function OrderTrackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get("orderId")
  
  const [orderData, setOrderData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    if (orderId) {
      fetchOrderData()
    }

    // Set up auto-refresh every 10 seconds
    let interval: NodeJS.Timeout
    if (autoRefresh && orderId) {
      interval = setInterval(fetchOrderData, 10000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [orderId, autoRefresh])

  const fetchOrderData = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setOrderData(data.order)
      } else {
        setError("Failed to load order information")
      }
    } catch (err) {
      setError("An error occurred while loading order information")
    } finally {
      setLoading(false)
    }
  }

  const statusSteps = [
    { key: "PENDING", label: "Order Received", description: "Your order has been received", icon: Clock, color: "blue" },
    { key: "CONFIRMED", label: "Order Confirmed", description: "Cafe has confirmed your order", icon: CheckCircle, color: "green" },
    { key: "PREPARING", label: "Preparing", description: "Your food is being prepared", icon: ChefHat, color: "amber" },
    { key: "READY", label: "Ready", description: "Your order is ready to serve", icon: CheckCircle, color: "green" },
    { key: "SERVED", label: "Served", description: "Your order has been served", icon: Truck, color: "green" }
  ]

  const currentStepIndex = statusSteps.findIndex(step => step.key === orderData?.status)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order information...</p>
        </div>
      </div>
    )
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
          <Clock className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-500 mb-4">{error || "Order not found"}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  const isOrderComplete = orderData.status === "SERVED" || orderData.status === "CANCELLED"

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Track Your Order</h1>
              <p className="text-gray-600">Order #{orderData.orderNumber}</p>
            </div>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-2 rounded-lg transition-colors ${
                autoRefresh ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
              }`}
              title={autoRefresh ? "Auto-refresh enabled" : "Auto-refresh disabled"}
            >
              <RefreshCw className={`h-5 w-5 ${autoRefresh ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Table:</span>
            <span className="font-medium">Table {orderData.table?.tableNumber}</span>
          </div>
        </div>

        {/* Order Status Timeline */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Status</h2>
          
          <div className="space-y-6">
            {statusSteps.map((step, index) => {
              const Icon = step.icon
              const isCompleted = index <= currentStepIndex
              const isCurrent = index === currentStepIndex
              const isPending = index > currentStepIndex
              
              return (
                <div key={step.key} className="relative">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-100' : isPending ? 'bg-gray-100' : 'bg-amber-100'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        isCompleted ? 'text-green-600' : isPending ? 'text-gray-400' : 'text-amber-600'
                      }`} />
                    </div>
                    <div className="flex-1 pt-2">
                      <p className={`font-medium ${
                        isCurrent ? 'text-amber-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {step.label}
                      </p>
                      <p className={`text-sm ${
                        isCurrent ? 'text-gray-700' : isCompleted ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {step.description}
                      </p>
                      {isCurrent && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="animate-pulse w-2 h-2 bg-amber-600 rounded-full"></div>
                          <span className="text-sm text-amber-600">In Progress</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {index < statusSteps.length - 1 && (
                    <div className={`ml-6 h-8 w-0.5 ${
                      index < currentStepIndex ? 'bg-green-300' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
          
          <div className="space-y-2 mb-4">
            {orderData.items?.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{item.product?.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <span className="font-medium">₹{item.totalPrice}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-lg font-bold pt-4 border-t border-gray-200">
            <span>Total</span>
            <span>₹{orderData.totalAmount?.toFixed(2)}</span>
          </div>
        </div>

        {/* Estimated Time */}
        {!isOrderComplete && (
          <div className="bg-amber-50 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-amber-600" />
              <div>
                <p className="font-medium text-gray-900">Estimated Time</p>
                <p className="text-gray-600">15-20 minutes from confirmation</p>
              </div>
            </div>
          </div>
        )}

        {/* Order Complete Message */}
        {isOrderComplete && (
          <div className="bg-green-50 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Order Complete!</p>
                <p className="text-green-700">Thank you for dining with us</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={fetchOrderData}
            className="w-full py-3 bg-amber-600 text-white font-medium rounded-xl hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-5 w-5" />
            Refresh Status
          </button>
          
          <button
            onClick={() => {
              sessionStorage.removeItem("cart")
              sessionStorage.removeItem("customerInfo")
              router.push("/")
            }}
            className="w-full py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </button>
        </div>

        {/* Special Instructions */}
        {orderData.specialInstructions && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Special Instructions</h2>
            <p className="text-gray-600">{orderData.specialInstructions}</p>
          </div>
        )}
      </div>
    </div>
  )
}
