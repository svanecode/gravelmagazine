import {Suspense} from 'react'
import {Hero} from '@/app/components/Hero'
import {AllPosts} from '@/app/components/Posts'

export default async function Page() {
  return (
    <>
      {/* Hero section with latest article */}
      <Suspense fallback={<div className="h-96 bg-gray-50 animate-pulse" />}>
        <Hero />
      </Suspense>

      {/* More articles section */}
      <div className="bg-gray-50">
        <div className="container">
          <div className="py-16 lg:py-20">
            <Suspense fallback={<div className="h-96 bg-gray-50 animate-pulse" />}>
              <AllPosts />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  )
}
