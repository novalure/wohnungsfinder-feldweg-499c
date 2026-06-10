'use client'

import Image from 'next/image'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import { useEffect } from 'react'

const mediaItems = [
  {
    type: 'video',
    src: '/video/hero-visualisation-video.mp4',
    poster: '/img/projekt-visualisierung-tag.png',
    alt: 'Tagesvisualisierung der Vallis Achen Residenzen mit Bergpanorama',
  },
  {
    type: 'image',
    src: '/img/projekt-schlafzimmer.jpg',
    alt: 'Schlafzimmer mit Naturholz, ruhigen Materialien und heller Atmosphaere',
    width: 2688,
    height: 1598,
  },
  {
    type: 'image',
    src: '/img/projekt-bad.jpg',
    alt: 'Badezimmer mit Holzdetails, Glasdusche und heller Ausstattung',
    width: 2057,
    height: 1376,
  },
  {
    type: 'image',
    src: '/img/projekt-wohnen.jpg',
    alt: 'Wohn- und Essbereich mit Balkon und Blick in die Berglandschaft',
    width: 3840,
    height: 4416,
  },
] as const

export function ProjectGallery() {
  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: '#projekt-gallery',
      children: 'a',
      pswpModule: () => import('photoswipe'),
    })
    lightbox.init()
    return () => lightbox.destroy()
  }, [])

  return (
    <div id="projekt-gallery" className="grid grid-cols-2 gap-3">
      {mediaItems.map((item, index) => {
        const className = `relative overflow-hidden rounded-md ${
          index === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-[4/3]'
        }`

        if (item.type === 'video') {
          return (
            <div key={item.src} className={className} aria-label={item.alt}>
              <video
                src={item.src}
                poster={item.poster}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
              />
            </div>
          )
        }

        return (
          <a
            key={item.src}
            href={item.src}
            data-pswp-width={item.width}
            data-pswp-height={item.height}
            className={className}
            aria-label={`${item.alt} vergroessern`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover transition duration-700 hover:scale-105"
            />
          </a>
        )
      })}
    </div>
  )
}
