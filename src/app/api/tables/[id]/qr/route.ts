import { prisma } from "@/lib/prisma"
import QRCode from "qrcode"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const table = await prisma.table.findUnique({
      where: { id: params.id }
    })

    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 })
    }

    // Generate QR code URL
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    const qrUrl = `${baseUrl}/order?table=${table.id}`

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(qrUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF"
      }
    })

    // Update table with QR code
    await prisma.table.update({
      where: { id: params.id },
      data: {
        qrCode: qrUrl,
        qrCodeImage: qrCodeDataUrl
      }
    })

    return NextResponse.json({
      qrCode: qrUrl,
      qrCodeImage: qrCodeDataUrl
    })
  } catch (error) {
    console.error("Error generating QR code:", error)
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 }
    )
  }
}
