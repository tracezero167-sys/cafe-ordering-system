import { prisma } from "@/lib/prisma"
import { ArrowLeft, Clock, Users, MapPin, Phone, Check, X, ChefHat, Truck } from "lucide-react"
import Link from "next/link"
import { revalidatePath } from "next/cache"

async function getOrder(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      table: true,
      items: {
        include: {
          product: true
        }
      },
      statusHistory: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  return order
}

const statusConfig = {
  PENDING: { icon: Clock, color: "bg-yellow-100 text-yellow-700", label: "Pending" },
  CONFIRMED: { icon: Check, color: "bg-blue-100 text-blue-700", label: "Confirmed" },
  PREPARING: { icon: ChefHat, color: "bg-orange-100 text-orange-700", label: "Preparing" },
  READY: { icon: Truck, color: "bg-green-100 text-green-700", label: "Ready" },
  SERVED: { icon: Check, color: "bg-purple-100 text-purple-700", label: "Served" },
  COMPLETED: { icon: Check, color: "bg-gray-100 text-gray-700", label: "Completed" },
  CANCELLED: { icon: X, color: "bg-red-100 text-red-700", label: "Cancelled" }
}

async function updateOrderStatus(orderId: string, newStatus: string) {
  'use server'
  
  await prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus as any }
    }),
    prisma.orderStatusHistory.create({
      data: {
        orderId,
        status: newStatus as any,
        notes: `Status changed to ${newStatus}`
      }
    })
  ])

  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${orderId}`)
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await getOrder(id)

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Order not found</h2>
        <Link href="/admin/orders" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to Orders
        </Link>
      </div>
    )
  }

  const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
          <p className="text-gray-500 mt-1">Order details and management</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900">x{item.quantity}</span>
                        <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                      </div>
                      {item.specialInstructions && (
                        <p className="text-sm text-gray-500 mt-1">Note: {item.specialInstructions}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{item.totalPrice}</p>
                      <p className="text-sm text-gray-500">₹{item.unitPrice} each</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax ({((order.tax / order.subtotal) * 100).toFixed(1)}%)</span>
                  <span className="font-medium">₹{order.tax}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service Charge</span>
                  <span className="font-medium">₹{order.serviceCharge}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Order Status History</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {order.statusHistory.map((history, index) => (
                  <div key={history.id} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-full" />
                      {index < order.statusHistory.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 mt-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{history.status}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(history.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {history.notes && (
                        <p className="text-sm text-gray-500 mt-1">{history.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Order Status</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full ${statusConfig[order.status as keyof typeof statusConfig].color}`}>
                  <StatusIcon className="h-4 w-4" />
                  {statusConfig[order.status as keyof typeof statusConfig].label}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-3">Update Status:</p>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <form key={status} action={updateOrderStatus.bind(null, order.id, status)}>
                    <button
                      type="submit"
                      disabled={order.status === status}
                      className={`w-full flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                        order.status === status
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <config.icon className="h-4 w-4" />
                      {config.label}
                    </button>
                  </form>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Customer Info</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">{order.customer.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{order.customer.whatsappNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Table</p>
                  <p className="font-medium text-gray-900">{order.table.tableNumber} ({order.table.name})</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Payment Info</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Method</span>
                <span className="font-medium text-gray-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Amount</span>
                <span className="font-bold text-gray-900">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
