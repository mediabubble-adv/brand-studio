'use client'
import { useState } from 'react'

interface Props {
  briefId: string
  currentStatus: string
}

export function BriefApprovalPanel({ briefId, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  async function handleApprove(action: string) {
    setLoading(true)
    try {
      const res = await fetch(`/api/briefs/${briefId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const { data, error } = await res.json()
      if (!error && data) {
        setStatus(data.status)
      }
    } catch {
      // Handle silently for UX
    }
    setLoading(false)
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 max-w-sm space-y-4">
      <h3 className="font-bold text-gray-900">Task Actions</h3>
      <div className="text-sm">
        <span className="text-gray-500">Current Status:</span>{' '}
        <span className="font-mono text-indigo-700 uppercase">{status.replace('_', ' ')}</span>
      </div>

      <div className="space-y-2">
        {status === 'brief_draft' && (
          <button
            onClick={() => handleApprove('review')}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded py-2 text-sm font-semibold disabled:opacity-50"
          >
            PM Review Content
          </button>
        )}

        {status === 'brief_reviewed' && (
          <button
            onClick={() => handleApprove('approve_design')}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white rounded py-2 text-sm font-semibold disabled:opacity-50"
          >
            Approve Visual Composition
          </button>
        )}

        {status === 'design_approved' && (
          <button
            onClick={() => handleApprove('schedule')}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2 text-sm font-semibold disabled:opacity-50"
          >
            Schedule Auto-Post
          </button>
        )}
      </div>
    </div>
  )
}
