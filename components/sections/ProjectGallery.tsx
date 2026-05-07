'use client'

import Image from 'next/image'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import { useEffect } from 'react'

const images = [
  {
    src: '/img/projekt-01.jpg',
    alt: 'Visualisierung der Wohnanlage am Achensee',
  },
  {
    src: '/img/projekt-02.jpg',
    alt: 'Architekturdetail mit natürlichen Materialien',
  },
  {
    src: '/img/projekt-03.jpg',
    alt: 'Wohnbereich mit ruhiger alpiner Atmosphäre',
  },
  {
    src: '/img/projekt-04.jpg',
    alt: 'Blickbezug zu Bergen und Landschaft',
  },
]

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
      {images.map((image, index) => (
        <a
          key={image.src}
          href={image.src}
          data-pswp-width="1600"
          data-pswp-height="1100"
          className={`relative overflow-hidden rounded-md ${
            index === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-[4/3]'
          }`}
          aria-label={`${image.alt} vergrößern`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover transition duration-700 hover:scale-105"
          />
        </a>
      ))}
    </div>
  )
}
