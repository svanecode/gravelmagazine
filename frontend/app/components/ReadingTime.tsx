import {calculateReadingTime, formatReadingTime} from '@/sanity/lib/utils'

interface ReadingTimeProps {
  content: any[]
  className?: string
}

export default function ReadingTime({content, className}: ReadingTimeProps) {
  const readingTimeMinutes = calculateReadingTime(content)
  const formattedReadingTime = formatReadingTime(readingTimeMinutes)

  return (
    <span className={className || 'text-sm text-gray-500'}>
      {formattedReadingTime}
    </span>
  )
}