import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'portfolioProject',
  title: 'Portfolio Project',
  type: 'document',
  groups: [
    {name: 'main', title: 'Main', default: true},
    {name: 'story', title: 'Story (Case Study)'},
    {name: 'media', title: 'Media & Gallery'},
    {name: 'results', title: 'Results & KPIs'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // --------- MAIN ---------
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      group: 'main',
      validation: (Rule) => Rule.required().min(3).max(120),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'main',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Client Name',
      type: 'string',
      group: 'main',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'main',
      options: {
        list: [
          {title: 'Branding', value: 'branding'},
          {title: 'Web', value: 'web'},
          {title: 'App', value: 'app'},
          {title: 'Marketing', value: 'marketing'},
          {title: 'Motion', value: 'motion'},
          {title: 'Photography', value: 'photo'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sector',
      title: 'Sector (e.g. "Culture · Dance")',
      type: 'string',
      group: 'main',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      group: 'main',
    }),
    defineField({
      name: 'featured',
      title: 'Featured project',
      description: 'Toggle to highlight this project on the home page',
      type: 'boolean',
      group: 'main',
      initialValue: false,
    }),
    defineField({
      name: 'summary',
      title: 'Short Summary (1-2 lines, shown on cards)',
      type: 'text',
      rows: 2,
      group: 'main',
      validation: (Rule) => Rule.required().max(280),
    }),
    defineField({
      name: 'services',
      title: 'Services Delivered',
      type: 'array',
      group: 'main',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'tools',
      title: 'Tools Used (e.g. Photoshop, Illustrator)',
      type: 'array',
      group: 'main',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),

    // --------- MEDIA ---------
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery (drag to reorder)',
      type: 'array',
      group: 'media',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            {name: 'alt', title: 'Alt text', type: 'string'},
            {name: 'caption', title: 'Caption', type: 'string'},
          ],
        }),
      ],
    }),
    defineField({
      name: 'videos',
      title: 'Videos (YouTube / Vimeo URLs)',
      type: 'array',
      group: 'media',
      of: [{type: 'url'}],
    }),

    // --------- STORY ---------
    defineField({
      name: 'description',
      title: 'Context (long intro)',
      type: 'text',
      rows: 5,
      group: 'story',
    }),
    defineField({
      name: 'challenge',
      title: '01 — The Challenge',
      type: 'text',
      rows: 5,
      group: 'story',
    }),
    defineField({
      name: 'approach',
      title: '02 — Our Approach',
      type: 'text',
      rows: 5,
      group: 'story',
    }),
    defineField({
      name: 'strategy',
      title: '03 — The Strategy',
      type: 'text',
      rows: 5,
      group: 'story',
    }),
    defineField({
      name: 'solution',
      title: '04 — The Solution',
      type: 'text',
      rows: 5,
      group: 'story',
    }),

    // --------- RESULTS ---------
    defineField({
      name: 'outcome',
      title: 'Outcome (1 sentence headline)',
      type: 'text',
      rows: 3,
      group: 'results',
    }),
    defineField({
      name: 'kpis',
      title: 'KPIs / Metrics',
      type: 'array',
      group: 'results',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            {name: 'label', title: 'Label', type: 'string'},
            {name: 'value', title: 'Value', type: 'string'},
          ],
          preview: {
            select: {title: 'value', subtitle: 'label'},
          },
        }),
      ],
    }),
    defineField({
      name: 'testimonial',
      title: 'Client Testimonial Quote',
      type: 'text',
      rows: 3,
      group: 'results',
    }),

    // --------- SEO ---------
    defineField({
      name: 'seoTitle',
      title: 'SEO Title (browser tab + Google)',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description (~150 chars)',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (Rule) => Rule.max(160),
    }),
  ],
  preview: {
    select: {title: 'title', client: 'client', media: 'coverImage', featured: 'featured'},
    prepare({title, client, media, featured}) {
      return {
        title: (featured ? '⭐ ' : '') + title,
        subtitle: client || '—',
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Featured first',
      name: 'featuredDesc',
      by: [
        {field: 'featured', direction: 'desc'},
        {field: 'year', direction: 'desc'},
      ],
    },
    {
      title: 'Year (newest)',
      name: 'yearDesc',
      by: [{field: 'year', direction: 'desc'}],
    },
  ],
})
