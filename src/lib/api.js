const API_BASE = import.meta.env.VITE_API_URL || ''

function endpoint(entity) {
  return `${API_BASE}/api/${entity}`
}

async function remoteRequest(path, options = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

export const api = {
  get remote() {
    return Boolean(API_BASE)
  },

  async list(entity) {
    if (this.remote) return remoteRequest(endpoint(entity))
    const { loadDb } = await import('./store.js')
    return loadDb()[entity] || []
  },

  async create(entity, data) {
    if (this.remote) return remoteRequest(endpoint(entity), { method: 'POST', body: JSON.stringify(data) })
    return data
  },

  async update(entity, id, data) {
    if (this.remote) return remoteRequest(`${endpoint(entity)}/${id}`, { method: 'PUT', body: JSON.stringify(data) })
    return data
  },

  async remove(entity, id) {
    if (this.remote) return remoteRequest(`${endpoint(entity)}/${id}`, { method: 'DELETE' })
    return id
  },

  async upload(file) {
    if (this.remote) {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(`${API_BASE}/api/upload`, { method: 'POST', body: form })
      if (!res.ok) throw new Error('Upload failed')
      return res.json()
    }
    return null
  }
}
