const MAX_IMAGE_WIDTH = 1400
const JPEG_QUALITY = 0.78

export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function compressImage(file, maxWidth = MAX_IMAGE_WIDTH) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      readFileAsDataURL(file).then(resolve).catch(reject)
      return
    }
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      try {
        const scale = Math.min(1, maxWidth / img.width)
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)
        const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY)
        URL.revokeObjectURL(url)
        resolve(dataUrl)
      } catch (err) {
        URL.revokeObjectURL(url)
        readFileAsDataURL(file).then(resolve).catch(reject)
      }
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      readFileAsDataURL(file).then(resolve).catch(reject)
    }
    img.src = url
  })
}

export function humanFileSize(bytes) {
  if (!bytes && bytes !== 0) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function fileKind(name) {
  const ext = name.split('.').pop().toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'].includes(ext)) return 'image'
  if (['mp4', 'webm', 'mov', 'ogg'].includes(ext)) return 'video'
  if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'].includes(ext)) return 'document'
  return 'file'
}

export function fileAcceptFor(kind) {
  if (kind === 'image') return 'image/*'
  if (kind === 'video') return 'video/*'
  if (kind === 'document') return '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt'
  return '*/*'
}
