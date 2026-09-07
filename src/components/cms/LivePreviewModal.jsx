import { useState } from 'react'
import { Eye, Smartphone, Tablet, Monitor, X, ExternalLink } from 'lucide-react'
import { Modal, Btn } from './UI.jsx'

export default function LivePreviewModal({
  isOpen,
  onClose,
  title = 'Page Preview',
  previewData,
  renderPreview
}) {
  const [device, setDevice] = useState('desktop') // 'desktop' | 'tablet' | 'mobile'

  if (!isOpen) return null

  const widthClass =
    device === 'mobile'
      ? 'max-w-sm'
      : device === 'tablet'
      ? 'max-w-2xl'
      : 'max-w-6xl'

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/80 backdrop-blur-md p-2 sm:p-6 overflow-hidden animate-fade-in">
      {/* Top Preview Bar */}
      <div className="flex items-center justify-between rounded-2xl bg-navy-900 px-4 py-3 text-white shadow-xl border border-white/10 mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-lg bg-gold-500/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-gold-400 border border-gold-400/30">
            <Eye size={13} /> DRAFT PREVIEW — NOT LIVE
          </div>
          <span className="hidden sm:inline text-xs text-navy-200 font-medium truncate max-w-md">
            {title}
          </span>
        </div>

        {/* Viewport Toggles */}
        <div className="flex items-center rounded-xl bg-white/10 p-1 border border-white/10">
          <button
            type="button"
            onClick={() => setDevice('desktop')}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              device === 'desktop' ? 'bg-gold-500 text-navy-900' : 'text-navy-200 hover:text-white'
            }`}
          >
            <Monitor size={14} /> <span className="hidden md:inline">Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice('tablet')}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              device === 'tablet' ? 'bg-gold-500 text-navy-900' : 'text-navy-200 hover:text-white'
            }`}
          >
            <Tablet size={14} /> <span className="hidden md:inline">Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice('mobile')}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              device === 'mobile' ? 'bg-gold-500 text-navy-900' : 'text-navy-200 hover:text-white'
            }`}
          >
            <Smartphone size={14} /> <span className="hidden md:inline">Mobile</span>
          </button>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
        >
          <X size={16} />
        </button>
      </div>

      {/* Preview Content Container */}
      <div className="flex-1 overflow-y-auto flex justify-center items-start pb-6">
        <div
          className={`w-full ${widthClass} min-h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 transition-all duration-300`}
        >
          {renderPreview ? renderPreview(previewData) : (
            <div className="p-8">
              <h1 className="font-serif text-3xl font-bold text-navy-900">{previewData?.title || 'Preview'}</h1>
              {previewData?.excerpt && <p className="mt-2 text-slate-600 italic">{previewData.excerpt}</p>}
              {previewData?.content && <div className="mt-4 prose max-w-none" dangerouslySetInnerHTML={{ __html: previewData.content }} />}
              {previewData?.html && <div className="mt-4 prose max-w-none" dangerouslySetInnerHTML={{ __html: previewData.html }} />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
