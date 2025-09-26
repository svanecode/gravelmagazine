import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="border-t border-gray-200 bg-white">
      {/* Elegant Quote Section */}
      <div className="border-b border-gray-200 py-12">
        <div className="container">
          <div className="text-center">
            <blockquote className="max-w-3xl mx-auto">
              <p className="text-xl md:text-2xl font-display font-normal text-black leading-relaxed italic">
                "Culture is not made by mixing ingredients, but by living them."
              </p>
              <footer className="mt-4 text-sm text-gray-500 font-mono tracking-wide">
                — GRAVEL EDITORIAL
              </footer>
            </blockquote>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-b border-gray-200 bg-gray-50 relative overflow-hidden">
        {/* Subtle decorative element */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-full bg-black"></div>
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full h-px bg-black"></div>
        </div>
        <div className="container py-16 relative">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-display font-normal mb-4 text-black">
              Stay Connected
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Get our latest articles, essays, and cultural commentary delivered to your inbox. 
              No spam, just thoughtful content.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto group">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 bg-white text-black placeholder-gray-500 focus:outline-none focus:border-black focus:shadow-sm transition-all duration-200"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-black text-white hover:bg-gray-800 hover:transform hover:-translate-y-0.5 transition-all duration-200 font-medium whitespace-nowrap shadow-sm hover:shadow-md"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link href="/" className="block mb-4">
              <h3 className="text-2xl font-display font-normal tracking-wide text-black">
                GRAVEL
              </h3>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              A contemporary magazine exploring the intersection of art, culture, and ideas.
            </p>
            <div className="text-xs font-mono tracking-wide uppercase text-gray-500">
              Art • Culture • Ideas
            </div>
          </div>

          {/* Sections */}
          <div>
            <h4 className="text-sm font-medium tracking-wider uppercase text-black mb-4">
              Sections
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/art" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Art
                </Link>
              </li>
              <li>
                <Link href="/culture" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Culture
                </Link>
              </li>
              <li>
                <Link href="/essays" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Essays
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="/archive" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Archive
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-sm font-medium tracking-wider uppercase text-black mb-4">
              Magazine
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-black transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contributors" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Contributors
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/submissions" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Submissions
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow */}
          <div>
            <h4 className="text-sm font-medium tracking-wider uppercase text-black mb-4">
              Follow
            </h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://instagram.com" 
                  className="text-gray-600 hover:text-black transition-all duration-200 text-sm border-b border-transparent hover:border-gray-400 pb-0.5"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a 
                  href="https://twitter.com" 
                  className="text-gray-600 hover:text-black transition-all duration-200 text-sm border-b border-transparent hover:border-gray-400 pb-0.5"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
              </li>
              <li>
                <Link href="/newsletter" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Newsletter
                </Link>
              </li>
              <li>
                <Link href="/rss" className="text-gray-600 hover:text-black transition-colors text-sm">
                  RSS Feed
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <div className="mb-4 md:mb-0">
              <span className="font-mono tracking-wide">
                © {currentYear} GRAVEL MAGAZINE. ALL RIGHTS RESERVED.
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/privacy" className="hover:text-black transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-black transition-colors">
                Terms of Use
              </Link>
              <span className="text-gray-300">•</span>
              <span className="font-mono">
                EST. {currentYear}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
