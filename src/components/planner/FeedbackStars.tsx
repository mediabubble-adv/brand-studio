'use client'
import { useState } from 'react'

interface Props {
  postId: string
  initialRating?: number
  initialComments?: string
  onSaved?: () => void
}

export function FeedbackStars({ postId, initialRating = 0, initialComments = '', onSaved }: Props) {
  const [rating, setRating] = useState(initialRating)
  const [comments, setComments] = useState(initialComments)
  const [hoverRating, setHoverRating] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      // Upsert feedback
      const res = await fetch(`/api/posts/${postId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comments }),
      })

      const { error } = await res.json()
      if (!error) {
        setSaved(true)
        if (onSaved) onSaved()
      }
    } catch {
      // Fail silently for UX
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-200 max-w-sm space-y-4">
      <div>
        <h3 className="font-bold text-gray-900">Post Feedback</h3>
        <p className="text-xs text-gray-500 mt-0.5">Rate this content to guide our creative model updates.</p>
      </div>

      {/* Stars Grid */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => {
          const isActive = (hoverRating || rating) >= star
          return (
            <button
              key={star}
              type="button"
              onClick={() => {
                setRating(star)
                setSaved(false)
              }}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-2xl focus:outline-none transition-colors"
            >
              <span className={isActive ? 'text-yellow-400' : 'text-gray-200'}>★</span>
            </button>
          )
        })}
      </div>

      <div>
        <label htmlFor="comments" className="block text-xs font-medium text-gray-500 mb-1">
          Review Comments
        </label>
        <textarea
          id="comments"
          rows={3}
          value={comments}
          onChange={e => {
            setComments(e.target.value)
            setSaved(false)
          }}
          placeholder="e.g. caption sounds slightly too formal..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs text-black focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <button
        type="submit"
        disabled={saving || rating === 0}
        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {saving ? 'Saving...' : saved ? 'Feedback Saved ✓' : 'Submit Feedback'}
      </button>
    </form>
  )
}
