import { papers } from '../data/paperinfo.js'

const pages = [
  {
    title: 'About',
    href: '/',
    keywords: 'home bio news experience teaching Chenxu Zhou'
  },
  {
    title: 'Publications',
    href: '/papers',
    keywords: 'papers research projects'
  },
  { title: 'Posts', href: '/posts', keywords: 'blog writing' }
]

export const searchSite = term => {
  const query = term.trim().toLowerCase()
  if (!query) return []

  return [
    ...pages.map(page => ({ ...page, detail: 'Page' })),
    ...papers.map(paper => ({
      title: paper.title,
      href: paper.projectPage || paper.paperLink || '/papers',
      detail: `${paper.conference} ${paper.year}`,
      keywords: paper.authors.map(author => author.name).join(' ')
    }))
  ].filter(result =>
    `${result.title} ${result.detail} ${result.keywords}`
      .toLowerCase()
      .includes(query)
  )
}
