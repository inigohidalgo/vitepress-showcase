import { readdirSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { tables } from './tables/_catalog'

export interface Stat {
  label: string
  value: string
  hint: string
}

declare const data: Stat[]
export { data }

const ROOT = new URL('./', import.meta.url).pathname

function walk(dir: string): string[] {
  const abs = join(ROOT, dir)
  try {
    return readdirSync(abs, { recursive: true, withFileTypes: true })
      .filter((d) => d.isFile())
      .map((d) =>
        relative(ROOT, join((d as any).parentPath ?? (d as any).path, d.name)).split(sep).join('/')
      )
  } catch {
    return []
  }
}

export default {
  watch: ['**/*.md', '**/*.data.ts', '**/*.paths.ts'],
  load(): Stat[] {
    const files = walk('.')
    const pages = files.filter((f) => f.endsWith('.md'))
    const paths = files.filter((f) => f.endsWith('.paths.ts'))
    const loaders = files.filter((f) => f.endsWith('.data.ts'))
    const changelogEntries = files.filter(
      (f) => f.startsWith('changelog/') && /\/\d{4}-.*\.md$/.test(f)
    )

    return [
      {
        label: 'Pages',
        value: String(pages.length),
        hint: 'Markdown sources across the docs tree.'
      },
      {
        label: 'Dynamic routes',
        value: String(tables.length),
        hint: `Pages generated at build time from ${paths.length} template${paths.length === 1 ? '' : 's'}.`
      },
      {
        label: 'Data loaders',
        value: String(loaders.length),
        hint: 'Build-time *.data.ts modules.'
      },
      {
        label: 'Changelog entries',
        value: String(changelogEntries.length),
        hint: 'Auto-indexed via createContentLoader.'
      }
    ]
  }
}
