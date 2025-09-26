import Link from 'next/link'
import {settingsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'

export default async function Header() {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
  })

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <header className="border-b border-gray-200 bg-white">
      {/* Top bar with date and subscription */}
      <div className="border-b border-gray-100 py-2">
        <div className="container">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <time className="font-mono tracking-wide uppercase">
              {currentDate}
            </time>
            <div className="flex items-center gap-4">
              <Link 
                href="/newsletter" 
                className="hover:text-black transition-colors tracking-wide uppercase"
              >
                Newsletter
              </Link>
              <Link 
                href="/about" 
                className="hover:text-black transition-colors tracking-wide uppercase"
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container py-8">
        <div className="text-center">
          {/* Magazine masthead */}
          <Link href="/" className="group">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-light tracking-wider text-black group-hover:text-gray-700 transition-colors">
              {settings?.title || 'GRAVEL'}
            </h1>
            <div className="mt-2 text-xs tracking-widest text-gray-500 uppercase font-mono">
              Art • Culture • Ideas
            </div>
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-t border-gray-200 py-4">
        <div className="container">
          <ul className="flex items-center justify-center gap-8 md:gap-12 text-sm tracking-wide">
            <li>
              <Link 
                href="/art" 
                className="text-gray-800 hover:text-black transition-colors uppercase font-medium"
              >
                Art
              </Link>
            </li>
            <li>
              <Link 
                href="/culture" 
                className="text-gray-800 hover:text-black transition-colors uppercase font-medium"
              >
                Culture
              </Link>
            </li>
            <li>
              <Link 
                href="/essays" 
                className="text-gray-800 hover:text-black transition-colors uppercase font-medium"
              >
                Essays
              </Link>
            </li>
            <li>
              <Link 
                href="/reviews" 
                className="text-gray-800 hover:text-black transition-colors uppercase font-medium"
              >
                Reviews
              </Link>
            </li>
            <li>
              <Link 
                href="/archive" 
                className="text-gray-800 hover:text-black transition-colors uppercase font-medium"
              >
                Archive
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
