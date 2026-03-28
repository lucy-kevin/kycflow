import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import OverrideForm from "@/components/OverrideForm"

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const verification = await prisma.verification.findUnique({
    where: { id },
    include: { business: true },
  })

  if (!verification) {
    notFound()
  }

  const checks = verification.checkResults as {
    name_valid: boolean
    age_eligible: boolean
    document_type_valid: boolean
    face_detected: boolean
    confidence_score: number
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/dashboard"
        className="text-sm text-blue-600 hover:text-blue-700 mb-6 inline-block"
      >
        ← Back to dashboard
      </Link>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {verification.customerName}
          </h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            verification.status === "approved"
              ? "bg-green-100 text-green-800"
              : verification.status === "manual_review"
              ? "bg-yellow-100 text-yellow-800"
              : verification.status === "rejected"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          }`}>
            {verification.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Email</p>
            <p className="text-gray-900">{verification.email}</p>
          </div>
          <div>
            <p className="text-gray-500">Nationality</p>
            <p className="text-gray-900">{verification.nationality}</p>
          </div>
          <div>
            <p className="text-gray-500">Date of Birth</p>
            <p className="text-gray-900">
              {new Date(verification.dateOfBirth).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-500">ID Type</p>
            <p className="text-gray-900">{verification.idType}</p>
          </div>
          <div>
            <p className="text-gray-500">Submitted</p>
            <p className="text-gray-900">
              {new Date(verification.submittedAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Confidence Score</p>
            <p className="text-gray-900 font-bold">
              {verification.confidenceScore}/100
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          ID Document
        </h3>
        <img
          src={verification.documentUrl}
          alt="ID Document"
          className="w-full max-h-64 object-contain rounded border border-gray-200"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          Automated Checks
        </h3>
        <div className="space-y-3">
          <CheckRow
            label="Name Validation"
            description="Full name with at least 2 words, no numbers"
            passed={checks.name_valid}
          />
          <CheckRow
            label="Age Eligibility"
            description="Customer is 18 or older"
            passed={checks.age_eligible}
          />
          <CheckRow
            label="Document Type"
            description="Valid ID type selected"
            passed={checks.document_type_valid}
          />
          <CheckRow
            label="Face Detection"
            description="A human face was found in the document"
            passed={checks.face_detected}
          />
          <CheckRow
            label="Confidence Score"
            description={`Score: ${checks.confidence_score}/100 (85+ approved, 60-84 review, below 60 rejected)`}
            passed={checks.confidence_score >= 60}
          />
        </div>
      </div>

      {verification.reviewerNote && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Reviewer Note
          </h3>
          <p className="text-sm text-gray-600">{verification.reviewerNote}</p>
        </div>
      )}

      <OverrideForm
        verificationId={verification.id}
        currentStatus={verification.status}
        currentNote={verification.reviewerNote}
      />

    </div>
  )
}

function CheckRow({
  label,
  description,
  passed,
}: {
  label: string
  description: string
  passed: boolean
}) {
  return (
    <div className="flex items-start gap-3">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
        passed ? "bg-green-100" : "bg-red-100"
      }`}>
        {passed ? (
          <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  )
}