import { useMemo, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { GripVertical, Plus, Trash2, Globe, Folder, ExternalLink } from 'lucide-react'
import { useData } from '../../context/DataContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { PageHeader, Card, Field, TextInput, Select, Toggle, Btn, ConfirmDialog } from '../../components/cms/UI.jsx'
import { cn } from '../../lib/utils.js'

export default function Menus() {
  const { db, replaceAll, update, remove, create } = useData()
  const { toast } = useToast()
  const [newItem, setNewItem] = useState({ label: '', url: '/', parentId: '' })
  const [deleting, setDeleting] = useState(null)

  const items = useMemo(() => {
    const flat = (db.menus || []).slice()
    flat.sort((a, b) => {
      const pa = a.parentId || ''
      const pb = b.parentId || ''
      if (pa !== pb) return pa.localeCompare(pb)
      return (a.order || 0) - (b.order || 0)
    })
    return flat
  }, [db.menus])

  const parentOptions = items.filter((i) => !i.parentId)

  const reassignOrders = (arr) => {
    const counts = {}
    return arr.map((item, idx) => {
      const key = item.parentId || 'root'
      counts[key] = (counts[key] || 0) + 1
      return { ...item, order: counts[key] }
    })
  }

  const onDragEnd = (result) => {
    if (!result.destination) return
    const arr = [...items]
    const [moved] = arr.splice(result.source.index, 1)
    arr.splice(result.destination.index, 0, moved)
    replaceAll('menus', reassignOrders(arr))
  }

  const onAdd = () => {
    if (!newItem.label.trim() || !newItem.url.trim()) {
      toast('Label and URL are required', 'error')
      return
    }
    const parentId = newItem.parentId || null
    const parent = parentId ? items.find((i) => i.id === parentId) : null
    const siblings = items.filter((i) => (i.parentId || null) === (parentId || null))
    create('menus', {
      label: newItem.label.trim(),
      url: newItem.url.trim(),
      parentId,
      order: siblings.length + 1,
      isVisible: true,
      target: '_self'
    })
    toast('Menu item added')
    setNewItem({ label: '', url: '/', parentId: '' })
    if (parent) toast(`Nested under "${parent.label}" — shown as a dropdown`, 'info')
  }

  const label = (id) => items.find((i) => i.id === id)?.label || 'Top level'

  return (
    <div>
      <PageHeader
        title="Navigation Menus"
        subtitle="Drag to reorder · nest items to create dropdowns · the public menu updates instantly"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card
          title="Menu structure"
          subtitle={`${items.length} items · drag rows to reorder within their level`}
          className="lg:col-span-2"
        >
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="menu">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                  {items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={cn(
                            'rounded-xl border bg-white p-3 transition',
                            snapshot.isDragging ? 'border-gold-400 shadow-cardHover' : 'border-slate-200',
                            item.parentId && 'ml-6 border-l-4 border-l-gold-200'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span {...provided.dragHandleProps} className="cursor-grab text-slate-300 hover:text-slate-500">
                              <GripVertical size={16} />
                            </span>
                            {item.parentId ? <Folder size={15} className="shrink-0 text-gold-500" /> : <Globe size={15} className="shrink-0 text-navy-400" />}
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-navy-900">{item.label}</p>
                              <p className="flex items-center gap-1 truncate text-[11px] text-slate-400">
                                {item.url}
                                {item.target === '_blank' && <ExternalLink size={10} />}
                                {item.parentId && <span className="text-gold-600"> · in “{label(item.parentId)}”</span>}
                              </p>
                            </div>
                            <button
                              onClick={() => setDeleting(item)}
                              className="rounded-lg p-1.5 text-slate-300 transition hover:bg-red-50 hover:text-red-600"
                              title="Delete item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="mt-2.5 ml-8 grid grid-cols-2 gap-2 sm:grid-cols-3">
                            <Select
                              value={item.parentId || ''}
                              onChange={(e) => {
                                const parentId = e.target.value || null
                                update('menus', item.id, { parentId })
                                const arr = reassignOrders(items.map((i) => (i.id === item.id ? { ...i, parentId } : i)))
                                replaceAll('menus', arr)
                                toast(parentId ? `Moved under "${label(parentId)}" — dropdown created` : 'Moved to top level', 'info')
                              }}
                            >
                              <option value="">Top level</option>
                              {parentOptions.filter((p) => p.id !== item.id).map((p) => (
                                <option key={p.id} value={p.id}>{p.label}</option>
                              ))}
                            </Select>
                            <Select
                              value={item.target || '_self'}
                              onChange={(e) => update('menus', item.id, { target: e.target.value })}
                            >
                              <option value="_self">Same tab</option>
                              <option value="_blank">New tab</option>
                            </Select>
                            <div className="flex items-center justify-between px-1">
                              <Toggle checked={item.isVisible !== false} onChange={(v) => update('menus', item.id, { isVisible: v })} />
                              <span className="text-[11px] font-medium text-slate-400">{item.isVisible === false ? 'Hidden' : 'Visible'}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {items.length === 0 && (
                    <p className="rounded-xl border-2 border-dashed border-slate-200 py-10 text-center text-sm text-slate-400">
                      No menu items yet — add your first item below.
                    </p>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Card>

        <Card title="Add menu item" subtitle="Nest under a parent to create a dropdown">
          <div className="space-y-4">
            <Field label="Label" required>
              <TextInput value={newItem.label} onChange={(e) => setNewItem({ ...newItem, label: e.target.value })} placeholder="e.g. Open Days" />
            </Field>
            <Field label="URL" required hint="Internal route (e.g. /admissions) or full external URL">
              <TextInput value={newItem.url} onChange={(e) => setNewItem({ ...newItem, url: e.target.value })} placeholder="/admissions" />
            </Field>
            <Field label="Parent (optional)" hint="Selecting a parent creates a dropdown">
              <Select value={newItem.parentId} onChange={(e) => setNewItem({ ...newItem, parentId: e.target.value })}>
                <option value="">Top level</option>
                {parentOptions.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </Select>
            </Field>
            <Btn variant="gold" className="w-full" onClick={onAdd}>
              <Plus size={15} /> Add to Menu
            </Btn>
            <div className="rounded-xl bg-navy-50 p-4 text-xs leading-relaxed text-navy-800">
              <p className="font-bold uppercase tracking-wider text-navy-900">Tip</p>
              <p className="mt-1">
                The order shown here is the order of the public navigation. Toggling visibility hides an item without deleting it.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Remove menu item?"
        message={`"${deleting?.label}" will disappear from the public navigation.`}
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          remove('menus', deleting.id)
          toast('Menu item removed')
          setDeleting(null)
        }}
      />
    </div>
  )
}
