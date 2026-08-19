import { OnePager } from '@/components/OnePager'
import { buildHomeJsonLd } from '@/lib/jsonld'

function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildHomeJsonLd()) }}
    />
  )
}

export default function Home() {
  return (
    <>
      <JsonLd />
      <OnePager />
    </>
  )
}
