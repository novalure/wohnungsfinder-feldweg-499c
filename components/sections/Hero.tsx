'use client'

import Image from 'next/image'
import { ChevronDown, Download, Mail, Phone } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import projectConfig from '@/config/project.json'
import { ButtonLink } from '@/components/ui/Button'
import { trackEmailClick, trackPdfDownload, trackPhoneClick } from '@/lib/analytics'

export function Hero() {
  const { project, contact, downloads } = projectConfig
  const { scrollY } = useScroll()
  const scale = useTransform(scrollY, [0, 700], [1, 1.08])

  return (
    <section id="hero" className="relative min-h-[88svh] overflow-hidden md:min-h-screen">
      <motion.div className="absolute inset-0" style={{ scale }}>
        <Image
          src="/img/hero.png"
          alt="Premium-Wohnbauprojekt am Achensee mit Berg- und Wasserbezug"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_52%] md:object-center"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/35 to-ink/20" />
      <div className="section-shell relative z-10 flex min-h-[88svh] flex-col items-center justify-center pt-24 text-center text-white md:min-h-screen">
        <p className="eyebrow max-w-full break-words text-accent2">{project.address}</p>
        <h1 className="mt-6 max-w-5xl text-balance break-words font-serif text-[3.15rem] font-semibold leading-[0.92] sm:text-6xl md:text-8xl">
          {project.name}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-white/88 md:text-xl md:leading-8">
          {project.tagline}
        </p>
        <p className="mt-3 max-w-3xl text-balance break-words font-serif text-2xl leading-tight text-white sm:text-3xl md:text-5xl">
          {project.claim}
        </p>
        <div className="mt-9 flex w-full flex-wrap justify-center gap-3">
          <ButtonLink href="#kontakt">
            <Mail size={18} />
            Exposé anfragen
          </ButtonLink>
          <ButtonLink
            href={downloads.expose}
            variant="secondary"
            className="border-white/40 bg-white/10 text-white hover:bg-white/20"
            onClick={() => trackPdfDownload('Expose Hero', downloads.expose)}
          >
            <Download size={18} />
            Exposé herunterladen
          </ButtonLink>
          <ButtonLink
            href={`tel:${contact.telefon}`}
            variant="secondary"
            className="border-white/40 bg-white/10 text-white hover:bg-white/20"
            onClick={() => trackPhoneClick('hero')}
          >
            <Phone size={18} />
            {contact.telefonDisplay}
          </ButtonLink>
        </div>
        <a
          href={`mailto:${contact.email}`}
          className="mt-5 text-sm text-white/80 underline-offset-4 hover:text-white hover:underline"
          onClick={() => trackEmailClick(contact.email)}
        >
          {contact.email}
        </a>
        <a
          href="#intro"
          className="absolute bottom-8 inline-flex flex-col items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/75"
        >
          Scroll
          <ChevronDown size={20} />
        </a>
      </div>
    </section>
  )
}
