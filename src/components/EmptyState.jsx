import { cn } from '../lib/utils.js'

export default function EmptyState({ icon: Icon, title, text, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 px-6 py-20 text-center', className)}>
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-50 text-navy-400">
        <Icon size={28} />
      </div>
      <h3 className="mt-5 font-serif text-2xl font-semibold text-navy-900">{title}</h3>
      {text && <p className="mt-2 max-w-md text-sm text-slate-500">{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
