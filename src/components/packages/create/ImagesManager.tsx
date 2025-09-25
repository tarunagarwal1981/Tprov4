import { useState } from 'react'

export interface ImageDraftItem {
  id: string
  file?: File
  url?: string
  isCover?: boolean
  caption?: string
}

interface ImagesManagerProps {
  items: ImageDraftItem[]
  onChange: (items: ImageDraftItem[]) => void
  max?: number
}

export default function ImagesManager({ items, onChange, max = 10 }: ImagesManagerProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const addFiles = (files: FileList | null) => {
    if (!files) return
    const existing = items.length
    const toAdd = Array.from(files).slice(0, Math.max(0, max - existing))
    const newItems: ImageDraftItem[] = toAdd.map((f, i) => ({
      id: `${Date.now()}_${i}`,
      file: f,
      isCover: items.length === 0 && i === 0
    }))
    onChange([...items, ...newItems])
  }

  const setCover = (idx: number) => {
    onChange(items.map((it, i) => ({ ...it, isCover: i === idx })))
  }

  const removeAt = (idx: number) => {
    const next = items.filter((_, i) => i !== idx)
    // Keep first as cover
    if (next.length > 0 && !next.some((i) => i.isCover)) next[0].isCover = true
    onChange(next)
  }

  const onDragStart = (idx: number) => setDragIndex(idx)
  const onDrop = (idx: number) => {
    if (dragIndex === null || dragIndex === idx) return
    const next = [...items]
    const [moved] = next.splice(dragIndex, 1)
    next.splice(idx, 0, moved)
    // Maintain cover on first item
    next.forEach((it, i) => (it.isCover = i === 0 ? true : it.isCover && i === 0))
    onChange(next)
    setDragIndex(null)
  }

  return (
    <div className="space-y-3">
      <div
        className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer"
        onClick={() => (document.getElementById('images-manager-input') as HTMLInputElement)?.click()}
      >
        <input id="images-manager-input" type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
        <div className="text-gray-600">Drag & drop or click to add images ({items.length}/{max})</div>
      </div>

      {items.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {items.map((it, idx) => {
            const src = it.url || (it.file ? URL.createObjectURL(it.file) : '')
            return (
              <div
                key={it.id}
                className="relative border rounded-lg overflow-hidden group"
                draggable
                onDragStart={() => onDragStart(idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(idx)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="preview" className="w-full h-24 object-cover" />
                {it.isCover && (
                  <span className="absolute top-1 left-1 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded">Cover</span>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />
                <div className="absolute bottom-1 left-1 right-1 flex justify-between gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button className="text-[10px] px-2 py-0.5 bg-white/90 rounded" onClick={() => setCover(idx)}>Set cover</button>
                  <button className="text-[10px] px-2 py-0.5 bg-white/90 rounded" onClick={() => removeAt(idx)}>Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}


