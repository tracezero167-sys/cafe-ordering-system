import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { status } = body
    const { id } = await params

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      )
    }

    // Update order status
    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        table: true
      }
    })

    // Create status history entry
    await prisma.orderStatusHistory.create({
      data: {
        orderId: id,
        status,
        notes: `Status changed to ${status}`
      }
    })

    // Update table status based on order status
    let tableStatus = "AVAILABLE"
    if (status === "PENDING" || status === "CONFIRMED" || status === "PREPARING") {
      tableStatus = "ORDERING"
    } else if (status === "READY") {
      tableStatus = "READY"
    } else if (status === "SERVED") {
      tableStatus = "AVAILABLE"
    }

    await prisma.table.update({
      where: { id: order.tableId },
      data: { status: tableStatus }
    })

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error("Error updating order status:", error)
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    )
  }
}
