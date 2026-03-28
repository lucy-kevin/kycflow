import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, status, reviewerNote } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID and status are required" },
        { status: 400 }
      )
    }

    const validStatuses = ["approved", "manual_review", "rejected"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      )
    }

    const verification = await prisma.verification.update({
      where: { id },
      data: {
        status,
        reviewerNote: reviewerNote || null,
        reviewedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, verification })
  } catch (error) {
    console.error("Override error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
