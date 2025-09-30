import {stegaClean} from '@sanity/client/stega'
import {Image} from 'next-sanity/image'
import {getImageDimensions} from '@sanity/asset-utils'
import {urlForImage} from '@/sanity/lib/utils'

interface CoverImageProps {
  image: any
  priority?: boolean
}

export default function CoverImage(props: CoverImageProps) {
  const {image: source, priority} = props
  const image = source?.asset?._ref ? (
    <Image
      className="w-full h-full object-cover"
      width={1200}
      height={900}
      alt={stegaClean(source?.alt) || ''}
      src={urlForImage(source)?.width(1200).height(900).fit('crop').url() as string}
      priority={priority}
    />
  ) : null

  return <div className="absolute inset-0">{image}</div>
}
