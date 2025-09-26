import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Category schema for organizing posts.
 * Categories can be managed independently and referenced by posts.
 */

export const category = defineType({
  name: 'category',
  title: 'Category',
  icon: TagIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The display name of the category (e.g., "Race", "Tech")',
      validation: (rule) => rule.required().max(50),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly version of the title',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Optional description of what this category covers',
      rows: 3,
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      description: 'Optional hex color for the category (e.g., #c5a572)',
      validation: (rule) => 
        rule.custom((color) => {
          if (!color) return true // Optional field
          if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
            return 'Please enter a valid hex color (e.g., #c5a572)'
          }
          return true
        }),
    }),
    defineField({
      name: 'order',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first in lists',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
      order: 'order',
    },
    prepare({title, description, order}) {
      return {
        title,
        subtitle: description || `Order: ${order || 0}`,
      }
    },
  },
})