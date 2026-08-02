import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '../lib/utils.js'

const ToastContext = createContext(null)

export function useToast() {
  return useContext(ToastContext)
}

let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
    clearTimeout(timers.current[id])
    delete timers.current[id]
  }, [])

  const push = useCallback((message, type = 'success', duration = 4000) => {
    const id = `t_${++idCounter}`
    setToasts((t) => [...t.slice(-4), { id, message, type }])
    timers.current[id] = setTimeout(() => dismiss(id), duration)
  }, [dismiss])

  const value = useMemo(() => ({ toast: push }), [push])

  const icons = {
    success: <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />,
    error: <AlertCircle size={18} className="shrink-0 text-red-500" />,
    info: <Info size={18} className="shrink-0 text-sky-500" />
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-full max-w-sm flex-col gap-2.5">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-xl border bg-white px-4 py-3 shadow-cardHover animate-scale-in',
              t.type === 'success' && 'border-emerald-200',
              t.type === 'error' && 'border-red-200',
              t.type === 'info' && 'border-sky-200'
            )}
          >
            {icons[t.type]}
            <p className="flex-1 text-sm font-medium leading-snug text-navy-900">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="text-slate-400 transition hover:text-slate-600"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
