'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function BrandOnboardingForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch('/api/brands/ingest', {
        method: 'POST',
        body: formData,
      })

      const { data, error: apiError } = await res.json()

      if (apiError) {
        setError(apiError)
        setLoading(false)
        return
      }

      router.push(`/agency/brands/${data.brandId}`)
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl bg-white p-6 rounded-lg shadow-sm border border-gray-150">
      <div>
        <label htmlFor="brand_name" className="block text-sm font-medium text-gray-700">
          Brand Name *
        </label>
        <input
          id="brand_name"
          name="brand_name"
          type="text"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-black"
        />
      </div>

      <div>
        <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
          Industry
        </label>
        <input
          id="industry"
          name="industry"
          type="text"
          placeholder="e.g. Fitness, Real Estate, Hospitality"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-black"
        />
      </div>

      <div>
        <label htmlFor="pdf" className="block text-sm font-medium text-gray-700">
          Brand Guidelines PDF
        </label>
        <input
          id="pdf"
          name="pdf"
          type="file"
          accept=".pdf"
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
        />
        <p className="mt-1 text-xs text-gray-400">
          AI will extract colors, fonts, and tone of voice from this document.
        </p>
      </div>

      <div>
        <label htmlFor="instagram_handle" className="block text-sm font-medium text-gray-700">
          Instagram Handle
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">@</span>
          <input
            id="instagram_handle"
            name="instagram_handle"
            type="text"
            placeholder="brandhandle"
            className="block w-full rounded-none rounded-r-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-black"
          />
        </div>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Create Brand Profile'}
      </button>
    </form>
  )
}
