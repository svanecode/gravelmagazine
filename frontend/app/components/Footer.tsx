import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="border-t border-gray-200 bg-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-200 bg-white relative overflow-hidden">
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
