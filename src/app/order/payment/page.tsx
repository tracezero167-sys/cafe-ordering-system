"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, Wallet, ArrowLeft, Check, QrCode } from "lucide-react"

export default function PaymentPage() {
  const router = useRouter()
  
  const [cart, setCart] = useState<any[]>([])
  const [customerInfo, setCustomerInfo] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE" | "">("")
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadData()
  }, [])

  const loadData = () => {
    const savedCart = sessionStorage.getItem("cart")
    const savedCustomerInfo = sessionStorage.getItem("customerInfo")
    
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (e) {
        console.error("Error parsing cart:", e)
      }
    }
    
    if (savedCustomerInfo) {
      try {
        setCustomerInfo(JSON.parse(savedCustomerInfo))
      } catch (e) {
        console.error("Error parsing customer info:", e)
      }
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.05 // 5% tax
  const total = subtotal + tax

  const handlePaymentMethodSelect = (method: "COD" | "ONLINE") => {
    setPaymentMethod(method)
  }

  const handleOnlinePayment = () => {
    setLoading(true)
    sessionStorage.setItem("paymentMethod", "ONLINE")
    
    // Generate WhatsApp message with bill details
    const billMessage = `🧾 *ORDER BILL*
━━━━━━━━━━━━━━━━━━
👤 *Customer:* ${customerInfo.name}
📱 *Phone:* ${customerInfo.phone}
🪑 *Table:* ${customerInfo.tableNumber}
━━━━━━━━━━━━━━━━━━
📦 *ORDER ITEMS:*
${cart.map((item, index) => `${index + 1}. ${item.name} x${item.quantity} - ₹${item.price * item.quantity}`).join('\n')}
━━━━━━━━━━━━━━━━━━
💰 *PAYMENT SUMMARY:*
• Subtotal: ₹${subtotal.toFixed(2)}
• Tax (5%): ₹${tax.toFixed(2)}
• *TOTAL: ₹${total.toFixed(2)}*
━━━━━━━━━━━━━━━━━━
✅ *Payment Method:* Online (UPI)
🙏 Thank you for your order!`
    
    // Open WhatsApp with the bill message
    const whatsappUrl = `https://wa.me/91${customerInfo.phone.replace(/\D/g, '')}?text=${encodeURIComponent(billMessage)}`
    window.open(whatsappUrl, '_blank')
    
    router.push('/order/confirmation')
    setLoading(false)
  }

  const handleCODPayment = async () => {
    setLoading(true)
    sessionStorage.setItem("paymentMethod", "COD")
    
    // Generate WhatsApp message with bill details
    const billMessage = `🧾 *ORDER BILL*
━━━━━━━━━━━━━━━━━━
👤 *Customer:* ${customerInfo.name}
📱 *Phone:* ${customerInfo.phone}
🪑 *Table:* ${customerInfo.tableNumber}
━━━━━━━━━━━━━━━━━━
📦 *ORDER ITEMS:*
${cart.map((item, index) => `${index + 1}. ${item.name} x${item.quantity} - ₹${item.price * item.quantity}`).join('\n')}
━━━━━━━━━━━━━━━━━━
💰 *PAYMENT SUMMARY:*
• Subtotal: ₹${subtotal.toFixed(2)}
• Tax (5%): ₹${tax.toFixed(2)}
• *TOTAL: ₹${total.toFixed(2)}*
━━━━━━━━━━━━━━━━━━
✅ *Payment Method:* Cash on Delivery
🙏 Thank you for your order!`
    
    // Open WhatsApp with the bill message
    const whatsappUrl = `https://wa.me/91${customerInfo.phone.replace(/\D/g, '')}?text=${encodeURIComponent(billMessage)}`
    window.open(whatsappUrl, '_blank')
    
    router.push('/order/confirmation')
    setLoading(false)
  }

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  if (!customerInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No order found</h3>
          <button
            onClick={() => router.push('/order')}
            className="px-6 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
          >
            Start Order
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Select Payment Method</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h3>
            
            <button
              onClick={() => handlePaymentMethodSelect("COD")}
              className={`w-full p-6 rounded-xl border-2 transition-all ${
                paymentMethod === "COD"
                  ? "border-amber-500 bg-amber-50"
                  : "border-gray-200 bg-white hover:border-amber-300"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  paymentMethod === "COD" ? "bg-amber-100" : "bg-gray-100"
                }`}>
                  <Wallet className={`h-6 w-6 ${
                    paymentMethod === "COD" ? "text-amber-600" : "text-gray-600"
                  }`} />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-gray-900">Cash on Delivery</h4>
                  <p className="text-sm text-gray-500">Pay when you receive your order</p>
                </div>
                {paymentMethod === "COD" && (
                  <Check className="h-6 w-6 text-amber-600" />
                )}
              </div>
            </button>

            <button
              onClick={() => handlePaymentMethodSelect("ONLINE")}
              className={`w-full p-6 rounded-xl border-2 transition-all ${
                paymentMethod === "ONLINE"
                  ? "border-amber-500 bg-amber-50"
                  : "border-gray-200 bg-white hover:border-amber-300"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  paymentMethod === "ONLINE" ? "bg-amber-100" : "bg-gray-100"
                }`}>
                  <CreditCard className={`h-6 w-6 ${
                    paymentMethod === "ONLINE" ? "text-amber-600" : "text-gray-600"
                  }`} />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-gray-900">Online Payment</h4>
                  <p className="text-sm text-gray-500">UPI, PhonePe, Paytm, GPay, etc.</p>
                </div>
                {paymentMethod === "ONLINE" && (
                  <Check className="h-6 w-6 text-amber-600" />
                )}
              </div>
            </button>
          </div>

          {/* QR Code Display */}
          {paymentMethod === "ONLINE" && (
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <QrCode className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Scan QR Code to Pay</h3>
              <p className="text-gray-500 mb-4">Scan with any UPI app (PhonePe, Paytm, GPay, etc.)</p>
              
              {/* QR Code Image */}
              <img 
                src="/qr-code.jpeg" 
                alt="UPI QR Code" 
                className="w-64 h-64 mx-auto rounded-lg"
              />
              
              <div className="bg-amber-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">UPI ID:</p>
                <p className="text-lg font-bold text-gray-900">madhurpatidar9981@ybl</p>
              </div>

              <button
                onClick={handleOnlinePayment}
                disabled={loading}
                className="w-full mt-6 py-3 bg-amber-600 text-white font-medium rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "I have completed the payment"}
              </button>
            </div>
          )}

          {/* Customer Info Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mt-6">
            <h4 className="font-semibold text-gray-900 mb-2">Delivery Details</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Name:</span> {customerInfo.name}</p>
              <p><span className="font-medium">Phone:</span> {customerInfo.phone}</p>
              <p><span className="font-medium">Table:</span> {customerInfo.tableNumber}</p>
            </div>
          </div>

          {/* Submit Button for COD */}
          {paymentMethod === "COD" && (
            <button
              onClick={handleCODPayment}
              disabled={loading}
              className="w-full mt-6 py-4 bg-amber-600 text-white font-medium rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : `Confirm Order (COD)`}
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
