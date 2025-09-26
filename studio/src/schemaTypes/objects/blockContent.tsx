import {defineArrayMember, defineType, defineField} from 'sanity'

/**
 * This is the schema definition for the rich text fields used for
 * for this blog studio. When you import it in schemas.js it can be
 * reused in other parts of the studio with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 *
 * Learn more: https://www.sanity.io/docs/block-content
 */
export const blockContent = defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      marks: {
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              defineField({
                name: 'linkType',
                title: 'Link Type',
                type: 'string',
                initialValue: 'href',
                options: {
                  list: [
                    {title: 'URL', value: 'href'},
                    {title: 'Page', value: 'page'},
                    {title: 'Post', value: 'post'},
                  ],
                  layout: 'radio',
                },
              }),
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                hidden: ({parent}) => parent?.linkType !== 'href' && parent?.linkType != null,
                validation: (Rule) =>
                  Rule.custom((value, context: any) => {
                    if (context.parent?.linkType === 'href' && !value) {
                      return 'URL is required when Link Type is URL'
                    }
                    return true
                  }),
              }),
              defineField({
                name: 'page',
                title: 'Page',
                type: 'reference',
                to: [{type: 'page'}],
                hidden: ({parent}) => parent?.linkType !== 'page',
                validation: (Rule) =>
                  Rule.custom((value, context: any) => {
                    if (context.parent?.linkType === 'page' && !value) {
                      return 'Page reference is required when Link Type is Page'
                    }
                    return true
                  }),
              }),
              defineField({
                name: 'post',
                title: 'Post',
                type: 'reference',
                to: [{type: 'post'}],
                hidden: ({parent}) => parent?.linkType !== 'post',
                validation: (Rule) =>
                  Rule.custom((value, context: any) => {
                    if (context.parent?.linkType === 'post' && !value) {
                      return 'Post reference is required when Link Type is Post'
                    }
                    return true
                  }),
              }),
              defineField({
                name: 'openInNewTab',
                title: 'Open in new tab',
                type: 'boolean',
                initialValue: false,
              }),
            ],
          },
        ],
      },
    }),
    // Inline Image
    defineArrayMember({
      type: 'image',
      name: 'inlineImage',
      title: 'Inline Image',
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'caption',
          type: 'text',
          title: 'Caption',
          description: 'Optional caption that appears below the image.',
        }),
        defineField({
          name: 'size',
          type: 'string',
          title: 'Image Size',
          options: {
            list: [
              {title: 'Small (33% width)', value: 'small'},
              {title: 'Medium (66% width)', value: 'medium'},
              {title: 'Large (Full width)', value: 'large'},
              {title: 'Full Bleed (Beyond margins)', value: 'fullBleed'},
            ],
            layout: 'radio',
          },
          initialValue: 'large',
        }),
        defineField({
          name: 'alignment',
          type: 'string',
          title: 'Alignment',
          options: {
            list: [
              {title: 'Left', value: 'left'},
              {title: 'Center', value: 'center'},
              {title: 'Right', value: 'right'},
            ],
            layout: 'radio',
          },
          initialValue: 'center',
          hidden: ({parent}) => parent?.size === 'fullBleed',
        }),
      ],
    }),
    // Image Gallery
    defineArrayMember({
      type: 'object',
      name: 'imageGallery',
      title: 'Image Gallery',
      fields: [
        defineField({
          name: 'images',
          type: 'array',
          title: 'Images',
          of: [
            {
              type: 'image',
              options: {hotspot: true},
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alternative text',
                  validation: (rule) => rule.required(),
                },
                {
                  name: 'caption',
                  type: 'string',
                  title: 'Caption',
                },
              ],
            },
          ],
          validation: (rule) => rule.min(2).max(6),
        }),
        defineField({
          name: 'layout',
          type: 'string',
          title: 'Gallery Layout',
          options: {
            list: [
              {title: 'Grid (2 columns)', value: 'grid2'},
              {title: 'Grid (3 columns)', value: 'grid3'},
              {title: 'Horizontal Scroll', value: 'scroll'},
            ],
            layout: 'radio',
          },
          initialValue: 'grid2',
        }),
      ],
      preview: {
        select: {
          images: 'images',
          layout: 'layout',
        },
        prepare(selection) {
          const {images, layout} = selection
          return {
            title: `Gallery (${images?.length || 0} images)`,
            subtitle: layout === 'grid2' ? '2-column grid' : layout === 'grid3' ? '3-column grid' : 'Horizontal scroll',
            media: images?.[0],
          }
        },
      },
    }),
    // Pull Quote
    defineArrayMember({
      type: 'object',
      name: 'pullQuote',
      title: 'Pull Quote',
      fields: [
        defineField({
          name: 'quote',
          type: 'text',
          title: 'Quote',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'attribution',
          type: 'string',
          title: 'Attribution',
          description: 'Who said this quote? (Optional)',
        }),
        defineField({
          name: 'style',
          type: 'string',
          title: 'Style',
          options: {
            list: [
              {title: 'Large centered quote', value: 'large'},
              {title: 'Sidebar quote', value: 'sidebar'},
            ],
            layout: 'radio',
          },
          initialValue: 'large',
        }),
      ],
      preview: {
        select: {
          quote: 'quote',
          attribution: 'attribution',
        },
        prepare(selection) {
          const {quote, attribution} = selection
          return {
            title: `"${quote?.substring(0, 60)}${quote?.length > 60 ? '...' : ''}"`,
            subtitle: attribution ? `— ${attribution}` : 'Pull Quote',
          }
        },
      },
    }),
  ],
})
