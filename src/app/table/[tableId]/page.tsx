import { prisma } from "@/lib/prisma"
import { Coffee, Utensils, Cake, Beef, ShoppingBag, Search } from "lucide-react"
import MenuClient from "./MenuClient"

async function getTableData(tableId: string) {
  const table = await prisma.table.findUnique({
    where: { id: tableId }
  })

  if (!table) {
    return null
  }

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

  const settings = await prisma.cafeSettings.findFirst()

  return { table, categories, settings }
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

export default async function TableOrderPage({ params }: { params: { tableId: string } }) {
  console.log("TableOrderPage server component rendering for tableId:", params.tableId)
  const data = await getTableData(params.tableId)

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Table Not Found</h1>
          <p className="text-gray-500">Please scan a valid QR code</p>
        </div>
      </div>
    )
  }

  const { table, categories, settings } = data
  console.log("Data fetched, rendering MenuClient with", categories.length, "categories")

  return <MenuClient tableId={params.tableId} table={table} categories={categories} settings={settings} categoryIcons={categoryIcons} />
}
