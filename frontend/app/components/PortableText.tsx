/**
 * This component uses Portable Text to render a post body.
 *
 * You can learn more about Portable Text on:
 * https://www.sanity.io/docs/block-content
 * https://github.com/portabletext/react-portabletext
 * https://portabletext.org/
 *
 */

import {PortableText, type PortableTextComponents, type PortableTextBlock} from 'next-sanity'

import ResolvedLink from '@/app/components/ResolvedLink'
import {urlForImage} from '@/sanity/lib/utils'

export default function CustomPortableText({
  className,
  value,
}: {
  className?: string
  value: PortableTextBlock[]
}) {
  const components: PortableTextComponents = {
    block: {
      // Normal paragraph with drop cap for first paragraph
      normal: ({children, value, index}) => {
        const isFirstParagraph = index === 0
        
        if (isFirstParagraph) {
          return (
            <p className="drop-cap text-lg md:text-xl leading-relaxed text-gray-800 font-serif mb-6 first-letter:float-left first-letter:font-display first-letter:text-7xl md:first-letter:text-8xl first-letter:leading-none first-letter:pr-2 first-letter:pt-1 first-letter:text-black first-letter:font-normal">
              {children}
            </p>
          )
        }
        
        return (
          <p className="text-lg md:text-xl leading-relaxed text-gray-800 font-serif mb-6">
            {children}
          </p>
        )
      },
      
      h1: ({children, value}) => (
        <h1 className="group relative text-3xl md:text-4xl font-display font-normal text-black mt-12 mb-8 leading-tight">
          {children}
          <a
            href={`#${value?._key}`}
            className="absolute left-0 top-0 bottom-0 -ml-8 flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </a>
        </h1>
      ),
      
      h2: ({children, value}) => (
        <h2 className="group relative text-2xl md:text-3xl font-display font-normal text-black mt-10 mb-6 leading-tight">
          {children}
          <a
            href={`#${value?._key}`}
            className="absolute left-0 top-0 bottom-0 -ml-8 flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </a>
        </h2>
      ),

      h3: ({children}) => (
        <h3 className="text-xl md:text-2xl font-display font-normal text-black mt-8 mb-4 leading-tight">
          {children}
        </h3>
      ),

      // Custom blockquote styling
      blockquote: ({children}) => (
        <blockquote className="my-8 pl-8 border-l-4 border-brand bg-gray-50/50 py-6 pr-8">
          <div className="text-xl md:text-2xl font-serif italic leading-relaxed text-gray-700">
            {children}
          </div>
        </blockquote>
      ),
    },
    marks: {
      link: ({children, value: link}) => {
        return <ResolvedLink link={link}>{children}</ResolvedLink>
      },
    },
    types: {
      // Inline Image Component
      inlineImage: ({value}: any) => {
        const {asset, alt, caption, size = 'large', alignment = 'center'} = value
        
        if (!asset) return null

        const sizeClasses: Record<string, string> = {
          small: 'max-w-sm',
          medium: 'max-w-2xl',
          large: 'max-w-4xl',
          fullBleed: 'w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]'
        }

        const alignmentClasses: Record<string, string> = {
          left: 'mr-auto',
          center: 'mx-auto',
          right: 'ml-auto'
        }

        const sizeClass = sizeClasses[size] || sizeClasses.large
        const alignmentClass = alignmentClasses[alignment] || alignmentClasses.center

        return (
          <figure className={`my-8 ${size === 'fullBleed' ? '' : sizeClass} ${size === 'fullBleed' ? '' : alignmentClass}`}>
            <img
              src={urlForImage(value)?.width(size === 'fullBleed' ? 1200 : size === 'large' ? 800 : size === 'medium' ? 600 : 400).url()}
              alt={alt}
              className="w-full h-auto"
            />
            {caption && (
              <figcaption className="mt-3 text-sm text-gray-600 font-serif font-light italic text-center">
                {caption}
              </figcaption>
            )}
          </figure>
        )
      },

      // Image Gallery Component
      imageGallery: ({value}: any) => {
        const {images, layout = 'grid2'} = value
        
        if (!images?.length) return null

        const layoutClasses: Record<string, string> = {
          grid2: 'grid grid-cols-1 md:grid-cols-2 gap-4',
          grid3: 'grid grid-cols-1 md:grid-cols-3 gap-4',
          scroll: 'flex gap-4 overflow-x-auto pb-4'
        }

        const layoutClass = layoutClasses[layout] || layoutClasses.grid2

        return (
          <div className="my-8">
            <div className={layoutClass}>
              {images.map((image: any, index: number) => (
                <figure key={index} className={layout === 'scroll' ? 'flex-shrink-0 w-80' : ''}>
                  <img
                    src={urlForImage(image)?.width(layout === 'scroll' ? 320 : 400).height(layout === 'scroll' ? 240 : 300).fit('crop').url()}
                    alt={image.alt}
                    className="w-full h-auto object-cover aspect-[4/3]"
                  />
                  {image.caption && (
                    <figcaption className="mt-2 text-sm text-gray-600 font-serif font-light italic">
                      {image.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        )
      },

      // Pull Quote Component
      pullQuote: ({value}: any) => {
        const {quote, attribution, style = 'large'} = value
        
        if (style === 'large') {
          return (
            <div className="my-16 relative">
              <div className="max-w-4xl mx-auto text-center">
                {/* Decorative quotation marks */}
                <div className="text-6xl md:text-8xl font-display text-brand/20 leading-none mb-4">"</div>
                <blockquote className="relative -mt-8">
                  <p className="text-2xl md:text-4xl lg:text-5xl font-display font-normal leading-tight text-black italic px-8">
                    {quote}
                  </p>
                  {attribution && (
                    <footer className="mt-8 text-sm text-gray-600 font-mono tracking-widest uppercase">
                      — {attribution}
                    </footer>
                  )}
                </blockquote>
              </div>
            </div>
          )
        } else {
          return (
            <aside className="my-12 relative">
              <div className="border-l-2 border-brand pl-8 pr-4 py-6 bg-gradient-to-r from-gray-50/50 to-transparent">
                <blockquote>
                  <p className="text-xl md:text-2xl font-display font-normal leading-relaxed text-gray-800 italic">
                    "{quote}"
                  </p>
                  {attribution && (
                    <footer className="mt-4 text-sm text-gray-600 font-mono tracking-wide uppercase">
                      — {attribution}
                    </footer>
                  )}
                </blockquote>
              </div>
            </aside>
          )
        }
      },
    },
  }

  return (
    <div className={[
      'magazine-content max-w-none',
      // Links and emphasis
      '[&_a]:text-brand [&_a]:font-medium [&_a]:border-b [&_a]:border-brand/30 [&_a:hover]:border-brand',
      '[&_strong]:font-semibold [&_strong]:text-black',
      '[&_em]:italic [&_em]:font-serif',
      // Lists
      '[&_ul]:font-serif [&_ul]:text-lg [&_ul]:leading-relaxed [&_ul]:text-gray-800 [&_ul]:mb-6',
      '[&_ol]:font-serif [&_ol]:text-lg [&_ol]:leading-relaxed [&_ol]:text-gray-800 [&_ol]:mb-6',
      '[&_li]:mb-2',
      className
    ].filter(Boolean).join(' ')}>
      <PortableText components={components} value={value} />
    </div>
  )
}
