import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const tables = await prisma.table.findMany({
      orderBy: { tableNumber: 'asc' }
    })

    return NextResponse.json({ tables })
  } catch (error) {
    console.error("Error fetching tables:", error)
    return NextResponse.json(
      { error: "Failed to fetch tables" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tableNumber, capacity, status } = body

    const table = await prisma.table.create({
      data: {
        tableNumber,
        capacity: capacity || 4,
        status: status || 'AVAILABLE'
      }
    })

    return NextResponse.json({ table }, { status: 201 })
  } catch (error) {
    console.error("Error creating table:", error)
    return NextResponse.json(
      { error: "Failed to create table" },
      { status: 500 }
    )
  }
}
