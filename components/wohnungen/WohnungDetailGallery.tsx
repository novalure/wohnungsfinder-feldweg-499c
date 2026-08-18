'use client'

import Image from 'next/image'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import { useEffect } from 'react'

export type WohnungGalleryItem = {
  src: string
  alt: string
  width: number
  height: number
}

type Props = {
  galleryId: string
  items: WohnungGalleryItem[]
}

export function WohnungDetailGallery({ galleryId, items }: Props) {
  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: `#${galleryId}`,
      children: 'a',
      pswpModule: () => import('photoswipe'),
    })

    lightbox.init()
    return () => lightbox.destroy()
  }, [galleryId])

  return (
    <div id={galleryId} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => {
        const isFeature = index === 0

        return (
          <a
            key={item.src}
            href={item.src}
            data-pswp-width={item.width}
            data-pswp-height={item.height}
            className={`group relative overflow-hidden rounded-md bg-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              isFeature ? 'aspect-[2/1] sm:col-span-2 lg:col-span-2' : 'aspect-[4/3]'
            }`}
            aria-label={`${item.alt} vergrößern`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes={
                isFeature
                  ? '(min-width: 1024px) 50vw, 100vw'
                  : '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw'
              }
              className="object-cover transition duration-700 group-hover:scale-105"
            />
          </a>
        )
      })}
    </div>
  )
}
