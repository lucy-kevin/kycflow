import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {
  const verifications = await prisma.verification.findMany({
    orderBy: { submittedAt: "desc" },
  })

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        All Applications
      </h2>

      {verifications.length === 0 ? (
        <p className="text-gray-500">No applications yet.</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Submitted
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {verifications.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {v.customerName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {v.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {v.idType}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      v.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : v.status === "manual_review"
                        ? "bg-yellow-100 text-yellow-800"
                        : v.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {v.confidenceScore}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(v.submittedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
