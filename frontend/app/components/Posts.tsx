import Link from 'next/link'

import {sanityFetch} from '@/sanity/lib/live'
import {morePostsQuery, allPostsQuery, featuredPostsQuery} from '@/sanity/lib/queries'
import {Post as PostType, AllPostsQueryResult} from '@/sanity.types'
import DateComponent from '@/app/components/Date'
import OnBoarding from '@/app/components/Onboarding'
import Avatar from '@/app/components/Avatar'
import {urlForImage} from '@/sanity/lib/utils'
import {createDataAttribute} from 'next-sanity'

const Post = ({post}: {post: AllPostsQueryResult[number]}) => {
  const {_id, title, slug, excerpt, date, author, coverImage} = post
  const tags = (post as any).tags

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
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-[3/2] bg-gray-100 flex items-center justify-center relative">
                <div className="text-gray-400 text-center">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-mono">No Image</span>
                </div>

              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="space-y-4">
            {/* Tag */}
            {tags && tags.length > 0 && (
              <span className="text-xs font-serif tracking-wide uppercase text-gray-500 border-b border-gray-300 pb-1">
                {tags[0]}
              </span>
            )}

            <h3 className="font-serif text-xl leading-tight text-black group-hover:text-gray-700 transition-colors">
              {title}
            </h3>

            {excerpt && (
              <p className="text-gray-700 leading-relaxed font-serif text-sm">
                {post.excerpt}
              </p>
            )}

            <div className="pt-3 border-t border-gray-100">
              {author && author.firstName && author.lastName && (
                <Avatar person={author} date={date} small={true} />
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
  <div className="max-w-7xl mx-auto px-4">
    {heading && (
      <div className="text-center mb-16">
        <div className="flex items-center justify-center space-x-6 mb-6">
          <div className="w-12 h-px bg-black"></div>
          <h2 className="font-serif text-2xl md:text-3xl tracking-wide text-black">
            {heading}
          </h2>
          <div className="w-12 h-px bg-black"></div>
        </div>
        {subHeading && (
          <p className="text-gray-600 max-w-2xl mx-auto font-serif text-lg leading-relaxed">
            {subHeading}
          </p>
        )}
      </div>
    )}
    <div>{children}</div>
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
        const tags = (post as any).tags

        return (
          <article key={_id} className="group">
            <Link href={`/posts/${slug}`} className="block">
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm mb-3 bg-gray-100">
                {coverImage ? (
                  <img
                    src={urlForImage(coverImage)?.width(400).height(300).fit('crop').url()}
                    alt={coverImage.alt || title || ''}
                    className="w-full h-full object-cover"
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
              <div className="space-y-3">
                {/* Tags */}
                {tags && tags.length > 0 && (
                  <span className="text-xs font-serif tracking-wide uppercase text-gray-500">
                    {tags[0]}
                  </span>
                )}

                {/* Title */}
                <h3 className="font-serif text-lg leading-tight text-black group-hover:text-gray-700 transition-colors">
                  {title}
                </h3>

                {/* Excerpt */}
                {excerpt && (
                  <p className="font-serif text-gray-700 leading-relaxed text-sm">
                    {excerpt.length > 100 ? `${excerpt.substring(0, 100)}...` : excerpt}
                  </p>
                )}

                {/* Author and Date */}
                <div className="pt-2 border-t border-gray-100">
                  {author && author.firstName && author.lastName && (
                    <Avatar person={author} date={date} small={true} />
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
  const tags = (post as any).tags

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
          <div className="lg:order-1 space-y-6">
            {/* Editorial Label */}
            <div className="flex items-center space-x-4">
              <div className="w-6 h-px bg-black"></div>
              <span className="text-xs font-serif tracking-[0.2em] uppercase text-gray-600 font-light">
                Latest
              </span>
            </div>
            
            {/* Tags */}
            {tags && tags.length > 0 && (
              <span className="text-xs font-serif tracking-wide uppercase text-gray-500 border-b border-gray-300 pb-1">
                {tags[0]}
              </span>
            )}
            
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight text-black group-hover:text-gray-700 transition-colors">
              {title}
            </h2>

            {excerpt && (
              <p className="text-xl leading-relaxed font-serif text-gray-800">
                {excerpt}
              </p>
            )}

            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              {author && author.firstName && author.lastName && (
                <div className="space-y-1">
                  <div className="text-sm">
                    <span className="font-serif text-gray-800">By </span>
                    <span className="font-serif font-medium text-black">
                      {author.firstName} {author.lastName}
                    </span>
                  </div>

                </div>
              )}
              {date && (
                <div className="text-sm font-serif text-gray-500">
                  <DateComponent dateString={date} />
                </div>
              )}
            </div>
          </div>

          {/* Image Section - Right */}
          <div className="lg:order-2 space-y-3">
            {coverImage?.asset ? (
              <div className="space-y-2">
                <div className="relative bg-gray-100 aspect-[4/5] border border-gray-200">
                  <img
                    src={urlForImage(coverImage)?.width(500).height(625).fit('crop').url()}
                    alt={coverImage.alt || title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {coverImage.alt && (
                  <p className="text-xs font-serif text-gray-500 italic leading-relaxed">
                    {coverImage.alt}
                  </p>
                )}
              </div>
            ) : (
              <div className="aspect-[3/2] bg-gray-100 flex items-center justify-center relative">
                <div className="text-gray-400 text-center">
                  <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-mono">No Image</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}

// New Yorker-style Editorial Section
const EditorialSection = ({posts}: {posts: any[]}) => {
  // Create varied editorial layouts without assuming categories
  const [leadPost, secondPost, thirdPost, ...remainingPosts] = posts

  return (
    <div className="space-y-20 mt-24">
      {/* Lead Story - Full Width with better proportions */}
      {leadPost && <LeadStory post={leadPost} />}

      {/* Secondary Stories - Asymmetrical Layout */}
      {(secondPost || thirdPost) && (
        <div className="border-t border-gray-200 pt-16">
          <div className="grid lg:grid-cols-3 gap-16">
            {/* Left: Larger Story */}
            {secondPost && (
              <div className="lg:col-span-2">
                <LargeStory post={secondPost} />
              </div>
            )}
            
            {/* Right: Smaller Story */}
            {thirdPost && (
              <div className="lg:col-span-1">
                <CompactStory post={thirdPost} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Remaining Posts - Clean Grid */}
      {remainingPosts.length > 0 && (
        <div className="border-t border-gray-200 pt-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {remainingPosts.map((post: any) => (
              <CompactStory key={post._id} post={post} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Lead Story Component (Full-width, text-heavy)
const LeadStory = ({post}: {post: any}) => {
  const {_id, title, slug, excerpt, date, author, coverImage} = post
  const tags = (post as any).tags

  return (
    <article className="group">
      <Link href={`/posts/${slug}`} className="block">
        <div className="grid lg:grid-cols-5 gap-16 items-start">
          {/* Content - Takes 3/5 */}
          <div className="lg:col-span-3 space-y-8">
            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="flex items-center space-x-4">
                <span className="text-xs font-serif tracking-wide uppercase text-gray-500 border-b border-gray-300 pb-1">
                  {tags[0]}
                </span>
              </div>
            )}

            {/* Title */}
            <h2 className="font-serif text-3xl md:text-4xl xl:text-5xl leading-tight text-black group-hover:text-gray-700 transition-colors">
              {title}
            </h2>

            {/* Extended Excerpt */}
            {excerpt && (
              <div className="space-y-4">
                <p className="text-lg leading-relaxed font-serif text-gray-800">
                  {excerpt}
                </p>
                <div className="text-sm font-serif text-gray-600 italic">
                  Continue reading...
                </div>
              </div>
            )}

            {/* Byline */}
            <div className="pt-4 border-t border-gray-100">
              {author && author.firstName && author.lastName && (
                <Avatar person={author} date={date} />
              )}
            </div>
          </div>

          {/* Image - Takes 2/5 */}
          {coverImage?.asset && (
            <div className="lg:col-span-2">
              <div className="relative bg-gray-100 aspect-[4/5]">
                <img
                  src={urlForImage(coverImage)?.width(400).height(500).fit('crop').url()}
                  alt={coverImage.alt || title}
                  className="w-full h-full object-cover"
                />
              </div>
              {coverImage.alt && (
                <p className="text-xs font-serif text-gray-500 italic mt-2 leading-relaxed">
                  {coverImage.alt}
                </p>
              )}
            </div>
          )}
        </div>
      </Link>
    </article>
  )
}

// Large Story Component (for secondary featured content)
const LargeStory = ({post}: {post: any}) => {
  const {_id, title, slug, excerpt, date, author, coverImage} = post
  const tags = (post as any).tags

  return (
    <article className="group">
      <Link href={`/posts/${slug}`} className="block">
        <div className="space-y-6">
          {/* Image */}
          {coverImage?.asset && (
            <div className="relative bg-gray-100 aspect-[5/3]">
              <img
                src={urlForImage(coverImage)?.width(600).height(360).fit('crop').url()}
                alt={coverImage.alt || title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="space-y-4">
            {/* Tag */}
            {tags && tags.length > 0 && (
              <span className="text-xs font-serif tracking-wide uppercase text-gray-500">
                {tags[0]}
              </span>
            )}

            {/* Title */}
            <h2 className="font-serif text-2xl md:text-3xl leading-tight text-black group-hover:text-gray-700 transition-colors">
              {title}
            </h2>

            {/* Excerpt */}
            {excerpt && (
              <p className="font-serif text-lg text-gray-700 leading-relaxed">
                {excerpt.length > 150 ? `${excerpt.substring(0, 150)}...` : excerpt}
              </p>
            )}

            {/* Byline */}
            <div className="pt-4 border-t border-gray-100">
              {author && author.firstName && author.lastName && (
                <Avatar person={author} date={date} small={true} />
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}

// Compact Story Component (for smaller, elegant presentation)
const CompactStory = ({post}: {post: any}) => {
  const {_id, title, slug, excerpt, date, author, coverImage} = post
  const tags = (post as any).tags

  return (
    <article className="group">
      <Link href={`/posts/${slug}`} className="block">
        <div className="space-y-4">
          {/* Image */}
          {coverImage?.asset && (
            <div className="relative bg-gray-100 aspect-[4/3]">
              <img
                src={urlForImage(coverImage)?.width(400).height(300).fit('crop').url()}
                alt={coverImage.alt || title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="space-y-3">
            {/* Tag */}
            {tags && tags.length > 0 && (
              <span className="text-xs font-serif tracking-wide uppercase text-gray-500">
                {tags[0]}
              </span>
            )}

            {/* Title */}
            <h3 className="font-serif text-lg leading-tight text-black group-hover:text-gray-700 transition-colors">
              {title}
            </h3>

            {/* Excerpt */}
            {excerpt && (
              <p className="font-serif text-sm text-gray-700 leading-relaxed">
                {excerpt.length > 90 ? `${excerpt.substring(0, 90)}...` : excerpt}
              </p>
            )}

            {/* Byline */}
            <div className="pt-2 border-t border-gray-100">
              {author && author.firstName && author.lastName && (
                <Avatar person={author} date={date} small={true} />
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}

// Medium Story Component
const MediumStory = ({post, isImageLeft}: {post: any; isImageLeft: boolean}) => {
  const {_id, title, slug, excerpt, date, author, coverImage} = post
  const tags = (post as any).tags

  return (
    <article className="group space-y-4">
      <Link href={`/posts/${slug}`} className="block">
        {/* Image */}
        {coverImage?.asset && (
          <div className="relative bg-gray-100 aspect-[3/2] mb-4">
            <img
              src={urlForImage(coverImage)?.width(400).height(267).fit('crop').url()}
              alt={coverImage.alt || title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="space-y-3">
          {/* Tag */}
          {tags && tags.length > 0 && (
            <span className="text-xs font-serif tracking-wide uppercase text-gray-500">
              {tags[0]}
            </span>
          )}

          {/* Title */}
          <h3 className="font-serif text-xl leading-tight text-black group-hover:text-gray-700 transition-colors">
            {title}
          </h3>

          {/* Excerpt */}
          {excerpt && (
            <p className="font-serif text-gray-700 leading-relaxed text-sm">
              {excerpt.length > 120 ? `${excerpt.substring(0, 120)}...` : excerpt}
            </p>
          )}

          {/* Byline */}
          <div className="pt-2">
            {author && author.firstName && author.lastName && (
              <Avatar person={author} date={date} small={true} />
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}



// New Yorker-style Showcase Grid Component
const ShowcaseGrid = ({posts}: {posts: any[]}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
      {posts.map((post: any) => (
        <ShowcasePost key={post._id} post={post} />
      ))}
    </div>
  )
}

// Showcase Post Component (New Yorker style - text-focused)
const ShowcasePost = ({post}: {post: any}) => {
  const {_id, title, slug, excerpt, date, author, coverImage} = post
  const tags = (post as any).tags

  return (
    <article className="group space-y-4">
      <Link href={`/posts/${slug}`} className="block">
        {/* Small Image */}
        {coverImage?.asset && (
          <div className="relative bg-gray-100 aspect-[3/2] mb-4">
            <img
              src={urlForImage(coverImage)?.width(300).height(200).fit('crop').url()}
              alt={coverImage.alt || title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content - Text-focused */}
        <div className="space-y-3">
          {/* Title - Larger and more prominent */}
          <h3 className="font-serif text-xl md:text-2xl leading-tight text-black group-hover:text-gray-700 transition-colors">
            {title}
          </h3>

          {/* Longer Excerpt */}
          {excerpt && (
            <p className="font-serif text-base text-gray-700 leading-relaxed">
              {excerpt.length > 140 ? `${excerpt.substring(0, 140)}...` : excerpt}
            </p>
          )}

          {/* Author Info */}
          <div className="pt-3 border-t border-gray-100">
            {author && author.firstName && author.lastName && (
              <div className="space-y-1">
                <p className="font-serif text-sm text-black">
                  <span className="font-medium">{author.firstName} {author.lastName}</span>
                  {excerpt && excerpt.length > 100 && (
                    <span className="text-gray-600"> shares some of his favorite insights from recent work.</span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}

export const AllPosts = async () => {
  const {data: allPosts} = await sanityFetch({query: allPostsQuery})
  const {data: featuredPosts} = await sanityFetch({query: featuredPostsQuery})

  if (!allPosts || allPosts.length === 0) {
    return <OnBoarding />
  }

  // Skip the first post since it's featured in the hero
  const latestPosts = allPosts.slice(1, 7) // Get 6 posts for 3-column grid

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-20">
      {/* Latest Section */}
      <section className="py-20">
        <div className="text-center mb-20">
          <h2 className="font-serif text-2xl md:text-3xl tracking-wide text-black">
            Latest
          </h2>
        </div>
        
        {latestPosts.length > 0 && <ShowcaseGrid posts={latestPosts} />}
      </section>

      {/* Featured Sections - Each featured post gets its own section, Hero-style layout */}
      {featuredPosts && featuredPosts.length > 0 && featuredPosts.map((featuredPost: any, index: number) => {
        const {_id, title, slug, excerpt, date, author, coverImage} = featuredPost
        
        const attr = createDataAttribute({
          id: _id,
          type: 'post',
          path: 'title',
        })
        
        return (
          <section key={featuredPost._id} className="border-b border-gray-200 bg-white">
            <div className="container py-16 lg:py-24">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left side - Content */}
                <div className="space-y-6">
                  {/* Category/Section label */}
                  <div className="inline-block">
                    <span className="text-xs font-mono tracking-widest uppercase text-gray-500 border-b border-gray-300 pb-1">
                      Featured
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
                    <Link href={`/posts/${slug}`} className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm">
                      <div className="relative overflow-hidden bg-gray-100 aspect-[4/3]">
                        <img
                          src={urlForImage(coverImage)?.width(1200).height(900).url() || ''}
                          alt={coverImage.alt || title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}
