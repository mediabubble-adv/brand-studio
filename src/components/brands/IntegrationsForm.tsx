'use client'
import { useState } from 'react'

interface Integrations {
  facebook_page_id: string | null
  facebook_access_token: string | null
  instagram_business_id: string | null
  google_ads_customer_id: string | null
  google_refresh_token: string | null
}

interface Props {
  brandId: string
  initialIntegrations: Integrations
}

export function IntegrationsForm({ brandId, initialIntegrations }: Props) {
  const [integrations, setIntegrations] = useState<Integrations>({
    facebook_page_id: initialIntegrations.facebook_page_id || '',
    facebook_access_token: initialIntegrations.facebook_access_token || '',
    instagram_business_id: initialIntegrations.instagram_business_id || '',
    google_ads_customer_id: initialIntegrations.google_ads_customer_id || '',
    google_refresh_token: initialIntegrations.google_refresh_token || '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function updateField(key: keyof Integrations, value: string) {
    setIntegrations(prev => ({ ...prev, [key]: value }))
    setSaved(false)
    setError(null)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const res = await fetch(`/api/brands/${brandId}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(integrations),
      })
      const { error: apiError } = await res.json()
      if (apiError) {
        setError(apiError)
      } else {
        setSaved(true)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save integrations')
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-150 max-w-xl">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-lg font-semibold text-gray-900">Platform Integrations</h2>
        <p className="text-sm text-gray-500 mt-1">Configure API connections to push post assets directly to networks.</p>
      </div>

      {/* Meta configuration */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Meta (Facebook & Instagram)</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="facebook_page_id" className="block text-xs font-medium text-gray-500 mb-1">Facebook Page ID</label>
            <input
              id="facebook_page_id"
              type="text"
              value={integrations.facebook_page_id || ''}
              onChange={e => updateField('facebook_page_id', e.target.value)}
              placeholder="e.g. 1029384756"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
            />
          </div>
          <div>
            <label htmlFor="instagram_business_id" className="block text-xs font-medium text-gray-500 mb-1">Instagram Business ID</label>
            <input
              id="instagram_business_id"
              type="text"
              value={integrations.instagram_business_id || ''}
              onChange={e => updateField('instagram_business_id', e.target.value)}
              placeholder="e.g. 5647382910"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
            />
          </div>
        </div>
        <div>
          <label htmlFor="facebook_access_token" className="block text-xs font-medium text-gray-500 mb-1">Page Access Token</label>
          <input
            id="facebook_access_token"
            type="password"
            value={integrations.facebook_access_token || ''}
            onChange={e => updateField('facebook_access_token', e.target.value)}
            placeholder="EAABw..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
          />
        </div>
      </section>

      {/* Google Ads configuration */}
      <section className="space-y-4 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Google Display Ads</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="google_ads_customer_id" className="block text-xs font-medium text-gray-500 mb-1">Customer ID (without dashes)</label>
            <input
              id="google_ads_customer_id"
              type="text"
              value={integrations.google_ads_customer_id || ''}
              onChange={e => updateField('google_ads_customer_id', e.target.value)}
              placeholder="e.g. 1234567890"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
            />
          </div>
          <div>
            <label htmlFor="google_refresh_token" className="block text-xs font-medium text-gray-500 mb-1">OAuth Refresh Token</label>
            <input
              id="google_refresh_token"
              type="password"
              value={integrations.google_refresh_token || ''}
              onChange={e => updateField('google_refresh_token', e.target.value)}
              placeholder="1//0..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
            />
          </div>
        </div>
      </section>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Integrations'}
      </button>
    </form>
  )
}
