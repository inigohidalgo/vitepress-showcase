import { createContentLoader } from 'vitepress'

export interface Entry {
  url: string
  title: string
  date: string
  author: string
  tags: string[]
  excerpt: string
}

declare const data: Entry[]
export { data }

export default createContentLoader('changelog/2[0-9][0-9][0-9]-*.md', {
  excerpt: true,
  transform(raw): Entry[] {
    return raw
      .filter((p) => !p.frontmatter.draft)
      .sort(
        (a, b) =>
          +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)
      )
      .map((p) => {
        const raw = p.frontmatter.date
        const d = raw instanceof Date ? raw : new Date(raw)
        const date = d.toISOString().slice(0, 10)
        return {
          url: p.url,
          title: p.frontmatter.title,
          date,
          author: p.frontmatter.author ?? 'unknown',
          tags: p.frontmatter.tags ?? [],
          excerpt: p.excerpt?.trim() ?? ''
        }
      })
  }
})
