import Link from 'next/link'
import {urlForImage} from '@/sanity/lib/utils'
import {sanityFetch} from '@/sanity/lib/live'
import {latestPostQuery} from '@/sanity/lib/queries'
import DateComponent from '@/app/components/Date'
import Avatar from '@/app/components/Avatar'
import {createDataAttribute} from 'next-sanity'

export async function Hero() {
  const {data: latestPost} = await sanityFetch({
    query: latestPostQuery,
  })

  if (!latestPost) {
    return null
  }

  const {_id, title, slug, excerpt, date, author, coverImage} = latestPost

  const attr = createDataAttribute({
    id: _id,
    type: 'post',
    path: 'title',
  })

  return (
    <section className="border-b border-gray-200">
      <div className="container py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Content */}
          <div className="space-y-6">
            {/* Category/Section label */}
            <div className="inline-block">
              <span className="text-xs font-mono tracking-widest uppercase text-gray-500 border-b border-gray-300 pb-1">
                Featured Article
              </span>
            </div>

            {/* Headline */}
            <div>
              <h1 
                data-sanity={attr()}
                className="text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-tight tracking-tight text-black mb-6"
              >
                <Link 
                  href={`/posts/${slug}`}
                  className="hover:text-gray-700 transition-colors"
                >
                  {title}
                </Link>
              </h1>

              {/* Excerpt */}
              {excerpt && (
                                <p className="text-lg md:text-xl leading-relaxed text-gray-700 font-serif font-light max-w-xl">
                  {excerpt}
                </p>
              )}
            </div>

            {/* Author and Date */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              {author && author.firstName && author.lastName && (
                <Avatar person={author} date={date} />
              )}
              
              <Link 
                href={`/posts/${slug}`}
                className="text-sm font-medium text-black hover:text-gray-700 transition-colors border-b border-black hover:border-gray-700 pb-0.5"
              >
                Read Article →
              </Link>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="relative">
            {coverImage?.asset && (
              <Link href={`/posts/${slug}`} className="block group">
                <div className="relative overflow-hidden bg-gray-100">
                  <img
                    src={urlForImage(coverImage)?.width(800).height(600).url()}
                    alt={coverImage.alt || title}
                    className="w-full h-auto aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}