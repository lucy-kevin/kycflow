"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { submissionSchema, SubmissionFormData } from "@/lib/schemas"
import { supabase } from "@/lib/supabase"

export default function Home() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState("")
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
  })

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (!selected) return

    if (!selected.type.startsWith("image/")) {
      setFileError("Please upload an image file")
      return
    }

    if (selected.size > 5 * 1024 * 1024) {
      setFileError("File must be smaller than 5MB")
      return
    }

    setFileError("")
    setFile(selected)
  }

  async function onSubmit(data: SubmissionFormData) {
    if (!file) {
      setFileError("Please upload your ID document")
      return
    }

    setLoading(true)

    try {
      // Upload file to Supabase Storage
      const fileName = `${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("documents")
        .getPublicUrl(fileName)

      const documentUrl = urlData.publicUrl

      // Submit to our API
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, documentUrl }),
      })

      if (!response.ok) throw new Error("Submission failed")

      router.push("/success")
    } catch (error) {
      console.error("Submission error:", error)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">KYC Flow</h1>
          <p className="text-gray-500 mt-2">
            Complete your identity verification below.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                {...register("customerName")}
                type="text"
                placeholder="John Smith"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.customerName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.customerName.message}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                {...register("dateOfBirth")}
                type="date"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nationality
              </label>
              <input
                {...register("nationality")}
                type="text"
                placeholder="Ugandan"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.nationality && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.nationality.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="john@example.com"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* ID Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID Type
              </label>
              <select
                {...register("idType")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select ID type</option>
                <option value="National ID">National ID</option>
                <option value="Passport">Passport</option>
                <option value="Driving Licence">Driving Licence</option>
              </select>
              {errors.idType && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.idType.message}
                </p>
              )}
            </div>

            {/* Document Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID Document (image)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {file && (
                <p className="text-green-600 text-xs mt-1">
                  ✓ {file.name} selected
                </p>
              )}
              {fileError && (
                <p className="text-red-500 text-xs mt-1">{fileError}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Verification"}
            </button>

          </form>
        </div>
      </div>
    </main>
  )
}