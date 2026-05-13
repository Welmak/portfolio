// Simple content item — one type, one value, optional caption
export interface ContentItem {
  type: 'heading' | 'text' | 'image' | 'video' | 'video_file'
  value: string  // text content OR image URL OR video embed URL OR uploaded video URL
  caption?: string
}

export function emptyContentItem(type: ContentItem['type']): ContentItem {
  return { type, value: '', caption: '' }
}
