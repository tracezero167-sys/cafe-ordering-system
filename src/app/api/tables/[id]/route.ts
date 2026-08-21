import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const table = await prisma.table.findUnique({
      where: { id }
    })

    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 })
    }

    const settings = await prisma.cafeSettings.findFirst()

    return NextResponse.json({
      table,
      settings
    })
  } catch (error) {
    console.error("Error fetching table data:", error)
    return NextResponse.json(
      { error: "Failed to fetch table data" },
      { status: 500 }
    )
  }
}
