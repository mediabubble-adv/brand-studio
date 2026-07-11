export default function ClientAssetsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Brand Assets</h1>
        <p className="text-sm text-gray-500">Access approved logos, palettes, and style guides</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 border border-gray-200 rounded-lg text-center">
          <div className="h-20 bg-gray-50 rounded mb-2 flex items-center justify-center font-bold text-gray-400">Logo Primary</div>
          <span className="text-xs font-semibold text-gray-700">logo_primary.png</span>
        </div>
        <div className="bg-white p-4 border border-gray-200 rounded-lg text-center">
          <div className="h-20 bg-gray-50 rounded mb-2 flex items-center justify-center font-bold text-gray-400">Logo White</div>
          <span className="text-xs font-semibold text-gray-700">logo_white.png</span>
        </div>
      </div>
    </div>
  )
}
