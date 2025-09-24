import { supabase } from '@/lib/supabase'

export interface ImageItemInput {
  file?: File
  url?: string
  isCover?: boolean
  caption?: string
}

export interface UploadedImageMeta {
  url: string
  is_primary: boolean
  order_index: number
  caption?: string | null
}

export const imageService = {
  async uploadAndInsert(userId: string, packageId: string, items: ImageItemInput[]): Promise<void> {
    if (!items || items.length === 0) return

    const uploaded: UploadedImageMeta[] = []

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      let publicUrl = item.url || ''

      if (item.file instanceof File) {
        const ext = (item.file.name.split('.').pop() || 'jpg').toLowerCase()
        const fileName = `${userId}/${packageId}/${Date.now()}_${i}.${ext}`
        const { error: upErr } = await supabase.storage
          .from('package-images')
          .upload(fileName, item.file, { upsert: false })
        if (upErr) throw upErr

        const { data: pub } = supabase.storage
          .from('package-images')
          .getPublicUrl(fileName)
        publicUrl = pub.publicUrl
      }

      if (publicUrl) {
        uploaded.push({
          url: publicUrl,
          is_primary: !!item.isCover,
          order_index: i,
          caption: item.caption || null
        })
      }
    }

    if (uploaded.length > 0) {
      const { error } = await supabase
        .from('package_images')
        .insert(uploaded.map((u) => ({
          package_id: packageId,
          url: u.url,
          alt_text: 'Package image',
          caption: u.caption || null,
          is_primary: u.is_primary,
          order_index: u.order_index
        })))
      if (error) throw error
    }
  }
}


