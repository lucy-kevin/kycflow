import Link from "next/link"

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8 text-center">

        {/* Success Icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Submission Received
        </h1>

        <p className="text-gray-500 mb-6">
          Thank you for submitting your identity verification. 
          Your application is being reviewed and you will be 
          notified of the outcome.
        </p>

        <div className="bg-gray-50 rounded-md p-4 mb-6 text-left">
          <h2 className="text-sm font-medium text-gray-700 mb-2">
            What happens next?
          </h2>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>✓ Your documents are being verified</li>
            <li>✓ Automated checks are running</li>
            <li>✓ A reviewer will assess your application</li>
          </ul>
        </div>

        <Link
          href="/"
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Submit another verification
        </Link>

      </div>
    </main>
  )
}