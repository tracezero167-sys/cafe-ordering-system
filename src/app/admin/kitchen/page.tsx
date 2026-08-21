"use client"

import { useState, useEffect } from "react"
import { Clock, CheckCircle, XCircle, ChefHat, Bell, Filter, RefreshCw } from "lucide-react"
import { prisma } from "@/lib/prisma"

interface Order {
  id: string
  orderNumber: string
  status: string
  createdAt: Date
  table: {
    id: string
    tableNumber: number
    name: string
  }
  customer: {
    name: string
    whatsappNumber: string
  }
  items: Array<{
    id: string
    quantity: number
    product: {
      name: string
    }
  }>
  totalAmount: number
  paymentMethod: string
  specialInstructions?: string
}

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "PREPARING" | "READY">("ALL")
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    fetchOrders()
    
    let interval: NodeJS.Timeout
    if (autoRefresh) {
      interval = setInterval(fetchOrders, 10000) // Refresh every 10 seconds
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh, filter])

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/orders?status=${filter}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        fetchOrders()
      }
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const filteredOrders = orders.filter(order => {
    if (filter === "ALL") return true
    return order.status === filter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-700 border-yellow-300"
      case "CONFIRMED": return "bg-blue-100 text-blue-700 border-blue-300"
      case "PREPARING": return "bg-amber-100 text-amber-700 border-amber-300"
      case "READY": return "bg-green-100 text-green-700 border-green-300"
      case "SERVED": return "bg-gray-100 text-gray-700 border-gray-300"
      default: return "bg-gray-100 text-gray-700 border-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING": return <Clock className="h-4 w-4" />
      case "CONFIRMED": return <CheckCircle className="h-4 w-4" />
      case "PREPARING": return <ChefHat className="h-4 w-4" />
      case "READY": return <CheckCircle className="h-4 w-4" />
      case "SERVED": return <CheckCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kitchen Orders</h1>
          <p className="text-gray-500">Manage and track orders in real-time</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`p-2 rounded-lg transition-colors ${
              autoRefresh ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
            }`}
            title={autoRefresh ? "Auto-refresh enabled" : "Auto-refresh disabled"}
          >
            <RefreshCw className={`h-5 w-5 ${autoRefresh ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {["ALL", "PENDING", "PREPARING", "READY"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filter === status
                ? "bg-amber-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-500">
            {filter === "ALL" ? "No orders at the moment" : `No ${filter.toLowerCase()} orders`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Order Header */}
              <div className={`p-4 border-b border-gray-200 ${getStatusColor(order.status)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className="font-bold text-lg">{order.orderNumber}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-medium">Table {order.table.tableNumber}</span>
                  <span className="text-gray-600">{order.customer.name}</span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4">
                <div className="space-y-2 mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <span className="text-gray-900">
                        {item.product.name} × {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {order.specialInstructions && (
                  <div className="bg-amber-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Note:</span> {order.specialInstructions}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-gray-600">Total</span>
                  <span className="font-bold">₹{order.totalAmount.toFixed(2)}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {order.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => updateOrderStatus(order.id, "CONFIRMED")}
                        className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, "CANCELLED")}
                        className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {order.status === "CONFIRMED" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "PREPARING")}
                      className="flex-1 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                    >
                      Start Preparing
                    </button>
                  )}

                  {order.status === "PREPARING" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "READY")}
                      className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Mark Ready
                    </button>
                  )}

                  {order.status === "READY" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "SERVED")}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Mark Served
                    </button>
                  )}
                </div>
              </div>

              {/* Order Footer */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{new Date(order.createdAt).toLocaleTimeString()}</span>
                  <span className="capitalize">{order.paymentMethod.toLowerCase()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
