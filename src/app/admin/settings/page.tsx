import { prisma } from "@/lib/prisma"
import { Save, Building2, Phone, Mail, Clock, DollarSign } from "lucide-react"

export const dynamic = 'force-dynamic'

async function getCafeSettings() {
  const settings = await prisma.cafeSettings.findFirst()
  return settings
}

export default async function SettingsPage() {
  const settings = await getCafeSettings()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cafe Settings</h1>
        <p className="text-gray-500 mt-1">Manage your cafe information and preferences</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
        </div>
        <form className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Building2 className="h-4 w-4" />
                Cafe Name
              </label>
              <input
                type="text"
                defaultValue={settings?.cafeName || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="The Urban Bean"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Phone className="h-4 w-4" />
                Phone Number
              </label>
              <input
                type="tel"
                defaultValue={settings?.phone || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+91 9876543210"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <input
                type="email"
                defaultValue={settings?.email || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="info@urbanbean.com"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Phone className="h-4 w-4" />
                WhatsApp Number
              </label>
              <input
                type="tel"
                defaultValue={settings?.whatsappNumber || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+91 9876543210"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Address</label>
            <textarea
              defaultValue={settings?.address || ""}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123 Main Street, City"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Clock className="h-4 w-4" />
              Opening Hours
            </label>
            <input
              type="text"
              defaultValue={settings?.openingHours || ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="9:00 AM - 10:00 PM"
            />
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Pricing & Payments</h2>
        </div>
        <form className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <DollarSign className="h-4 w-4" />
                Tax Percentage (%)
              </label>
              <input
                type="number"
                step="0.1"
                defaultValue={settings?.taxPercentage || 0}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="5"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <DollarSign className="h-4 w-4" />
                Service Charge (%)
              </label>
              <input
                type="number"
                step="0.1"
                defaultValue={settings?.serviceCharge || 0}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Currency</label>
              <input
                type="text"
                defaultValue={settings?.currency || "₹"}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="₹"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Payment Gateway</label>
            <select
              defaultValue={settings?.paymentGateway || "upi"}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="upi">UPI (QR Code)</option>
              <option value="cash">Cash Only</option>
            </select>
          </div>
        </form>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Save className="h-4 w-4" />
          Save Settings
        </button>
      </div>
    </div>
  )
}
