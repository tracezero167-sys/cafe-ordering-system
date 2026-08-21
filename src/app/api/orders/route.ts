import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const whereClause = status && status !== "ALL" ? { status } : {}

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            product: true
          }
        },
        customer: true,
        table: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      tableId,
      customerName,
      customerPhone,
      customerEmail,
      items,
      paymentMethod,
      specialInstructions,
      subtotal,
      tax,
      serviceCharge,
      total
    } = body

    // Validate required fields
    if (!tableId || !customerName || !customerPhone || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Verify table exists and is active
    const table = await prisma.table.findUnique({
      where: { id: tableId }
    })

    if (!table) {
      return NextResponse.json(
        { error: "Table not found" },
        { status: 404 }
      )
    }

    // Create or get customer
    let customer = await prisma.customer.findUnique({
      where: { whatsappNumber: customerPhone }
    })

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: customerName,
          whatsappNumber: customerPhone,
          email: customerEmail || null
        }
      })
    } else {
      // Update customer info if changed
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: {
          name: customerName,
          email: customerEmail || null
        }
      })
    }

    // Create customer session
    const sessionToken = Math.random().toString(36).substring(2, 15)
    const customerSession = await prisma.customerSession.create({
      data: {
        customerId: customer.id,
        tableId,
        sessionToken
      }
    })

    // Generate order number
    const orderCount = await prisma.order.count()
    const orderNumber = `ORD${String(orderCount + 1).padStart(4, '0')}`

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        tableId,
        sessionId: customerSession.id,
        status: 'PENDING',
        paymentMethod: paymentMethod as any,
        paymentStatus: paymentMethod === 'CASH' ? 'PENDING' : 'PENDING',
        subtotal,
        tax,
        serviceCharge,
        totalAmount: total,
        specialInstructions: specialInstructions || null,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity,
            selectedVariant: item.selectedVariant ? JSON.stringify(item.selectedVariant) : null,
            selectedAddOns: item.addOns && item.addOns.length > 0 ? JSON.stringify(item.addOns) : null
          }))
        }
      },
      include: {
        items: true,
        customer: true,
        table: true
      }
    })

    // Create initial status history
    await prisma.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: 'PENDING',
        notes: 'Order placed successfully'
      }
    })

    // Update table status
    await prisma.table.update({
      where: { id: tableId },
      data: { status: 'ORDERING' }
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      order
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}
