"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Clock, ShoppingBag, ArrowLeft, Printer } from "lucide-react"

export default function OrderConfirmationPage() {
  const router = useRouter()
  
  const [cart, setCart] = useState<any[]>([])
  const [customerInfo, setCustomerInfo] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const [orderCreated, setOrderCreated] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadData()
  }, [])

  useEffect(() => {
    if (mounted && customerInfo && cart.length > 0 && !orderCreated) {
      // Create the order in database
      createOrder()
    }
  }, [mounted, customerInfo, cart, orderCreated])

  const loadData = () => {
    const savedCart = sessionStorage.getItem("cart")
    const savedCustomerInfo = sessionStorage.getItem("customerInfo")
    const savedPaymentMethod = sessionStorage.getItem("paymentMethod")
    
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (e) {
        console.error("Error parsing cart:", e)
      }
    }
    
    if (savedCustomerInfo) {
      try {
        const customer = JSON.parse(savedCustomerInfo)
        setCustomerInfo({ ...customer, paymentMethod: savedPaymentMethod })
      } catch (e) {
        console.error("Error parsing customer info:", e)
      }
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.05 // 5% tax
  const total = subtotal + tax

  const handlePrint = () => {
    window.print()
  }

  const handleNewOrder = () => {
    sessionStorage.removeItem("cart")
    sessionStorage.removeItem("customerInfo")
    sessionStorage.removeItem("paymentMethod")
    router.push('/menu')
  }

  const sendWhatsAppBill = async () => {
    try {
      const billText = generateBillText()
      const whatsappUrl = `https://wa.me/91${customerInfo.phone}?text=${encodeURIComponent(billText)}`
      window.open(whatsappUrl, '_blank')
    } catch (error) {
      console.error("Error sending WhatsApp message:", error)
    }
  }

  const generateBillText = () => {
    let text = `🧾 *BILL*\n\n`
    text += `👤 Customer: ${customerInfo.name}\n`
    text += `📱 Phone: ${customerInfo.phone}\n`
    text += `🪑 Table: ${customerInfo.tableNumber}\n`
    text += `💳 Payment: ${customerInfo.paymentMethod || 'COD'}\n\n`
    text += `📦 *Items:*\n`
    
    cart.forEach(item => {
      text += `• ${item.name} x${item.quantity} - ₹${item.price * item.quantity}\n`
    })
    
    text += `\n💰 *Summary:*\n`
    text += `Subtotal: ₹${subtotal.toFixed(2)}\n`
    text += `Tax (5%): ₹${tax.toFixed(2)}\n`
    text += `*Total: ₹${total.toFixed(2)}*\n\n`
    text += `Thank you for your order! 🙏`
    
    return text
  }

  const createOrder = async () => {
    try {
      // First, get the table ID from table number
      const tablesResponse = await fetch('/api/tables')
      const tablesData = await tablesResponse.json()
      let table = tablesData.tables.find((t: any) => t.tableNumber === customerInfo.tableNumber)
      
      // If table doesn't exist, create it
      if (!table) {
        const createTableResponse = await fetch('/api/tables', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tableNumber: customerInfo.tableNumber,
            capacity: 4,
            status: 'AVAILABLE'
          })
        })
        
        if (createTableResponse.ok) {
          const createdTable = await createTableResponse.json()
          table = createdTable.table
        } else {
          console.error('Failed to create table')
          return
        }
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableId: table.id,
          customerName: customerInfo.name,
          customerPhone: customerInfo.phone,
          customerEmail: customerInfo.email || null,
          items: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          })),
          paymentMethod: customerInfo.paymentMethod || 'COD',
          specialInstructions: null,
          subtotal,
          tax,
          serviceCharge: 0,
          total
        })
      })

      if (response.ok) {
        setOrderCreated(true)
        console.log('Order created successfully')
      } else {
        console.error('Failed to create order')
      }
    } catch (error) {
      console.error('Error creating order:', error)
    }
  }

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  if (!customerInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No order found</h3>
          <button
            onClick={() => router.push('/menu')}
            className="px-6 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
          >
            Start New Order
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Bill</h1>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
              <p className="text-gray-500">Thank you for your order!</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Customer</p>
              <p className="font-semibold text-gray-900">{customerInfo.name}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-semibold text-gray-900">{customerInfo.phone}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Table</p>
              <p className="font-semibold text-gray-900">{customerInfo.tableNumber}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Order Items</h3>
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.productId} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                </div>
                <p className="font-semibold text-gray-900">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-gray-900 text-lg">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-amber-600" />
            <div>
              <p className="font-medium text-gray-900">Estimated Preparation Time</p>
              <p className="text-gray-600">15-20 minutes</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={sendWhatsAppBill}
            className="flex-1 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors"
          >
            Send Bill via WhatsApp
          </button>
          <button
            onClick={handleNewOrder}
            className="flex-1 py-3 bg-amber-600 text-white font-medium rounded-xl hover:bg-amber-700 transition-colors"
          >
            New Order
          </button>
        </div>
      </main>
    </div>
  )
}
