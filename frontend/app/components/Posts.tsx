import Link from 'next/link'

import {sanityFetch} from '@/sanity/lib/live'
import {morePostsQuery, allPostsQuery} from '@/sanity/lib/queries'
import {Post as PostType, AllPostsQueryResult} from '@/sanity.types'
import DateComponent from '@/app/components/Date'
import OnBoarding from '@/app/components/Onboarding'
import Avatar from '@/app/components/Avatar'
import {createDataAttribute} from 'next-sanity'

const Post = ({post}: {post: AllPostsQueryResult[number]}) => {
  const {_id, title, slug, excerpt, date, author} = post

  const attr = createDataAttribute({
    id: _id,
    type: 'post',
    path: 'title',
  })

  return (
    <article
      data-sanity={attr()}
      key={_id}
      className="group border-b border-gray-200 pb-8 mb-8 last:border-b-0 last:mb-0 last:pb-0"
    >
      <Link href={`/posts/${slug}`} className="block">
        <div className="space-y-3">
          <h3 className="text-xl md:text-2xl font-display font-normal leading-tight group-hover:text-gray-600 transition-colors">
            {title}
          </h3>

          {excerpt && (
            <p className="text-gray-700 leading-relaxed line-clamp-2">
              {excerpt}
            </p>
          )}

          <div className="flex items-center justify-between text-sm">
            {author && author.firstName && author.lastName && (
              <div className="flex items-center space-x-2">
                <Avatar person={author} small={true} />
                <span className="text-gray-600 font-medium">
                  {author.firstName} {author.lastName}
                </span>
              </div>
            )}
            <time className="text-gray-500 font-mono text-xs" dateTime={date}>
              <DateComponent dateString={date} />
            </time>
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
          <p className="text-gray-600 max-w-2xl mx-auto">
            {subHeading}
          </p>
        )}
      </div>
    )}
    <div className="max-w-3xl mx-auto">{children}</div>
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

  return (
    <Posts
      heading="More Articles"
      subHeading="Discover our latest stories, essays, and cultural commentary."
    >
      {remainingPosts.map((post: any) => (
        <Post key={post._id} post={post} />
      ))}
    </Posts>
  )
}
