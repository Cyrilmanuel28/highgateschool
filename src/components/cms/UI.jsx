import { useState } from 'react'
import { Plus, Trash2, ChevronUp, ChevronDown, GripVertical, Eye as EyeIcon, Pencil as PencilIcon, X as XIcon } from 'lucide-react'
import { cn, uid } from '../../lib/utils.js'
import { ImagePicker } from './ImagePicker.jsx'

export function Btn({ children, variant = 'primary', size = 'md', className, loading = false, loadingText, disabled, ...rest }) {
  const styles = {
    primary: 'bg-navy-900 text-white hover:bg-navy-800',
    gold: 'bg-gold-500 text-white hover:bg-gold-600',
    royal: 'bg-royal text-white hover:bg-navy-900',
    outline: 'border border-slate-300 bg-white text-navy-900 hover:border-navy-900 hover:bg-navy-50',
    ghost: 'text-navy-700 hover:bg-slate-100',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100'
  }
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2.5 text-sm', lg: 'px-6 py-3 text-sm' }
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 disabled:cursor-not-allowed disabled:opacity-50',
        styles[variant] || styles.primary,
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {loading && (
        <span
          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}
      {loading && loadingText ? loadingText : children}
    </button>
  )
}

export function Field({ label, hint, required, children, className }) {
  return (
    <div className={className}>
      {label && (
        <label className="label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children}
      {hint && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>}
    </div>
  )
}

export function TextInput({ className, ...rest }) {
  return <input className={cn('input', className)} {...rest} />
}

export function TextArea({ className, ...rest }) {
  return <textarea className={cn('input resize-y', className)} {...rest} />
}

export function Select({ className, children, ...rest }) {
  return (
    <select className={cn('input cursor-pointer', className)} {...rest}>
      {children}
    </select>
  )
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3"
    >
      <span
        className={cn(
          'relative h-6 w-11 rounded-full transition-colors duration-300',
          checked ? 'bg-gold-500' : 'bg-slate-300'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300',
            checked ? 'left-[22px]' : 'left-0.5'
          )}
        />
      </span>
      {label && <span className="text-sm font-medium text-navy-800">{label}</span>}
    </button>
  )
}

export function Badge({ children, tone = 'slate' }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-600',
    green: 'bg-emerald-50 text-emerald-600',
    gold: 'bg-gold-50 text-gold-700',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    blue: 'bg-sky-50 text-sky-600'
  }
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide', tones[tone])}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  if (status === 'published') return <Badge tone="green">Published</Badge>
  if (status === 'scheduled') return <Badge tone="amber">Scheduled</Badge>
  if (status === 'pending') return <Badge tone="blue">Pending Review</Badge>
  if (status === 'unpublished') return <Badge tone="red">Unpublished</Badge>
  if (status === 'draft') return <Badge tone="slate">Draft</Badge>
  if (status === 'archived') return <Badge tone="red">Archived</Badge>
  return <Badge>{status || '—'}</Badge>
}

export function Card({ title, subtitle, action, children, className, bodyClassName }) {
  return (
    <div className={cn('rounded-2xl border border-slate-200 bg-white shadow-sm', className)}>
      {(title || action) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
          <div>
            {title && <h3 className="font-serif text-lg font-semibold text-navy-900">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={cn('p-6', bodyClassName)}>{children}</div>
    </div>
  )
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-navy-900 sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2.5">{actions}</div>}
    </div>
  )
}

export function Table({ headers, children }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[640px] text-left text-sm">
        {headers && (
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              {headers.map((h, i) => (
                <th key={i} className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  )
}

export function RowActions({ onEdit, onDelete, onPreview, extra }) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      {extra}
      {onPreview && (
        <button onClick={onPreview} className="rounded-lg p-2 text-slate-400 transition hover:bg-sky-50 hover:text-sky-600" title="Preview">
          <EyeIcon size={15} />
        </button>
      )}
      {onEdit && (
        <button onClick={onEdit} className="rounded-lg p-2 text-slate-400 transition hover:bg-navy-50 hover:text-navy-800" title="Edit">
          <PencilIcon size={15} />
        </button>
      )}
      {onDelete && (
        <button onClick={onDelete} className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600" title="Delete">
          <Trash2 size={15} />
        </button>
      )}
    </div>
  )
}

export function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className={cn('max-h-[88vh] w-full overflow-y-auto rounded-2xl bg-white shadow-2xl animate-scale-in', wide ? 'max-w-3xl' : 'max-w-lg')}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <h3 className="font-serif text-lg font-semibold text-navy-900">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-navy-900">
            <XIcon size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmLabel = 'Delete' }) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p className="text-sm leading-relaxed text-slate-600">{message}</p>
      <div className="mt-6 flex justify-end gap-2.5">
        <Btn variant="outline" onClick={onCancel}>Cancel</Btn>
        <Btn variant="danger" onClick={onConfirm}>{confirmLabel}</Btn>
      </div>
    </Modal>
  )
}

