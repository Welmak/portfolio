'use client'

// This component is deprecated — content editing is now inline in /admin/projects/page.tsx
// Kept for backwards compatibility
import type { ContentItem } from '@/lib/content-blocks'
import { emptyContentItem } from '@/lib/content-blocks'

interface Props {
  blocks: ContentItem[]
  onChange: (blocks: ContentItem[]) => void
  uploading: boolean
}

export default function BlockEditor({ blocks, onChange }: Props) {
  return (
    <div className="text-center py-8 text-zinc-500 text-sm">
      Content editor has been moved to the main project form.
    </div>
  )
}
