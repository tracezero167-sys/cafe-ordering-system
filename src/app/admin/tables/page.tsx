import { prisma } from "@/lib/prisma"
import { Plus, QrCode, Users, MapPin, Download, Edit, Trash2, RefreshCw } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

async function getTables() {
  const tables = await prisma.table.findMany({
    include: {
      orders: {
        where: {
          status: {
            in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY']
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 1
      }
    },
    orderBy: { tableNumber: 'asc' }
  })

  return tables
}

const statusColors = {
  AVAILABLE: "bg-green-100 text-green-700 border-green-300",
  OCCUPIED: "bg-red-100 text-red-700 border-red-300",
  ORDERING: "bg-yellow-100 text-yellow-700 border-yellow-300",
  PREPARING: "bg-blue-100 text-blue-700 border-blue-300",
  NEEDS_ATTENTION: "bg-orange-100 text-orange-700 border-orange-300",
  DISABLED: "bg-gray-100 text-gray-700 border-gray-300"
}

const statusIcons = {
  AVAILABLE: "🟢",
  OCCUPIED: "🔴",
  ORDERING: "🟡",
  PREPARING: "🔵",
  NEEDS_ATTENTION: "🟠",
  DISABLED: "⚪"
}

export default async function TablesPage() {
  const tables = await getTables()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Table Management</h1>
          <p className="text-gray-500 mt-1">Manage your cafe tables and QR codes</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/tables/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Table
          </Link>
        </div>
      </div>

      {/* Status Legend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-4">
          {Object.entries(statusColors).map(([status, color]) => (
            <div key={status} className="flex items-center gap-2">
              <span className="text-lg">{statusIcons[status as keyof typeof statusIcons]}</span>
              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${color}`}>
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tables.map((table) => (
          <div key={table.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Table Header */}
            <div className={`p-4 border-b border-gray-100 ${statusColors[table.status as keyof typeof statusColors]}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{statusIcons[table.status as keyof typeof statusIcons]}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{table.name}</h3>
                    <p className="text-sm opacity-75">Table {table.tableNumber}</p>
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusColors[table.status as keyof typeof statusColors]}`}>
                {table.status}
              </span>
            </div>

            {/* Table Content */}
            <div className="p-4">
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>Capacity: {table.capacity} guests</span>
                </div>
                
                {table.orders.length > 0 && (
                  <div className="bg-amber-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-amber-900 mb-1">Active Order</p>
                    <p className="text-sm text-amber-700">{table.orders[0].orderNumber}</p>
                    <p className="text-xs text-amber-600">{table.orders[0].status}</p>
                  </div>
                )}

                {table.qrCode && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <QrCode className="h-4 w-4" />
                    <span>QR Code generated</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {table.qrCode ? (
                  <div className="flex gap-2">
                    <a
                      href={`/api/tables/${table.id}/qr`}
                      target="_blank"
                      className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <QrCode className="h-4 w-4" />
                      View QR
                    </a>
                    <a
                      href={`/api/tables/${table.id}/qr/download`}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                  </div>
                ) : (
                  <a
                    href={`/api/tables/${table.id}/qr`}
                    target="_blank"
                    className="w-full px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <QrCode className="h-4 w-4" />
                    Generate QR
                  </a>
                )}
                
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {tables.length === 0 && (
          <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tables yet</h3>
            <p className="text-gray-500 mb-4">Add tables to start managing your cafe seating</p>
            <Link
              href="/admin/tables/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Your First Table
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
