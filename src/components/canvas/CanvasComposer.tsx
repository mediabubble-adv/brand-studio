'use client'
import { useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'
import { FormatExporter } from './FormatExporter'

interface Props {
  imageUrl: string
  logos: Array<{ url: string; name: string }>
  onSave: (canvasJson: string) => void
}

export function CanvasComposer({ imageUrl, logos, onSave }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 600,
      height: 600,
      backgroundColor: '#f3f4f6',
    })

    setCanvas(fabricCanvas)
    setCanvasElement(canvasRef.current)

    // Load background image
    fabric.Image.fromURL(imageUrl, (img) => {
      img.scaleToWidth(600)
      fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas))
    }, { crossOrigin: 'anonymous' })

    return () => {
      fabricCanvas.dispose()
    }
  }, [imageUrl])

  function addLogo(url: string) {
    if (!canvas) return
    fabric.Image.fromURL(url, (img) => {
      img.scaleToWidth(100)
      img.set({ left: 50, top: 50 })
      canvas.add(img)
      canvas.setActiveObject(img)
      canvas.renderAll()
    }, { crossOrigin: 'anonymous' })
  }

  function addText() {
    if (!canvas) return
    const text = new fabric.IText('Add Tagline Here', {
      left: 150,
      top: 450,
      fontFamily: 'sans-serif',
      fill: '#ffffff',
      fontSize: 28,
    })
    canvas.add(text)
    canvas.setActiveObject(text)
    canvas.renderAll()
  }

  return (
    <div className="flex gap-6 p-6 bg-white rounded-xl shadow border border-gray-200">
      <div className="border border-gray-300 rounded overflow-hidden">
        <canvas ref={canvasRef} />
      </div>

      <div className="w-64 space-y-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Layers & Overlays</h3>
          <button
            onClick={addText}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded px-4 py-2 text-sm font-medium"
          >
            Add Text Layer
          </button>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Logos</h3>
          <div className="grid grid-cols-2 gap-2">
            {logos.map(logo => (
              <button
                key={logo.url}
                onClick={() => addLogo(logo.url)}
                className="border border-gray-200 hover:border-indigo-500 rounded p-1"
              >
                <img src={logo.url} alt={logo.name} className="h-10 w-auto mx-auto object-contain" />
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 space-y-2">
          <button
            onClick={() => canvas && onSave(JSON.stringify(canvas.toJSON()))}
            className="w-full bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2 text-sm font-medium"
          >
            Save Composition
          </button>
          
          <FormatExporter canvasElement={canvasElement} />
        </div>
      </div>
    </div>
  )
}
