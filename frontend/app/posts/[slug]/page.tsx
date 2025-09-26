import type {Metadata, ResolvingMetadata} from 'next'
import {notFound} from 'next/navigation'
import {type PortableTextBlock} from 'next-sanity'
import {Suspense} from 'react'

import Avatar from '@/app/components/Avatar'
import CoverImage from '@/app/components/CoverImage'
import {RelatedPosts} from '@/app/components/Posts'
import PortableText from '@/app/components/PortableText'
import {sanityFetch} from '@/sanity/lib/live'
import {postPagesSlugs, postQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'

type Props = {
  params: Promise<{slug: string}>
}

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: postPagesSlugs,
    // Use the published perspective in generateStaticParams
    perspective: 'published',
    stega: false,
  })
  return data
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params
  const {data: post} = await sanityFetch({
    query: postQuery,
    params,
    // Metadata should never contain stega
    stega: false,
  })
  const previousImages = (await parent).openGraph?.images || []
  const ogImage = resolveOpenGraphImage(post?.coverImage)

  return {
    authors:
      post?.author?.firstName && post?.author?.lastName
        ? [{name: `${post.author.firstName} ${post.author.lastName}`}]
        : [],
    title: post?.title,
    description: post?.excerpt,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata
}

export default async function PostPage(props: Props) {
  const params = await props.params
  const [{data: post}] = await Promise.all([sanityFetch({query: postQuery, params})])

  if (!post?._id) {
    return notFound()
  }

  return (
    <>
      {/* Hero Section */}
      <div className="bg-white">
        <div className="container pt-16 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Content Left */}
            <div className="order-2 lg:order-1">
              <div className="max-w-xl">
                {/* Category/Type */}
                <div className="mb-6">
                  <span className="text-xs font-mono tracking-widest uppercase text-gray-500 border-b border-gray-300 pb-1">
                    Article
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-normal tracking-tight text-black leading-tight mb-6">
                  {post.title}
                </h1>

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="text-lg md:text-xl font-serif font-light text-gray-600 leading-relaxed mb-8">
                    {post.excerpt}
                  </p>
                )}

                {/* Author and Date */}
                {post.author && post.author.firstName && post.author.lastName && (
                  <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                    <Avatar person={post.author} date={post.date} />
                  </div>
                )}
              </div>
            </div>

            {/* Image Right */}
            <div className="order-1 lg:order-2">
              {post?.coverImage ? (
                <div className="relative aspect-[4/3] lg:aspect-[5/4] overflow-hidden rounded-sm shadow-lg">
                  <CoverImage image={post.coverImage} priority />
                </div>
              ) : (
                <div className="aspect-[4/3] lg:aspect-[5/4] bg-gray-100 rounded-sm flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="text-4xl mb-2">📖</div>
                    <div className="text-sm font-mono tracking-wide uppercase">No Image</div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="bg-white border-t border-gray-100">
        <div className="container py-12 lg:py-16">
          {/* Article Body */}
          <article className="max-w-4xl mx-auto">
            {post.content?.length && (
              <PortableText 
                className="magazine-article" 
                value={post.content as PortableTextBlock[]} 
              />
            )}
          </article>
        </div>
      </div>
      {/* Related Articles Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="container py-16 lg:py-20">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-block">
                <span className="text-xs font-mono tracking-widest uppercase text-gray-500 border-b border-gray-300 pb-1 mb-4 block">
                  Continue Reading
                </span>
                <h2 className="text-2xl md:text-3xl font-display font-normal text-black">
                  More from GRAVEL
                </h2>
              </div>
            </div>

            {/* Related Posts */}
            <aside>
              <Suspense>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                  {await RelatedPosts({skip: post._id, limit: 3})}
                </div>
              </Suspense>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
