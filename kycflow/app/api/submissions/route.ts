import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { submissionSchema } from "@/lib/schemas"
import { detectFace } from "@/lib/faceapi"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the data with Zod
    const parsed = submissionSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { customerName, dateOfBirth, nationality, email, idType } =
      parsed.data

    const documentUrl = body.documentUrl as string

    if (!documentUrl) {
      return NextResponse.json(
        { error: "Document URL is required" },
        { status: 400 }
      )
    }

    // Check 1 — Name validation
    const nameWords = customerName.trim().split(/\s+/)
    const nameValid =
      nameWords.length >= 2 && /^[a-zA-Z\s]+$/.test(customerName)

    // Check 2 — Age eligibility
    const dob = new Date(dateOfBirth)
    const today = new Date()
    const age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()
    const exactAge =
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dob.getDate())
        ? age - 1
        : age
    const ageEligible = exactAge >= 18

    // Check 3 — Document type validation
    const validIdTypes = ["National ID", "Passport", "Driving Licence"]
    const documentTypeValid = validIdTypes.includes(idType)

    // Check 4 & 5 — Face detection via Face++ API
    console.log("Running face detection on:", documentUrl)
    const { faceDetected, confidenceScore } = await detectFace(documentUrl)
    console.log("Face detected:", faceDetected, "Score:", confidenceScore)

    const checkResults = {
      name_valid: nameValid,
      age_eligible: ageEligible,
      document_type_valid: documentTypeValid,
      face_detected: faceDetected,
      confidence_score: confidenceScore,
    }

    // Determine status based on confidence score
    const status =
      confidenceScore >= 85
        ? "approved"
        : confidenceScore >= 60
        ? "manual_review"
        : "rejected"

    // Get the first business (demo business)
    const business = await prisma.business.findFirst()

    if (!business) {
      return NextResponse.json(
        { error: "No business found" },
        { status: 500 }
      )
    }

    // Save to database
    const verification = await prisma.verification.create({
      data: {
        businessId: business.id,
        customerName,
        dateOfBirth: new Date(dateOfBirth),
        nationality,
        email,
        idType,
        documentUrl,
        status,
        confidenceScore,
        checkResults,
      },
    })

    return NextResponse.json({ success: true, id: verification.id })
  } catch (error) {
    console.error("Submission error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
