import { useState } from 'react'
import { Accessibility, Sun, Moon, Contrast, Type, Move, X, Plus, Minus } from 'lucide-react'
import { useA11y } from '../context/A11yContext.jsx'
import { cn } from '../lib/utils.js'

function Toggle({ checked, onChange, label, icon: Icon }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={cn(
        'flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-3 text-sm font-medium transition',
        checked
          ? 'border-gold-400 bg-gold-50 text-navy-900'
          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
      )}
    >
      <span className="flex items-center gap-2.5">
        <Icon size={16} className={cn(checked ? 'text-gold-600' : 'text-slate-400')} />
        {label}
      </span>
      <span
        className={cn(
          'relative h-5 w-9 rounded-full transition-colors',
          checked ? 'bg-gold-500' : 'bg-slate-300'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all',
            checked ? 'left-[18px]' : 'left-0.5'
          )}
        />
      </span>
    </button>
  )
}

export default function A11yPanel() {
  const [open, setOpen] = useState(false)
  const { mode, toggleDark, set, highContrast, reduceMotion, fontSize } = useA11y()

  return (
    <div className="fixed bottom-24 left-4 z-[70] sm:bottom-6">
      {open && (
        <div className="mb-3 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-cardHover animate-scale-in">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-serif text-base font-semibold text-navy-900">Accessibility</p>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-navy-900"
              aria-label="Close accessibility panel"
            >
              <X size={15} />
            </button>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => toggleDark()}
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-300"
              role="switch"
              aria-checked={mode === 'dark'}
            >
              <span className="flex items-center gap-2.5">
                {mode === 'dark' ? <Sun size={16} className="text-gold-500" /> : <Moon size={16} className="text-slate-400" />}
                {mode === 'dark' ? 'Light mode' : 'Dark mode'}
              </span>
              <span className="text-xs font-semibold text-slate-400">{mode === 'dark' ? 'On' : 'Off'}</span>
            </button>
            <Toggle checked={highContrast} onChange={(v) => set({ highContrast: v })} label="High contrast" icon={Contrast} />
            <Toggle checked={reduceMotion} onChange={(v) => set({ reduceMotion: v })} label="Reduce motion" icon={Move} />

            <div className="rounded-xl border border-slate-200 bg-white p-3.5">
              <p className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <Type size={16} className="text-slate-400" /> Text size
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  onClick={() => set({ fontSize: Math.max(0, fontSize - 1) })}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-navy-900 hover:text-navy-900 disabled:opacity-40"
                  aria-label="Decrease text size"
                  disabled={fontSize <= 0}
                >
                  <Minus size={15} />
                </button>
                <div className="flex flex-1 items-center justify-center gap-1">
                  {['A', 'A', 'A'].map((_, i) => (
                    <span
                      key={i}
                      className={cn('font-serif font-semibold text-slate-400', i === fontSize && 'text-gold-600')}
                      style={{ fontSize: 12 + i * 4 }}
                    >
                      A
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => set({ fontSize: Math.min(2, fontSize + 1) })}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-navy-900 hover:text-navy-900 disabled:opacity-40"
                  aria-label="Increase text size"
                  disabled={fontSize >= 2}
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Accessibility options"
        aria-expanded={open}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-900 text-white shadow-cardHover transition hover:-translate-y-0.5 hover:bg-navy-800"
      >
        {open ? <X size={20} /> : <Accessibility size={20} />}
      </button>
    </div>
  )
}
