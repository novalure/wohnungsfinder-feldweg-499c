'use client'

import Image from 'next/image'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import { useEffect } from 'react'

const images = [
  {
    src: '/img/projekt-visualisierung-tag.png',
    alt: 'Tagesvisualisierung der Vallis Achen Residenzen mit Bergpanorama',
    width: 1672,
    height: 941,
  },
  {
    src: '/img/projekt-schlafzimmer.jpg',
    alt: 'Schlafzimmer mit Naturholz, ruhigen Materialien und heller Atmosphäre',
    width: 2688,
    height: 1598,
  },
  {
    src: '/img/projekt-bad.jpg',
    alt: 'Badezimmer mit Holzdetails, Glasdusche und heller Ausstattung',
    width: 2057,
    height: 1376,
  },
  {
    src: '/img/projekt-wohnen.jpg',
    alt: 'Wohn- und Essbereich mit Balkon und Blick in die Berglandschaft',
    width: 1377,
    height: 768,
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
          data-pswp-width={image.width}
          data-pswp-height={image.height}
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
