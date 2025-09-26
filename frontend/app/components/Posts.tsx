import Link from 'next/link'

import {sanityFetch} from '@/sanity/lib/live'
import {morePostsQuery, allPostsQuery} from '@/sanity/lib/queries'
import {Post as PostType, AllPostsQueryResult} from '@/sanity.types'
import DateComponent from '@/app/components/Date'
import OnBoarding from '@/app/components/Onboarding'
import Avatar from '@/app/components/Avatar'
import {urlForImage} from '@/sanity/lib/utils'
import {createDataAttribute} from 'next-sanity'

const Post = ({post}: {post: AllPostsQueryResult[number]}) => {
  const {_id, title, slug, excerpt, date, author, coverImage} = post

  const attr = createDataAttribute({
    id: _id,
    type: 'post',
    path: 'title',
  })

  return (
    <article data-sanity={attr()} key={_id} className="group">
      <Link href={`/posts/${slug}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm">
        <div className="space-y-4">
          {/* Image Section */}
          <div className="w-full relative">
            {coverImage?.asset ? (
              <div className="relative overflow-hidden bg-gray-100 aspect-[3/2]">
                <img
                  src={urlForImage(coverImage)?.width(500).height(333).url()}
                  alt={coverImage.alt || title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Chip */}
                <span className="absolute top-2 left-2 bg-white/85 backdrop-blur-sm text-[10px] font-mono tracking-widest uppercase px-2 py-1 rounded-sm shadow-sm border border-gray-200 text-gray-700">
                  Article
                </span>
              </div>
            ) : (
              <div className="aspect-[3/2] bg-gray-100 flex items-center justify-center relative">
                <div className="text-gray-400 text-center">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-mono">No Image</span>
                </div>
                <span className="absolute top-2 left-2 bg-white/85 backdrop-blur-sm text-[10px] font-mono tracking-widest uppercase px-2 py-1 rounded-sm shadow-sm border border-gray-200 text-gray-700">
                  Article
                </span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="space-y-3">
            <h3 className="text-lg md:text-xl font-display font-normal leading-tight group-hover:text-gray-600 transition-colors">
              {title}
            </h3>

            {excerpt && (
              <p className="text-gray-700 leading-relaxed line-clamp-3 text-sm font-serif">
                {post.excerpt}
              </p>
            )}

            <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100">
              {author && author.firstName && author.lastName && (
                <Avatar person={author} small={true} date={date} />
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}

const Posts = ({
  children,
  heading,
  subHeading,
}: {
  children: React.ReactNode
  heading?: string
  subHeading?: string
}) => (
  <div>
    {heading && (
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-display font-normal tracking-tight text-black mb-3">
          {heading}
        </h2>
        {subHeading && (
          <p className="text-gray-600 max-w-2xl mx-auto font-serif">
            {subHeading}
          </p>
        )}
      </div>
    )}
    <div className="max-w-6xl mx-auto">{children}</div>
  </div>
)

export const MorePosts = async ({skip, limit}: {skip: string; limit: number}) => {
  const {data} = await sanityFetch({
    query: morePostsQuery,
    params: {skip, limit},
  })

  if (!data || data.length === 0) {
    return null
  }

  return (
    <Posts heading={`Recent Posts (${data?.length})`}>
      {data?.map((post: any) => (
        <Post key={post._id} post={post} />
      ))}
    </Posts>
  )
}

// Related posts component for article pages (cleaner layout)
export const RelatedPosts = async ({skip, limit}: {skip: string; limit: number}) => {
  const {data} = await sanityFetch({
    query: morePostsQuery,
    params: {skip, limit},
  })

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500 font-serif italic">
        No related articles found.
      </div>
    )
  }

  return (
    <>
      {data?.map((post: any) => {
        const {_id, title, slug, excerpt, date, author, coverImage} = post

        return (
          <article key={_id} className="group">
            <Link href={`/posts/${slug}`} className="block">
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm mb-3 bg-gray-100">
                {coverImage ? (
                  <img
                    src={urlForImage(coverImage)?.width(400).height(300).fit('crop').url()}
                    alt={coverImage.alt || title || ''}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <div className="text-2xl mb-1">📖</div>
                      <span className="text-xs font-mono tracking-wide uppercase">No Image</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-2">
                {/* Category */}
                <div>
                  <span className="text-xs font-mono tracking-widest uppercase text-gray-500">
                    Article
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-display font-normal leading-tight text-black group-hover:text-gray-600 transition-colors">
                  {title}
                </h3>

                {/* Excerpt */}
                {excerpt && (
                  <p className="text-gray-600 leading-relaxed text-sm font-serif line-clamp-2">
                    {excerpt}
                  </p>
                )}

                {/* Author and Date */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                  {author && author.firstName && author.lastName && (
                    <span className="font-medium text-gray-700 truncate">
                      {author.firstName} {author.lastName}
                    </span>
                  )}
                  {date && (
                    <div className="text-gray-500 font-mono tracking-wide flex-shrink-0 ml-2">
                      <DateComponent dateString={date} />
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </article>
        )
      })}
    </>
  )
}

// Featured secondary post component (larger layout)
const FeaturedPost = ({post}: {post: AllPostsQueryResult[number]}) => {
  const {_id, title, slug, excerpt, date, author, coverImage} = post

  const attr = createDataAttribute({
    id: _id,
    type: 'post',
    path: 'title',
  })

  return (
    <article
      data-sanity={attr()}
      className="group mb-16 pb-16 border-b border-gray-200"
    >
      <Link href={`/posts/${slug}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Content Section - Left */}
          <div className="lg:order-1 space-y-4">
            <div className="inline-block">
              <span className="text-xs font-mono tracking-widest uppercase text-gray-500 border-b border-gray-300 pb-1">
                Editor&apos;s Pick
              </span>
            </div>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-normal leading-tight group-hover:text-gray-600 transition-colors">
              {title}
            </h2>

            {excerpt && (
              <p className="text-lg text-gray-700 leading-relaxed">
                {excerpt}
              </p>
            )}

            <div className="flex items-center justify-between pt-4">
              {author && author.firstName && author.lastName && (
                <Avatar person={author} date={date} />
              )}
            </div>
          </div>

          {/* Image Section - Right */}
          <div className="lg:order-2">
            {coverImage?.asset ? (
              <div className="relative overflow-hidden bg-gray-100 aspect-[3/2]">
                <img
                  src={urlForImage(coverImage)?.width(600).height(400).url()}
                  alt={coverImage.alt || title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-white/85 backdrop-blur-sm text-[10px] font-mono tracking-widest uppercase px-2 py-1 rounded-sm shadow-sm border border-gray-200 text-gray-700">Feature</span>
              </div>
            ) : (
              <div className="aspect-[3/2] bg-gray-100 flex items-center justify-center relative">
                <div className="text-gray-400 text-center">
                  <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-mono">No Image</span>
                </div>
                <span className="absolute top-3 left-3 bg-white/85 backdrop-blur-sm text-[10px] font-mono tracking-widest uppercase px-2 py-1 rounded-sm shadow-sm border border-gray-200 text-gray-700">Feature</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}

export const AllPosts = async () => {
  const {data} = await sanityFetch({query: allPostsQuery})

  if (!data || data.length === 0) {
    return <OnBoarding />
  }

  // Skip the first post since it's featured in the hero
  const remainingPosts = data.slice(1)

  if (remainingPosts.length === 0) {
    return null
  }

  // Feature the second post prominently, then show the rest
  const [featuredPost, ...otherPosts] = remainingPosts

  return (
    <Posts
      heading="Latest Stories"
      subHeading="Discover our latest stories, essays, and cultural commentary."
    >
      {featuredPost && <FeaturedPost post={featuredPost} />}
      
      {otherPosts.length > 0 && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {otherPosts.map((post: any) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </Posts>
  )
}
