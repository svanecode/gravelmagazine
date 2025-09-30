import Link from 'next/link'
import NewsletterSignup from './NewsletterSignup'

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
          <NewsletterSignup />
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
