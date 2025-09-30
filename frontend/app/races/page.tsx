import type {Metadata} from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {sanityFetch} from '@/sanity/lib/live'
import {allRacesQuery} from '@/sanity/lib/queries'
import {AllRacesQueryResult} from '@/sanity.types'
import {urlForImage} from '@/sanity/lib/utils'

export const metadata: Metadata = {
  title: 'Race Directory',
  description: 'Comprehensive directory of gravel races around the world',
}

function formatLocation(location: any) {
  if (!location) return 'Location TBD'
  const parts = [location.city, location.region, location.country].filter(Boolean)
  return parts.join(', ')
}

function getNextEdition(editions: any[]) {
  if (!editions || editions.length === 0) return null

  const now = new Date()
  const upcoming = editions
    .filter((ed) => ed.startDate && new Date(ed.startDate) > now)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

  return upcoming[0] || editions[0]
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})
}

const RaceCard = ({race}: {race: AllRacesQueryResult[number]}) => {
  const {_id, name, slug, description, coverImage, location, distances, editions} = race
  const nextEdition = getNextEdition(editions)

  return (
    <article key={_id} className="group">
      <Link
        href={`/races/${slug}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
      >
        <div className="space-y-4">
          {/* Image Section */}
          <div className="w-full relative">
            {coverImage?.asset ? (
              <div className="relative overflow-hidden bg-gray-100 aspect-[3/2]">
                <Image
                  src={urlForImage(coverImage)?.width(500).height(333).fit('crop').url() || ''}
                  alt={coverImage.alt || name}
                  width={500}
                  height={333}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ) : (
              <div className="aspect-[3/2] bg-gray-100 flex items-center justify-center relative">
                <div className="text-gray-400 text-center">
                  <svg
                    className="w-8 h-8 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-xs font-mono">No Image</span>
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="space-y-3">
            {/* Location */}
            <div className="text-xs font-mono tracking-widest uppercase text-gray-500">
              {formatLocation(location)}
            </div>

            <h3 className="font-display text-2xl leading-tight text-black group-hover:text-gray-700 transition-colors">
              {name}
            </h3>

            {description && (
              <p className="text-gray-700 leading-relaxed font-serif text-sm line-clamp-2">
                {description}
              </p>
            )}

            {/* Race Details */}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              {nextEdition && nextEdition.startDate && (
                <div className="text-sm text-gray-900 font-medium">
                  {formatDate(nextEdition.startDate)}
                  {nextEdition.endDate &&
                    nextEdition.endDate !== nextEdition.startDate &&
                    ` - ${formatDate(nextEdition.endDate)}`}
                </div>
              )}
              <div className="flex items-center gap-3 text-sm text-gray-600">
                {distances && distances.length > 0 && (
                  <span>{distances.join(', ')}</span>
                )}
                {nextEdition?.status && (
                  <>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <span className="capitalize">{nextEdition.status.replace('-', ' ')}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}

export default async function RacesPage() {
  const {data: races} = await sanityFetch({
    query: allRacesQuery,
  })

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container py-16 lg:py-20">
          <div className="max-w-3xl">
            <span className="text-xs font-mono tracking-widest uppercase text-gray-500 border-b border-gray-300 pb-1 mb-6 inline-block">
              Race Directory
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-normal tracking-tight text-black leading-tight mb-6">
              Gravel Races
            </h1>
            <p className="text-lg md:text-xl font-serif font-light text-gray-600 leading-relaxed">
              A comprehensive directory of gravel races around the world. Find your next adventure.
            </p>
          </div>
        </div>
      </div>

      {/* Races Grid */}
      <div className="bg-white">
        <div className="container py-16 lg:py-20">
          {races && races.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {races.map((race) => (
                <RaceCard key={race._id} race={race} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 font-serif">No races found. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}