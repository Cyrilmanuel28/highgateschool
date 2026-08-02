import { useRef, useState } from 'react'
import ReactQuill from 'react-quill-new'
import MediaPickerModal from './MediaPickerModal.jsx'

const TOOLBAR = [
  [{ header: [2, 3, 4, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ align: [] }],
  ['link', 'image'],
  ['blockquote'],
  [{ indent: '-1' }, { indent: '+1' }],
  ['clean']
]

export default function RichTextEditor({ value, onChange, placeholder = 'Write your content here…' }) {
  const quillRef = useRef(null)
  const [pickerOpen, setPickerOpen] = useState(false)

  const modules = {
    toolbar: {
      container: TOOLBAR,
      handlers: {
        image() {
          setPickerOpen(true)
        }
      }
    }
  }

  const insertImage = (m, url) => {
    const quill = quillRef.current?.getEditor?.()
    if (!quill) return
    const index = quill.getSelection()?.index ?? quill.getLength() - 1
    quill.insertEmbed(index, 'image', url)
    quill.setSelection(index + 1)
  }

  return (
    <div>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
      />
      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(m, url) => {
          insertImage(m, url)
          setPickerOpen(false)
        }}
        title="Insert image from media library"
      />
    </div>
  )
}
