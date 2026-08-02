import { useState } from 'react'
import { ImagePlus, X } from 'lucide-react'
import MediaPickerModal from './MediaPickerModal.jsx'

export function ImagePicker({ value, onChange, label = 'Choose image' }) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      {value ? (
        <div className="relative w-full max-w-xs">
          <img src={value} alt="" className="h-28 w-full rounded-xl border border-slate-200 object-cover" />
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="absolute inset-0 flex items-center justify-center rounded-xl bg-navy-950/0 text-xs font-semibold text-white opacity-0 transition hover:bg-navy-950/50 hover:opacity-100"
          >
            Change
          </button>
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow"
            title="Remove image"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-28 w-full max-w-xs flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300 text-xs font-semibold text-slate-400 transition hover:border-gold-500 hover:text-gold-600"
        >
          <ImagePlus size={20} />
          {label}
        </button>
      )}
      <MediaPickerModal
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(m, url) => {
          onChange(url || m.url)
          setOpen(false)
        }}
      />
    </div>
  )
}