export function ItemListEditor({ items, onChange, fields, itemTitle = 'Item' }) {
  const setItem = (i, patch) => onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)))
  const addItem = () => {
    const seed = {}
    fields.forEach((f) => {
      if (f.type === 'text' || f.type === 'link') seed[f.key] = ''
      else if (f.type === 'textarea') seed[f.key] = ''
      else if (f.type === 'number') seed[f.key] = 0
      else if (f.type === 'select') seed[f.key] = f.options?.[0]?.value || ''
      else if (f.type === 'image') seed[f.key] = ''
    })
    onChange([...(items || []), { id: uid('it'), ...seed }])
  }

  return (
    <div className="space-y-3">
      {(items || []).map((item, i) => (
        <div key={item.id || i} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {itemTitle} {i + 1}
            </p>
            <button onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600" title="Remove item">
              <Trash2 size={14} />
            </button>
          </div>
          <div className="grid gap-3">
            {fields.map((f) => (
              <Field key={f.key} label={f.label}>
                {f.type === 'textarea' ? (
                  <TextArea rows={2} value={item[f.key] || ''} onChange={(e) => setItem(i, { [f.key]: e.target.value })} placeholder={f.placeholder} />
                ) : f.type === 'select' ? (
                  <Select value={item[f.key] || ''} onChange={(e) => setItem(i, { [f.key]: e.target.value })}>
                    <option value="">—</option>
                    {f.options?.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </Select>
                ) : f.type === 'number' ? (
                  <TextInput type="number" value={item[f.key] ?? 0} onChange={(e) => setItem(i, { [f.key]: Number(e.target.value) })} />
                ) : f.type === 'image' ? (
                  <ImagePicker value={item[f.key]} onChange={(v) => setItem(i, { [f.key]: v })} />
                ) : f.type === 'link' ? (
                  <div className="grid grid-cols-2 gap-2">
                    <TextInput value={item[f.key]?.label || ''} onChange={(e) => setItem(i, { [f.key]: { ...(item[f.key] || {}), label: e.target.value } })} placeholder="Label" />
                    <TextInput value={item[f.key]?.to || ''} onChange={(e) => setItem(i, { [f.key]: { ...(item[f.key] || {}), to: e.target.value } })} placeholder="/route" />
                  </div>
                ) : (
                  <TextInput value={item[f.key] || ''} onChange={(e) => setItem(i, { [f.key]: e.target.value })} placeholder={f.placeholder} />
                )}
              </Field>
            ))}
          </div>
        </div>
      ))}
      <Btn variant="outline" onClick={addItem} className="w-full border-dashed">
        <Plus size={15} /> Add {itemTitle}
      </Btn>
    </div>
  )
}

export function SortableRow({ children, dragHandleProps, onUp, onDown, canUp, canDown }) {
  return (
    <div className="group flex items-center gap-2">
      <span {...dragHandleProps} className="cursor-grab rounded p-1.5 text-slate-300 transition hover:bg-slate-100 hover:text-slate-500">
        <GripVertical size={16} />
      </span>
      <div className="min-w-0 flex-1">{children}</div>
      <div className="flex flex-col">
        <button onClick={onUp} disabled={!canUp} className="rounded p-0.5 text-slate-300 transition hover:text-navy-900 disabled:opacity-30">
          <ChevronUp size={14} />
        </button>
        <button onClick={onDown} disabled={!canDown} className="rounded p-0.5 text-slate-300 transition hover:text-navy-900 disabled:opacity-30">
          <ChevronDown size={14} />
        </button>
      </div>
    </div>
  )
}
