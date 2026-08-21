import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { lastVisit: 'desc' }
    })

    return NextResponse.json({ customers })
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, whatsappNumber, email } = body

    const customer = await prisma.customer.create({
      data: {
        name,
        whatsappNumber,
        email: email || null
      }
    })

    return NextResponse.json({ customer }, { status: 201 })
  } catch (error) {
    console.error("Error creating customer:", error)
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    )
  }
}
