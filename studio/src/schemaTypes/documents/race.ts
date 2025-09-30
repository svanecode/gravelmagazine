import {RocketIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Race schema for the race directory.
 * Each race can have multiple editions (years) with specific dates and details.
 */

export const race = defineType({
  name: 'race',
  title: 'Race',
  icon: RocketIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Race Name',
      type: 'string',
      description: 'The name of the race (e.g., "Unbound Gravel", "Belgian Waffle Ride")',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly version of the race name',
      options: {
        source: 'name',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Brief description of the race',
      rows: 4,
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        },
        {
          name: 'attribution',
          type: 'string',
          title: 'Photo Credit',
        },
        {
          name: 'attributionUrl',
          type: 'url',
          title: 'Attribution URL',
        },
      ],
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        {
          name: 'city',
          title: 'City',
          type: 'string',
        },
        {
          name: 'region',
          title: 'State/Region',
          type: 'string',
          description: 'State, province, or region',
        },
        {
          name: 'country',
          title: 'Country',
          type: 'string',
          validation: (rule) => rule.required(),
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
      description: 'Official race website',
    }),
    defineField({
      name: 'registrationUrl',
      title: 'Registration URL',
      type: 'url',
      description: 'Direct link to registration page',
    }),
    defineField({
      name: 'distances',
      title: 'Distance Options',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Available race distances (e.g., "50mi", "100mi", "100km")',
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'terrain',
      title: 'Terrain Type',
      type: 'string',
      options: {
        list: [
          {title: 'Gravel', value: 'gravel'},
          {title: 'Mixed Surface', value: 'mixed'},
          {title: 'Technical', value: 'technical'},
          {title: 'Fast Gravel', value: 'fast'},
          {title: 'Mountain', value: 'mountain'},
        ],
      },
    }),
    defineField({
      name: 'elevationGain',
      title: 'Elevation Gain',
      type: 'string',
      description: 'Total elevation gain (e.g., "10,000ft", "3,000m")',
    }),
    defineField({
      name: 'entryFee',
      title: 'Entry Fee',
      type: 'string',
      description: 'Price or price range (e.g., "$150-200")',
    }),
    defineField({
      name: 'editions',
      title: 'Race Editions',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'edition',
          title: 'Edition',
          fields: [
            {
              name: 'year',
              title: 'Year',
              type: 'number',
              validation: (rule) => rule.required().min(2000).max(2100),
            },
            {
              name: 'startDate',
              title: 'Start Date',
              type: 'date',
              validation: (rule) => rule.required(),
            },
            {
              name: 'endDate',
              title: 'End Date',
              type: 'date',
              description: 'Leave empty for single-day events',
            },
            {
              name: 'status',
              title: 'Status',
              type: 'string',
              options: {
                list: [
                  {title: 'Upcoming', value: 'upcoming'},
                  {title: 'Registration Open', value: 'registration-open'},
                  {title: 'Sold Out', value: 'sold-out'},
                  {title: 'Completed', value: 'completed'},
                ],
              },
              initialValue: 'upcoming',
            },
            {
              name: 'registrationDeadline',
              title: 'Registration Deadline',
              type: 'date',
            },
            {
              name: 'notes',
              title: 'Edition Notes',
              type: 'text',
              description: 'Any specific details about this edition',
              rows: 2,
            },
          ],
          preview: {
            select: {
              year: 'year',
              startDate: 'startDate',
              status: 'status',
            },
            prepare({year, startDate, status}) {
              return {
                title: `${year} Edition`,
                subtitle: `${startDate || 'No date'} - ${status || 'No status'}`,
              }
            },
          },
        },
      ],
      description: 'Add editions for each year this race has run or will run',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      city: 'location.city',
      country: 'location.country',
      media: 'coverImage',
    },
    prepare({title, city, country, media}) {
      const location = [city, country].filter(Boolean).join(', ')
      return {
        title,
        subtitle: location || 'No location',
        media,
      }
    },
  },
})