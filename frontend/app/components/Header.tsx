import Link from 'next/link'
import {settingsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'

export default async function Header() {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
  })

  const now = new Date()
  const currentDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Generate issue info (this could come from CMS in the future)
  const currentYear = now.getFullYear()
  const issueNumber = Math.floor((now.getTime() - new Date(currentYear, 0, 1).getTime()) / (1000 * 60 * 60 * 24 * 7)) + 1
  const volumeNumber = currentYear - 2023 // Assuming magazine started in 2024

  return (
    <header className="border-b border-gray-200 bg-white">
      {/* Top editorial bar */}
      <div className="border-b border-gray-100 py-3">
        <div className="container">
          <div className="flex items-center justify-between">
            {/* Left: Date and Issue Info */}
            <div className="flex items-center gap-6 text-xs text-gray-600">
              <time className="font-serif tracking-wide">
                {currentDate}
              </time>
              <div className="hidden md:flex items-center gap-2 font-mono tracking-widest uppercase">
                <span>Vol. {volumeNumber}</span>
                <span className="text-gray-400">•</span>
                <span>No. {issueNumber}</span>
              </div>
            </div>
            
            {/* Right: Links */}
            <div className="flex items-center gap-6 text-xs">
              <Link 
                href="/newsletter" 
                className="text-gray-600 hover:text-black transition-colors tracking-wide uppercase font-mono border-b border-transparent hover:border-gray-400 pb-0.5"
              >
                Subscribe
              </Link>
              <Link 
                href="/about" 
                className="text-gray-600 hover:text-black transition-colors tracking-wide uppercase font-mono border-b border-transparent hover:border-gray-400 pb-0.5"
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Masthead */}
      <div className="container py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Magazine title */}
          <Link href="/" className="group block">
            <div className="relative">
              {/* Decorative line above */}
              <div className="w-24 h-px bg-gray-300 mx-auto mb-8"></div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-light tracking-[0.2em] text-black group-hover:text-gray-700 transition-all duration-300 mb-6 leading-none">
                {settings?.title || 'GRAVEL'}
              </h1>
              
              {/* Tagline */}
              <div className="text-sm md:text-base tracking-[0.3em] text-gray-500 uppercase font-mono font-light mb-8">
                Art • Culture • Ideas
              </div>
              
              {/* Decorative line below */}
              <div className="w-24 h-px bg-gray-300 mx-auto"></div>
            </div>
          </Link>

          {/* Editorial statement */}
          <div className="mt-8 max-w-2xl mx-auto">
            <p className="text-sm md:text-base font-serif leading-relaxed text-gray-600 italic">
              A contemporary magazine exploring the intersection of art, culture, and the ideas that shape our world.
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
