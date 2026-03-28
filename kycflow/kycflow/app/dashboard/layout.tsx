import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">
          KYC Flow
        </h1>
        <span className="text-sm text-gray-500">
          {session.user?.email}
        </span>
      </nav>
      <main className="p-6">
        {children}
      </main>
    </div>
  )
}