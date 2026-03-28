"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export default function DashboardSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") ?? "")
  const [status, setStatus] = useState(searchParams.get("status") ?? "")

  function handleSearch() {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (status) params.set("status", status)
    router.push(`/dashboard?${params.toString()}`)
  }

  function handleClear() {
    setSearch("")
    setStatus("")
    router.push("/dashboard")
  }

  return (
    <div className="flex gap-3 flex-wrap">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder="Search by name..."
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All statuses</option>
        <option value="approved">Approved</option>
        <option value="manual_review">Manual Review</option>
        <option value="rejected">Rejected</option>
        <option value="pending">Pending</option>
      </select>

      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
      >
        Search
      </button>

      <button
        onClick={handleClear}
        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
      >
        Clear
      </button>
    </div>
  )
}