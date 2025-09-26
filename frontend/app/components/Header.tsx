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
      {/* Header bar with magazine name and navigation */}
      <div className="py-4">
        <div className="container">
          <div className="flex items-center justify-between">
            {/* Date */}
            <time className="text-xs font-mono tracking-wide uppercase text-gray-600">
              {currentDate}
            </time>
            
            {/* Magazine Name */}
            <Link href="/" className="group">
              <h1 className="text-xl md:text-2xl font-display font-normal tracking-wide text-black group-hover:text-gray-700 transition-colors">
                Gravel Magazine
              </h1>
            </Link>

            {/* Navigation */}
            <div className="flex items-center gap-4 text-xs">
              <Link 
                href="/about" 
                className="hover:text-black transition-colors tracking-wide uppercase text-gray-600"
              >
                About
              </Link>
              <Link 
                href="/newsletter" 
                className="hover:text-black transition-colors tracking-wide uppercase text-gray-600"
              >
                Subscribe
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
