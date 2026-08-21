import { prisma } from "@/lib/prisma"
import { Plus, Pencil, Trash2, Utensils } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

async function getMenuData() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
    include: {
      products: {
        where: { availability: true },
        orderBy: { displayOrder: 'asc' }
      }
    }
  })

  return categories
}

export default async function MenuPage() {
  const categories = await getMenuData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-500 mt-1">Manage your cafe menu items and categories</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/menu/categories/new"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Link>
          <Link
            href="/admin/menu/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </div>
      </div>

      <div className="grid gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <Utensils className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{category.name}</h2>
                  <p className="text-sm text-gray-500">{category.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="text-sm text-gray-500">{category.products.length} items</span>
              </div>
            </div>

            <div className="p-6">
              {category.products.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No products in this category</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.products.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              product.foodType === 'VEG' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {product.foodType}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Link
                            href={`/admin/menu/products/${product.id}/edit`}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Utensils className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items yet</h3>
            <p className="text-gray-500 mb-4">Start by adding categories and products to your menu</p>
            <Link
              href="/admin/menu/categories/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Your First Category
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
