import { cn } from '../lib/utils.js'

export default function RichTextRenderer({ html, className }) {
  if (!html) return null
  return <div className={cn('ql-rendered', className)} dangerouslySetInnerHTML={{ __html: html }} />
}
