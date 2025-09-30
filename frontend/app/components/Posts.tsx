import Link from 'next/link'
import Image from 'next/image'

import {sanityFetch} from '@/sanity/lib/live'
import {morePostsQuery, allPostsQuery, featuredPostsQuery, latestPostQuery} from '@/sanity/lib/queries'
import {Post as PostType, AllPostsQueryResult} from '@/sanity.types'
import DateComponent from '@/app/components/Date'
import Date from '@/app/components/Date'
import Category from '@/app/components/Category'
import OnBoarding from '@/app/components/Onboarding'
import {urlForImage} from '@/sanity/lib/utils'
import {createDataAttribute} from 'next-sanity'

const Post = ({post}: {post: AllPostsQueryResult[number]}) => {
  const {_id, title, slug, excerpt, date, author, coverImage} = post
  const category = (post as any).category
  const content = (post as any).content
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
              <div className="space-y-2">
                <div className="relative overflow-hidden bg-gray-100 aspect-[3/2]">
                  <Image
                    src={urlForImage(coverImage)?.width(500).height(333).fit('crop').url() || ''}
                    alt={coverImage.alt || title}
                    width={500}
                    height={333}
                    className="w-full h-full object-cover"
                  />
                </div>
                {coverImage.attribution && (
                  <p className="text-xs text-gray-500 font-mono">
                    Photo by{' '}
                    {coverImage.attributionUrl ? (
                      <a 
                        href={coverImage.attributionUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gray-700 hover:text-black transition-colors underline"
                      >
                        {coverImage.attribution}
                      </a>
                    ) : (
                      <span className="text-gray-700">{coverImage.attribution}</span>
                    )}
                  </p>
                )}
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
            {/* Category */}
            {category && <Category category={category} />}

            <h3 className="font-serif text-xl leading-tight text-black group-hover:text-gray-700 transition-colors">
              {title}
            </h3>

            {excerpt && (
              <p className="text-gray-700 leading-relaxed font-serif text-sm">
                {post.excerpt}
              </p>
            )}

            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                {date && <Date dateString={date} />}
              </div>
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
        const {_id, title, slug, excerpt, date, author, coverImage, category, content} = post
        const tags = (post as any).tags

        return (
          <article key={_id} className="group">
            <Link href={`/posts/${slug}`} className="block">
              {/* Image */}
              <div className="space-y-2 mb-3">
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-gray-100">
                  {coverImage ? (
                    <Image
                      src={urlForImage(coverImage)?.width(800).height(600).fit('crop').url() || ''}
                      alt={coverImage.alt || title || ''}
                      width={800}
                      height={600}
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
                {coverImage?.attribution && (
                  <p className="text-xs text-gray-500 font-mono">
                    Photo by{' '}
                    {coverImage.attributionUrl ? (
                      <a 
                        href={coverImage.attributionUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gray-700 hover:text-black transition-colors underline"
                      >
                        {coverImage.attribution}
                      </a>
                    ) : (
                      <span className="text-gray-700">{coverImage.attribution}</span>
                    )}
                  </p>
                )}
              </div>

              {/* Content */}
              <div className="space-y-3">
                {/* Category */}
                {category && <Category category={category} />}

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

                {/* Date and Reading Time */}
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    {date && <Date dateString={date} />}
                  </div>
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
  const category = (post as any).category
  const content = (post as any).content
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
            
            {/* Category */}
            {category && <Category category={category} />}
            
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
              <div className="flex items-center gap-3 text-sm text-gray-500">
                {date && <DateComponent dateString={date} />}
              </div>
            </div>
          </div>

          {/* Image Section - Right */}
          <div className="lg:order-2 space-y-3">
            {coverImage?.asset ? (
              <div className="space-y-2">
                <div className="relative bg-gray-100 aspect-[4/5] border border-gray-200">
                  <Image
                    src={urlForImage(coverImage)?.width(500).height(625).fit('crop').url() || ''}
                    alt={coverImage.alt || title}
                    width={500}
                    height={625}
                    className="w-full h-full object-cover"
                  />
                </div>
                {coverImage.attribution && (
                  <p className="text-xs text-gray-500 font-mono">
                    Photo by{' '}
                    {coverImage.attributionUrl ? (
                      <a 
                        href={coverImage.attributionUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gray-700 hover:text-black transition-colors underline"
                      >
                        {coverImage.attribution}
                      </a>
                    ) : (
                      <span className="text-gray-700">{coverImage.attribution}</span>
                    )}
                  </p>
                )}
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

// Editorial Magazine-style Section
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
  const {_id, title, slug, excerpt, date, author, coverImage, category, content} = post
  const tags = (post as any).tags

  return (
    <article className="group">
      <Link href={`/posts/${slug}`} className="block">
        <div className="grid lg:grid-cols-5 gap-16 items-start">
          {/* Content - Takes 3/5 */}
          <div className="lg:col-span-3 space-y-8">
            {/* Category */}
            {category && (
              <div className="flex items-center space-x-4">
                <Category category={category} />
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

            {/* Date and Reading Time */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                {date && <Date dateString={date} />}
              </div>
            </div>
          </div>

          {/* Image - Takes 2/5 */}
          {coverImage?.asset && (
            <div className="lg:col-span-2 space-y-2">
              <div className="relative bg-gray-100 aspect-[4/5]">
                <Image
                  src={urlForImage(coverImage)?.width(400).height(500).fit('crop').url() || ''}
                  alt={coverImage.alt || title}
                  width={400}
                  height={500}
                  className="w-full h-full object-cover"
                />
              </div>
              {coverImage.attribution && (
                <p className="text-xs text-gray-500 font-mono">
                  Photo by{' '}
                  {coverImage.attributionUrl ? (
                    <a 
                      href={coverImage.attributionUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-700 hover:text-black transition-colors underline"
                    >
                      {coverImage.attribution}
                    </a>
                  ) : (
                    <span className="text-gray-700">{coverImage.attribution}</span>
                  )}
                </p>
              )}
              {coverImage.alt && (
                <p className="text-xs font-serif text-gray-500 italic leading-relaxed">
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
  const {_id, title, slug, excerpt, date, author, coverImage, category, content} = post
  const tags = (post as any).tags

  return (
    <article className="group">
      <Link href={`/posts/${slug}`} className="block">
        <div className="space-y-6">
          {/* Image */}
          {coverImage?.asset && (
            <div className="space-y-2">
              <div className="relative bg-gray-100 aspect-[5/3]">
                <Image
                  src={urlForImage(coverImage)?.width(600).height(360).fit('crop').url() || ''}
                  alt={coverImage.alt || title}
                  width={600}
                  height={360}
                  className="w-full h-full object-cover"
                />
              </div>
              {coverImage.attribution && (
                <p className="text-xs text-gray-500 font-mono">
                  Photo by{' '}
                  {coverImage.attributionUrl ? (
                    <a 
                      href={coverImage.attributionUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-700 hover:text-black transition-colors underline"
                    >
                      {coverImage.attribution}
                    </a>
                  ) : (
                    <span className="text-gray-700">{coverImage.attribution}</span>
                  )}
                </p>
              )}
            </div>
          )}

          {/* Content */}
          <div className="space-y-4">
            {/* Category */}
            {category && <Category category={category} />}

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

            {/* Date and Reading Time */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                {date && <Date dateString={date} />}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}

// Compact Story Component (for smaller, elegant presentation)
const CompactStory = ({post}: {post: any}) => {
  const {_id, title, slug, excerpt, date, author, coverImage, category, content} = post
  const tags = (post as any).tags

  return (
    <article className="group">
      <Link href={`/posts/${slug}`} className="block">
        <div className="space-y-4">
          {/* Image */}
          {coverImage?.asset && (
            <div className="space-y-2">
              <div className="relative bg-gray-100 aspect-[4/3]">
                <Image
                  src={urlForImage(coverImage)?.width(800).height(600).fit('crop').url() || ''}
                  alt={coverImage.alt || title}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              {coverImage.attribution && (
                <p className="text-xs text-gray-500 font-mono">
                  Photo by{' '}
                  {coverImage.attributionUrl ? (
                    <a 
                      href={coverImage.attributionUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-700 hover:text-black transition-colors underline"
                    >
                      {coverImage.attribution}
                    </a>
                  ) : (
                    <span className="text-gray-700">{coverImage.attribution}</span>
                  )}
                </p>
              )}
            </div>
          )}

          {/* Content */}
          <div className="space-y-3">
            {/* Category */}
            {category && <Category category={category} />}

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

            {/* Date and Reading Time */}
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                {date && <Date dateString={date} />}
              </div>
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
          <div className="space-y-2 mb-4">
            <div className="relative bg-gray-100 aspect-[3/2]">
              <Image
                src={urlForImage(coverImage)?.width(800).height(533).fit('crop').url() || ''}
                alt={coverImage.alt || title}
                width={800}
                height={533}
                className="w-full h-full object-cover"
              />
            </div>
            {coverImage.attribution && (
              <p className="text-xs text-gray-500 font-mono">
                Photo by{' '}
                {coverImage.attributionUrl ? (
                  <a 
                    href={coverImage.attributionUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-700 hover:text-black transition-colors underline"
                  >
                    {coverImage.attribution}
                  </a>
                ) : (
                  <span className="text-gray-700">{coverImage.attribution}</span>
                )}
              </p>
            )}
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

          {/* Date */}
          <div className="pt-2">
            {date && (
              <div className="text-sm text-gray-600">
                <Date dateString={date} />
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}



// Editorial Magazine Showcase Grid Component
const ShowcaseGrid = ({posts}: {posts: any[]}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
      {posts.map((post: any) => (
        <ShowcasePost key={post._id} post={post} />
      ))}
    </div>
  )
}

// Showcase Post Component (Editorial magazine style - text-focused)
const ShowcasePost = ({post}: {post: any}) => {
  const {_id, title, slug, excerpt, date, author, coverImage, category, content} = post
  const tags = (post as any).tags

  return (
    <article className="group space-y-4">
      <Link href={`/posts/${slug}`} className="block">
        {/* Small Image */}
        {coverImage?.asset && (
          <div className="space-y-2 mb-4">
            <div className="relative bg-gray-100 aspect-[3/2]">
              <Image
                src={urlForImage(coverImage)?.width(800).height(533).fit('crop').url() || ''}
                alt={coverImage.alt || title}
                width={800}
                height={533}
                className="w-full h-full object-cover"
              />
            </div>
            {coverImage.attribution && (
              <p className="text-xs text-gray-500 font-mono">
                Photo by{' '}
                {coverImage.attributionUrl ? (
                  <a 
                    href={coverImage.attributionUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-700 hover:text-black transition-colors underline"
                  >
                    {coverImage.attribution}
                  </a>
                ) : (
                  <span className="text-gray-700">{coverImage.attribution}</span>
                )}
              </p>
            )}
          </div>
        )}

        {/* Content - Text-focused */}
        <div className="space-y-3">
          {/* Category */}
          {category && <Category category={category} />}

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

          {/* Date and Reading Time */}
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              {date && <Date dateString={date} />}
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}

export const AllPosts = async () => {
  const {data: allPosts} = await sanityFetch({query: allPostsQuery})
  const {data: latestPost} = await sanityFetch({query: latestPostQuery})

  if (!allPosts || allPosts.length === 0) {
    return <OnBoarding />
  }

  // Skip the first post since it's shown in the hero, get next 9 posts
  const blogPosts = allPosts.slice(1, 10)

  if (blogPosts.length === 0) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="space-y-16 py-16 lg:py-20">
        {blogPosts.map((post: any, index: number) => {
          const {_id, title, slug, excerpt, date, coverImage, category, content} = post
          
          const attr = createDataAttribute({
            id: _id,
            type: 'post',
            path: 'title',
          })

          return (
            <article 
              key={post._id} 
              className={`group ${index > 0 ? 'border-t border-gray-200 pt-16' : ''}`}
            >
              <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
                {/* Left: Image */}
                {coverImage?.asset && (
                  <div className="lg:col-span-2 space-y-2">
                    <Link href={`/posts/${slug}`} className="block">
                      <div className="relative overflow-hidden bg-gray-100 aspect-[4/3]">
                        <Image
                          src={urlForImage(coverImage)?.width(800).height(600).fit('crop').url() || ''}
                          alt={coverImage.alt || title}
                          width={800}
                          height={600}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>
                    {coverImage.attribution && (
                      <p className="text-xs text-gray-500 font-mono">
                        Photo by{' '}
                        {coverImage.attributionUrl ? (
                          <a 
                            href={coverImage.attributionUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-gray-700 hover:text-black transition-colors underline"
                          >
                            {coverImage.attribution}
                          </a>
                        ) : (
                          <span className="text-gray-700">{coverImage.attribution}</span>
                        )}
                      </p>
                    )}
                  </div>
                )}

                {/* Right: Content */}
                <div className={`space-y-4 ${coverImage?.asset ? 'lg:col-span-3' : 'lg:col-span-5'}`}>
                  {/* Category */}
                  {category && <Category category={category} />}
                  
                  {/* Title */}
                  <div>
                    <h2 
                      data-sanity={attr()}
                      className="font-serif text-2xl md:text-3xl lg:text-4xl leading-tight tracking-tight text-black group-hover:text-gray-700 transition-colors"
                    >
                      <Link href={`/posts/${slug}`}>
                        {title}
                      </Link>
                    </h2>
                  </div>

                  {/* Excerpt */}
                  {excerpt && (
                    <div className="pt-2">
                      <p className="text-base md:text-lg leading-relaxed text-gray-700 font-serif max-w-2xl">
                        {excerpt.length > 200 ? `${excerpt.substring(0, 200)}...` : excerpt}
                      </p>
                    </div>
                  )}

                  {/* Date and Read More */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      {date && <Date dateString={date} />}
                    </div>
                    
                    <Link 
                      href={`/posts/${slug}`}
                      className="text-sm font-medium text-black hover:text-gray-700 transition-colors border-b border-black hover:border-gray-700 pb-0.5"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
