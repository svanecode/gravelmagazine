import type {Metadata, ResolvingMetadata} from 'next'
import {notFound} from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {sanityFetch} from '@/sanity/lib/live'
import {raceQuery, raceSlugs} from '@/sanity/lib/queries'
import {resolveOpenGraphImage, urlForImage} from '@/sanity/lib/utils'
import CoverImage from '@/app/components/CoverImage'
import DateComponent from '@/app/components/Date'
import Category from '@/app/components/Category'

type Props = {
  params: Promise<{slug: string}>
}

export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: raceSlugs,
    perspective: 'published',
    stega: false,
  })
  return data
}

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params
  const {data: race} = await sanityFetch({
    query: raceQuery,
    params,
    stega: false,
  })
  const previousImages = (await parent).openGraph?.images || []
  const ogImage = resolveOpenGraphImage(race?.coverImage)

  return {
    title: race?.name,
    description: race?.description,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata
}

function formatLocation(location: any) {
  if (!location) return 'Location TBD'
  const parts = [location.city, location.region, location.country].filter(Boolean)
  return parts.join(', ')
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})
}

export default async function RacePage(props: Props) {
  const params = await props.params
  const {data: race} = await sanityFetch({query: raceQuery, params})

  if (!race?._id) {
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
                {/* Type/Location */}
                <div className="mb-6">
                  <span className="text-xs font-mono tracking-widest uppercase text-gray-500 border-b border-gray-300 pb-1">
                    {formatLocation(race.location)}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-normal tracking-tight text-black leading-tight mb-6">
                  {race.name}
                </h1>

                {/* Description */}
                {race.description && (
                  <p className="text-lg md:text-xl font-serif font-light text-gray-600 leading-relaxed mb-8">
                    {race.description}
                  </p>
                )}

                {/* Race Details */}
                <div className="pt-6 border-t border-gray-200 space-y-3">
                  {race.distances && race.distances.length > 0 && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-mono text-gray-500 uppercase tracking-wide">
                        Distances:
                      </span>
                      <span className="text-base text-gray-900">{race.distances.join(', ')}</span>
                    </div>
                  )}
                  {race.terrain && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-mono text-gray-500 uppercase tracking-wide">
                        Terrain:
                      </span>
                      <span className="text-base text-gray-900 capitalize">
                        {race.terrain.replace('-', ' ')}
                      </span>
                    </div>
                  )}
                  {race.elevationGain && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-mono text-gray-500 uppercase tracking-wide">
                        Elevation:
                      </span>
                      <span className="text-base text-gray-900">{race.elevationGain}</span>
                    </div>
                  )}
                  {race.entryFee && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-mono text-gray-500 uppercase tracking-wide">
                        Entry Fee:
                      </span>
                      <span className="text-base text-gray-900">{race.entryFee}</span>
                    </div>
                  )}
                </div>

                {/* Links */}
                {(race.website || race.registrationUrl) && (
                  <div className="pt-6 flex gap-4">
                    {race.website && (
                      <a
                        href={race.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors rounded-sm"
                      >
                        Visit Website
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    )}
                    {race.registrationUrl && (
                      <a
                        href={race.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 border border-black text-black text-sm font-medium hover:bg-gray-50 transition-colors rounded-sm"
                      >
                        Register
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Image Right */}
            <div className="order-1 lg:order-2">
              {race?.coverImage ? (
                <div>
                  <div className="relative aspect-[4/3] lg:aspect-[5/4] overflow-hidden rounded-sm shadow-lg">
                    <CoverImage image={race.coverImage} priority />
                  </div>
                  {race.coverImage.attribution && (
                    <p className="text-xs text-gray-500 mt-2 font-mono">
                      Photo by{' '}
                      {race.coverImage.attributionUrl ? (
                        <a
                          href={race.coverImage.attributionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 hover:text-black transition-colors underline"
                        >
                          {race.coverImage.attribution}
                        </a>
                      ) : (
                        <span className="text-gray-700">{race.coverImage.attribution}</span>
                      )}
                    </p>
                  )}
                </div>
              ) : (
                <div className="aspect-[4/3] lg:aspect-[5/4] bg-gray-100 rounded-sm flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="text-4xl mb-2">🚴</div>
                    <div className="text-sm font-mono tracking-wide uppercase">No Image</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Editions Section */}
      {race.editions && race.editions.length > 0 && (
        <div className="bg-gray-50 border-t border-gray-200">
          <div className="container py-16 lg:py-20">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-display font-normal text-black mb-8">
                Race Editions
              </h2>
              <div className="space-y-4">
                {race.editions.map((edition, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-sm p-6 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-xl font-display text-black">{edition.year}</h3>
                          {edition.status && (
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                edition.status === 'completed'
                                  ? 'bg-gray-100 text-gray-800'
                                  : edition.status === 'sold-out'
                                    ? 'bg-red-100 text-red-800'
                                    : edition.status === 'registration-open'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {edition.status.replace('-', ' ').toUpperCase()}
                            </span>
                          )}
                        </div>
                        {edition.startDate && (
                          <p className="text-gray-600 font-serif">
                            {formatDate(edition.startDate)}
                            {edition.endDate &&
                              edition.endDate !== edition.startDate &&
                              ` - ${formatDate(edition.endDate)}`}
                          </p>
                        )}
                        {edition.registrationDeadline && (
                          <p className="text-sm text-gray-500 mt-1">
                            Registration deadline: {formatDate(edition.registrationDeadline)}
                          </p>
                        )}
                        {edition.notes && (
                          <p className="text-sm text-gray-600 mt-2">{edition.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Related Coverage Section */}
      {race.relatedPosts && race.relatedPosts.length > 0 && (
        <div className="bg-white border-t border-gray-200">
          <div className="container py-16 lg:py-20">
            <div className="max-w-6xl mx-auto">
              <div className="mb-12">
                <span className="text-xs font-mono tracking-widest uppercase text-gray-500 border-b border-gray-300 pb-1 mb-4 inline-block">
                  Coverage
                </span>
                <h2 className="text-2xl md:text-3xl font-display font-normal text-black">
                  Our {race.name} Coverage
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {race.relatedPosts.map((post) => (
                  <article key={post._id} className="group">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      <div className="space-y-4">
                        {/* Image */}
                        <div className="w-full relative">
                          {post.coverImage?.asset ? (
                            <div className="relative overflow-hidden bg-gray-100 aspect-[3/2]">
                              <Image
                                src={
                                  urlForImage(post.coverImage)?.width(500).height(333).fit('crop').url() || ''
                                }
                                alt={post.coverImage.alt || post.title}
                                width={500}
                                height={333}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="aspect-[3/2] bg-gray-100 flex items-center justify-center">
                              <span className="text-xs font-mono text-gray-400">No Image</span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="space-y-3">
                          {(post as any).category && <Category category={(post as any).category} />}
                          <h3 className="font-serif text-xl leading-tight text-black group-hover:text-gray-700 transition-colors">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-gray-700 leading-relaxed font-serif text-sm line-clamp-2">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              {post.date && <DateComponent dateString={post.date} />}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}