'use client'
import { useState } from 'react'

interface BrandProfile {
  brand_id: string
  primary_color: string | null
  secondary_color: string | null
  accent_color: string | null
  bg_color: string | null
  font_header: string | null
  font_body: string | null
  languages: string[]
  dialects: string[]
  tone_keywords: string[]
  grid_strategy: string | null
  instagram_handle: string | null
}

interface Props {
  brandId: string
  initialProfile: BrandProfile
}

export function BrandProfileEditor({ brandId, initialProfile }: Props) {
  const [profile, setProfile] = useState<BrandProfile>({
    ...initialProfile,
    languages: initialProfile.languages || [],
    dialects: initialProfile.dialects || [],
    tone_keywords: initialProfile.tone_keywords || [],
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function updateField<K extends keyof BrandProfile>(key: K, value: BrandProfile[K]) {
    setProfile(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`/api/brands/${brandId}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      const { error } = await res.json()
      if (!error) setSaved(true)
    } catch {
      // Handle silently for UX
    }
    setSaving(false)
  }

  const colorFields: Array<{ key: keyof BrandProfile; label: string }> = [
    { key: 'primary_color', label: 'Primary' },
    { key: 'secondary_color', label: 'Secondary' },
    { key: 'accent_color', label: 'Accent' },
    { key: 'bg_color', label: 'Background' },
  ]

  return (
    <div className="space-y-8 bg-white p-6 rounded-lg shadow-sm border border-gray-150 max-w-xl">
      {/* Colors */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Brand Colors</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {colorFields.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={(profile[key] as string) ?? '#ffffff'}
                  onChange={e => updateField(key, e.target.value)}
                  className="h-9 w-9 rounded cursor-pointer border border-gray-300"
                />
                <input
                  type="text"
                  value={(profile[key] as string) ?? ''}
                  onChange={e => updateField(key, e.target.value)}
                  placeholder="#000000"
                  className="w-28 rounded-md border border-gray-300 px-2 py-1.5 text-sm font-mono text-black"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fonts */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Typography</h2>
        <div className="grid grid-cols-2 gap-4">
          {(['font_header', 'font_body'] as const).map(key => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {key === 'font_header' ? 'Header Font' : 'Body Font'}
              </label>
              <input
                type="text"
                value={(profile[key] as string) ?? ''}
                onChange={e => updateField(key, e.target.value)}
                placeholder="e.g. Montserrat"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Tone & Language */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Voice & Language</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Tone Keywords (comma separated)
            </label>
            <input
              type="text"
              value={profile.tone_keywords.join(', ')}
              onChange={e => updateField('tone_keywords', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              placeholder="bold, energetic, warm"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Languages (comma separated: ar-EG, en)
            </label>
            <input
              type="text"
              value={profile.languages.join(', ')}
              onChange={e => updateField('languages', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
            />
          </div>
        </div>
      </section>

      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Profile'}
      </button>
    </div>
  )
}
