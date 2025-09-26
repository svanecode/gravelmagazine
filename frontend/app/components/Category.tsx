interface CategoryProps {
  category: string | {
    title: string
    slug?: {
      current: string
    }
    color?: string
  } | null
  className?: string
}

export default function Category({category, className}: CategoryProps) {
  if (!category) return null

  // Handle both legacy string format and new object format
  let displayName: string
  let categoryColor: string | undefined

  if (typeof category === 'string') {
    // Legacy format - map old values to display names
    const categoryDisplayNames: Record<string, string> = {
      race: 'Race',
      tech: 'Tech',
      training: 'Training',
      gear: 'Gear',
      adventure: 'Adventure',
      nutrition: 'Nutrition',
      community: 'Community',
      news: 'News',
    }
    displayName = categoryDisplayNames[category] || category
  } else {
    // New object format
    displayName = category.title
    categoryColor = category.color
  }

  const baseClasses = className || 'inline-block text-xs font-serif tracking-wide uppercase text-gray-500 border-b border-gray-300 pb-1'
  
  // If category has a custom color, apply it
  const style = categoryColor ? { 
    color: categoryColor,
    borderBottomColor: categoryColor + '60' // Add some transparency to border
  } : undefined

  return (
    <span 
      className={baseClasses}
      style={style}
    >
      {displayName}
    </span>
  )
}