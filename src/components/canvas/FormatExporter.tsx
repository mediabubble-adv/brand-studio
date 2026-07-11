'use client'
import { useState } from 'react'
import JSZip from 'jszip'

interface SizeSpec {
  name: string
  width: number
  height: number
}

const PRESET_SIZES: SizeSpec[] = [
  { name: 'instagram_post', width: 1080, height: 1080 },
  { name: 'instagram_story', width: 1080, height: 1920 },
  { name: 'google_banner', width: 728, height: 90 },
  { name: 'google_rectangle', width: 300, height: 250 },
]

interface Props {
  canvasElement: HTMLCanvasElement | null
}

export function FormatExporter({ canvasElement }: Props) {
  const [exporting, setExporting] = useState(false)

  async function handleExport() {
    if (!canvasElement) return
    setExporting(true)
    const zip = new JSZip()

    // Export each size
    for (const size of PRESET_SIZES) {
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = size.width
      tempCanvas.height = size.height
      const ctx = tempCanvas.getContext('2d')

      if (ctx) {
        // Draw main canvas scaled to fit the preset size
        ctx.drawImage(canvasElement, 0, 0, size.width, size.height)
        const blob = await new Promise<Blob | null>(res => tempCanvas.toBlob(res, 'image/png'))
        if (blob) {
          zip.file(`${size.name}.png`, blob)
        }
      }
    }

    const content = await zip.generateAsync({ type: 'blob' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(content)
    link.download = 'brand-assets.zip'
    link.click()
    setExporting(false)
  }

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded px-4 py-2 text-sm font-medium disabled:opacity-50"
    >
      {exporting ? 'Exporting ZIP...' : 'Export All Sizes (ZIP)'}
    </button>
  )
}
