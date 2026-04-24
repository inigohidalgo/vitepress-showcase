---
title: VitePress Cheatsheet
description: A scannable reference for building an internal data-platform docs site with VitePress.
outline: [2, 3]
---

# VitePress Cheatsheet

A reference for building a modern, low-maintenance docs site for an internal data platform. Each section lists what to type; most sections demonstrate the feature they describe **on this very page**.

::: tip
Items marked <Badge type="tip" text="differentiator" /> are things you would not get out of the box from Jekyll, MkDocs, or Hugo. They are why VitePress is often a better fit for docs that sit next to code.
:::

[[toc]]

## Project anatomy

```
my-docs/
├─ docs/
│  ├─ .vitepress/
│  │  ├─ config.ts          # site config
│  │  ├─ theme/             # optional: tweaks to the default theme
│  │  │  ├─ index.ts
│  │  │  └─ custom.css
│  │  ├─ cache/             # dev cache — .gitignore
│  │  └─ dist/              # build output — .gitignore
│  ├─ public/               # static assets copied as-is
│  ├─ index.md              # /
│  └─ guide/
│     └─ getting-started.md # /guide/getting-started.html
└─ package.json
```

- Node 20+, ESM-only. Config file must be `.js`, `.mjs`, `.ts`, or `.mts`.
- Every `.md` outside `.vitepress/` is a page.
- `public/logo.svg` → `/logo.svg` (the `public/` prefix is dropped).

### CLI

| Command | Purpose |
|---|---|
| `vitepress init` | Interactive scaffolder |
| `vitepress dev [root]` | Dev server, default `:5173` |
| `vitepress build [root]` | Static build to `.vitepress/dist` |
| `vitepress preview [root]` | Serve the build at `:4173` |

Common flags: `--port`, `--base <path>`, `--open [path]`, `--outDir <dir>`.

## Routing

File-based: path on disk (minus `.md`, minus `srcDir`) is the URL.

| File | URL |
|---|---|
| `index.md` | `/` |
| `guide/loaders.md` | `/guide/loaders.html` |
| `guide/index.md` | `/guide/` |

- **`cleanUrls: true`** — drop `.html`; server must rewrite `/foo` → `/foo.html`.
- **`rewrites`** — remap source paths to URLs:

```ts
// .vitepress/config.ts
export default {
  rewrites: {
    'packages/:pkg/index.md': ':pkg/index.md',
    // or as a function
    // (id) => id.replace(/^packages\//, '')
  }
}
```

- **Linking**: drop the extension. `[loaders](./guide/loaders)` works in dev and build.

### Dynamic routes <Badge type="tip" text="differentiator" />

Generate many pages from one template — good for per-table, per-model, or per-notebook docs. **[See it live in the table catalog demo →](./tables/)**

File: `docs/tables/[table].md`

```md
---
title: "{{ $params.name }}"
---

# {{ $params.name }}

Owner: **{{ $params.owner }}**
Schema: `{{ $params.schema }}`

<!-- @content -->
```

Paths file: `docs/tables/[table].paths.ts`

```ts
import { defineLoader } from 'vitepress'

export default defineLoader({
  watch: ['./catalog/*.yaml'],
  async paths() {
    // Replace with a Unity Catalog query, a YAML dump, anything.
    const tables = [
      { name: 'fct_orders', schema: 'sales', owner: 'data-platform' },
      { name: 'dim_customers', schema: 'sales', owner: 'data-platform' }
    ]
    return tables.map((t) => ({
      params: { table: t.name, ...t },
      content: `Last refreshed daily at 06:00 UTC.`
    }))
  }
})
```

- `params.table` → URL slug (`/tables/fct_orders`).
- `content` field is injected wherever you put `<!-- @content -->`.
- `watch` triggers a rebuild when source files change in dev.

## Markdown extensions

### Containers <Badge type="tip" text="differentiator" />

::: info
`info` — neutral callout. Use for context a reader can ignore.
:::

::: tip
`tip` — tips and pro moves.
:::

::: warning
`warning` — non-destructive footgun.
:::

::: danger
`danger` — will delete data / cost money / wake people up.
:::

::: details Click for the SQL
```sql
SELECT t.name, t.owner, COUNT(*) AS row_count
FROM information_schema.tables t
WHERE t.schema = 'sales'
GROUP BY 1, 2;
```
:::

Syntax: `::: type [custom title]` … `:::`. Types: `info`, `tip`, `warning`, `danger`, `details`, `raw`, `v-pre`.

::: tip Pick one and stick to it
Standardize on `:::` containers. They're strictly more expressive than GitHub-flavored alerts (`::: details`, custom titles, `::: raw`, `::: v-pre`, `::: code-group` have no GFM equivalent) and they're native to the VitePress renderer. This showcase uses `:::` everywhere except the "GitHub-flavored alerts" section below, which exists only to show the alternative syntax.
:::

### GitHub-flavored alerts

Alternative syntax. VitePress supports it but you usually don't need it — the only advantage is that the same file renders on GitHub's web UI with matching styling.

> [!NOTE]
> Idempotent by default.

> [!WARNING]
> Do not run in production without `--dry-run`.

> [!CAUTION]
> Drops the staging schema.

Shapes: `NOTE`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`. No custom titles, no collapsing, no escape containers.

### Code blocks

Append a language and optional directives. Python here, but any Shiki-supported language works:

```python{2,5-6}
import pandas as pd
from pyspark.sql import SparkSession  # [!code highlight]

def load_orders(spark: SparkSession, path: str) -> pd.DataFrame:
    df = spark.read.parquet(path)           # [!code focus]
    return df.filter("amount > 0").toPandas()
```

```python
# Line-comment directives work too.
def risky_join(left, right):
    return left.join(right, on="id")           # [!code warning]

def wrong_join(left, right):
    return left.join(right, on="id", how="cross")  # [!code error]
```

Diffs for migration notes:

```python
def embed(text: str) -> list[float]:
    client = OpenAI()                                     # [!code --]
    client = Anthropic()                                  # [!code ++]
    resp = client.embeddings.create(                      # [!code --]
        model="text-embedding-3-small", input=text        # [!code --]
    )                                                     # [!code --]
    # Use Voyage via the Anthropic-compatible adapter.    # [!code ++]
    return resp.data[0].embedding
```

Line numbers: fence with `python:line-numbers` or `python:line-numbers=10` to start at 10. Highlight ranges with `{1,4,6-8}` after the language.

### Code groups

::: code-group

```python [Python]
from databricks import sql

with sql.connect(server_hostname=HOST, http_path=PATH, access_token=TOKEN) as conn:
    with conn.cursor() as c:
        c.execute("SELECT 1")
        print(c.fetchone())
```

```sql [SQL]
-- Run the same check in a Databricks SQL warehouse.
SELECT 1;
```

```bash [CLI]
databricks sql queries list --output JSON | jq '.[] | .name'
```

:::

### File imports <Badge type="tip" text="differentiator" />

Pull a snippet from anywhere in the repo with `<<< @/path`. Line ranges (`{3-10}`), header anchors (`#heading-slug`), and VS Code `#region` markers (`#region-name`) are all supported. The displayed language follows the file extension. Paths starting with `@` resolve against `srcDir`; plain relative paths resolve against the importing `.md` file, so docs can reach out into sibling source trees.

Mark a block in your source:

```python
# region chunk_text
def chunk_text(...) -> Generator[Chunk, None, None]:
    ...
# endregion chunk_text
```

Then pull it into the docs:

```md
<<< ../src/vitepress_showcase/pipelines.py#chunk_text
```

Rendered inline below from the real `src/vitepress_showcase/pipelines.py` in this repo — if the signature changes, the docs rebuild with the new one:

<<< ../src/vitepress_showcase/pipelines.py#chunk_text

And the `Chunk` dataclass it yields:

<<< ../src/vitepress_showcase/pipelines.py#Chunk

**Why use this for an internal docs site**: snippets copy-pasted into prose drift the moment someone refactors. Importing keeps the docs honest — the "runbook walks through this function" section will always show the function as it is, not as it was.

### Markdown includes

Reuse a block of prose across pages:

```md
<!--@@include: ./partials/pii-warning.md-->
<!--@@include: ./partials/pii-warning.md{3,10}-->
<!--@@include: ./partials/pii-warning.md#snippet-->
```

Ranges, VS Code regions, and header-anchored slices all work.

### Tables, TOC, emoji, anchors

- GFM tables work.
- `[[toc]]` renders a page TOC (there's one at the top of this page).
- `:rocket:` → 🚀 (if emoji is enabled).
- Custom anchor: `## My heading {#stable-slug}`.

### Math (opt-in)

Install the renderer, then flip the flag:

```bash
npm add -D markdown-it-mathjax3
```

```ts
// .vitepress/config.ts
export default {
  markdown: { math: true }
}
```

Source syntax (what you type):

```md
Inline: $\text{MSE} = \frac{1}{n}\sum (y_i - \hat{y}_i)^2$

Display:

$$
\text{softmax}(z)_i = \frac{e^{z_i}}{\sum_{j} e^{z_j}}
$$
```

Rendered on this page (live):

Inline: $\text{MSE} = \frac{1}{n}\sum (y_i - \hat{y}_i)^2$

Display:

$$
\text{softmax}(z)_i = \frac{e^{z_i}}{\sum_{j} e^{z_j}}
$$

## Vue in Markdown <Badge type="tip" text="differentiator" />

Every `.md` file is compiled as a Vue single-file component. Useful for runbooks that contain live calculators, parameterized command generators, or anything that would otherwise be a static screenshot.

The component below is a real Vue component (`CostEstimator`) registered globally in the theme entry — go ahead and change the values:

<CostEstimator />

*(The component lives at `.vitepress/theme/components/CostEstimator.vue`; it's registered globally via `enhanceApp` in `.vitepress/theme/index.ts` so any markdown page can drop `<CostEstimator />` without importing it. The homepage hero animation is the same idea at a bigger scale — see [`PipelineDiagram.vue`](/).)*

```md
<script setup lang="ts">
import { ref, computed } from 'vue'

const rows = ref(1_000_000)
const bytes = computed(() => rows.value * 128)
</script>

Rows: <input v-model.number="rows" type="number" />
Estimated footprint: **{{ (bytes / 1e6).toFixed(1) }} MB**
```

Rules:

- Put `<script>`, `<script setup>`, and `<style>` below the frontmatter.
- Prefer `<style module>` over `<style scoped>` in Markdown (scoped generates one hash per page, which bloats the bundle).
- Component names must be PascalCase or contain a hyphen — otherwise Markdown wraps them in `<p>`.
- Escape Vue syntax with `<span v-pre>{{ literal }}</span>` or `::: v-pre`.
- Put interpolation inside fenced code with ` ```python-vue ` (or `js-vue`, etc.).

Browser-only bits:

```md
<ClientOnly>
  <PlotlyChart :data="data" />
</ClientOnly>
```

<script setup lang="ts">
import { graph, scrubStyles } from './_mermaid_demo'
</script>

## Mermaid with ad-hoc styling <Badge type="tip" text="differentiator" />

Mermaid via a thin Vue wrapper (`MermaidDiagram.vue`) instead of `vitepress-plugin-mermaid`'s fenced-block flow. Two payoffs:

- **Dark-mode-aware theming for free** — mermaid is initialized with `theme: 'base'` and a `themeCSS` string that references `--vp-c-*` site tokens. Mermaid bakes that string into each rendered SVG's inner `<style>`, and `var(--vp-c-*)` resolves at paint time, so flipping `:root.dark` re-themes every diagram instantly without a re-render.
- **Per-instance overrides** — a `:styles` prop is concatenated onto the global `themeCSS` before render, so one-off emphasis stays scoped to that one diagram.

### Three tiers of styling

Reach for the lowest tier that does the job:

| Tier | Where | When |
|---|---|---|
| **1 — `themeCSS` + `--vp-mermaid-*` tokens** | `MermaidDiagram.vue` + `custom.css` | Default look of every diagram, site-wide |
| **2 — global semantic classes** | `custom.css` (e.g. `.node.highlight`) | Reused across ≥2 diagrams |
| **3 — per-instance `:styles` prop** | Inline in the `.md` file | One-off emphasis on a single diagram |

### Live example

The ingestion graph below uses all three tiers. `Ingest` and `Publish` get the default Tier 1 look. `Classify` carries the global Tier 2 `highlight` class. `PII Scrub` gets a one-off Tier 3 override via the `:styles` prop — no new CSS file, no new global class.

<MermaidDiagram :source="graph" :styles="scrubStyles" />

The graph source lives in a sibling `.ts` file so both `<script setup>` (for the live render above) and `<<<` imports (for the snippets below) see the same text:

<<< ./_mermaid_demo.ts#graph

The Tier 3 override for the `PII Scrub` node — just a CSS string, passed as a prop:

<<< ./_mermaid_demo.ts#scrubStyles

And the markdown that renders the live diagram is three lines:

```md
<script setup lang="ts">
import { graph, scrubStyles } from './_mermaid_demo'
</script>

<MermaidDiagram :source="graph" :styles="scrubStyles" />
```

### Tier 1 — the site-wide `themeCSS`

Baked into the component as a string so mermaid injects it inside every rendered SVG. Note `!important` throughout (mermaid's base theme emits inline `style=""` on nodes that would otherwise win) and the dual `color` + `fill` on label selectors (labels are rendered as HTML `<foreignObject>` with `htmlLabels: true`, and `fill` is a no-op on HTML):

<<< ./.vitepress/theme/components/MermaidDiagram.vue#themeCSS

### Tier 2 — global semantic classes

Defined once in `custom.css`, used across any number of diagrams by tagging nodes with `classDef foo` + `class X foo` in the mermaid source:

<<< ./.vitepress/theme/custom.css#mermaid-tier2

### Gotchas

- **HTML labels** — with `flowchart.htmlLabels: true` (the default), labels are `<foreignObject><div class="label"><p>…</p></div></foreignObject>`. `fill` does not apply to HTML, only `color` does, and it has to cascade. Target both `.label, .label *` (HTML) **and** `text, tspan` (SVG) with both properties.
- **`!important` is a composability tax** — mermaid auto-prefixes every `themeCSS` selector with the SVG's `#id`, giving Tier 1 specificity `(0,1,1,1)`. Anything you tag `!important` in Tier 1 becomes unbeatable from `custom.css` (which can't match an id it doesn't know). The split we use here: shapes (rect/polygon/stroke) are plain so Tier 2 can override them; **labels are `!important`** because mermaid's own `.nodeLabel` rule is `!important` and a non-important rule loses to it (pink labels). Consequence: Tier 2 in `custom.css` can't recolor labels — use Tier 3 (`:styles`) for that, since it concatenates onto themeCSS and gets the same id-prefix.
- **Don't set colors via `themeVariables`** — they're baked in as hex strings at init time and ignore dark-mode toggles. Keep `themeVariables` to non-color things like `fontFamily`.
- **Don't write `classDef highlight fill:#abc`** — mermaid compiles that to inline `style=""`, which loses to the `!important` rules above. Use `classDef` as a semantic tag (no colors) and style the resulting class via Tier 2 or Tier 3.

## Frontmatter

Global keys (any layout):

```yaml
---
title: Loaders
titleTemplate: ":title | Data Platform Docs"  # or `false` to disable
description: Build-time data loading patterns.
head:
  - [meta, { name: robots, content: noindex }]
---
```

Default theme keys:

| Key | Values | Use |
|---|---|---|
| `layout` | `doc` (default) / `home` / `page` / `false` | Page shell |
| `outline` | `number` / `[n, n]` / `'deep'` / `false` | Right-hand TOC depth |
| `aside` | `true` / `false` / `'left'` | The outline column |
| `sidebar` | `true` / `false` | Show the left sidebar |
| `navbar` | `true` / `false` | Show the top nav |
| `lastUpdated` | `true` / `false` / `Date` | Git-based timestamp |
| `editLink` | `true` / `false` | Override global |
| `footer` | `true` / `false` | Override global |
| `prev` / `next` | `string` / `{ text, link }` / `false` | Footer nav |
| `pageClass` | `string` | Custom CSS hook |
| `search` | `false` | Exclude from local search |

## Site config

`.vitepress/config.ts` — the one file you open the most.

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Data Platform Docs',
  description: 'Pipelines, warehouses, and model serving.',
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#0b5fff' }]
  ],

  markdown: {
    lineNumbers: true,
    math: true,
    image: { lazyLoading: true }
  },

  sitemap: { hostname: 'https://docs.internal.example.com' },

  themeConfig: {
    // see next section
  }
})
```

### Build hooks

Useful for things like "inject a CSP", "preload a font", "generate an index for the search index":

```ts
export default defineConfig({
  async transformHead({ pageData }) {
    return [['link', { rel: 'preload', href: '/Inter.woff2', as: 'font', crossorigin: '' }]]
  },
  transformPageData(pageData) {
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(['meta', { name: 'og:title', content: pageData.title }])
  },
  buildEnd(siteConfig) {
    // e.g., write a llm-index.json next to the build output
  }
})
```

## Default theme config

Everything below lives under `themeConfig`.

### Nav

```ts
themeConfig: {
  logo: '/logo.svg',
  siteTitle: 'Data Platform',
  nav: [
    { text: 'Guide', link: '/guide/getting-started', activeMatch: '/guide/' },
    { text: 'Pipelines', link: '/pipelines/' },
    {
      text: 'Reference',
      items: [
        { text: 'Tables', link: '/tables/' },
        { text: 'Models', link: '/models/' },
        {
          text: 'Runbooks',
          items: [
            { text: 'Incidents', link: '/runbooks/incident' },
            { text: 'Backfills', link: '/runbooks/backfill' }
          ]
        }
      ]
    },
    { text: 'Status', link: 'https://status.example.com', target: '_blank' }
  ]
}
```

### Sidebar

Keyed by path prefix so each section gets its own navigation:

```ts
themeConfig: {
  sidebar: {
    '/guide/': [
      {
        text: 'Getting started',
        items: [
          { text: 'Install', link: '/guide/install' },
          { text: 'First pipeline', link: '/guide/first-pipeline' }
        ]
      },
      {
        text: 'Advanced',
        collapsed: true,
        items: [
          { text: 'Loaders', link: '/guide/loaders' },
          { text: 'Dynamic routes', link: '/guide/dynamic-routes' }
        ]
      }
    ],
    '/runbooks/': [
      { text: 'Runbooks', items: [/* ... */] }
    ]
  }
}
```

- `collapsed: true` makes a group closed by default.
- Nests up to 6 levels.
- Omit the object and pass a flat array for a single sidebar site-wide.

### Outline, aside, footer

```ts
themeConfig: {
  outline: { level: [2, 3], label: 'On this page' },
  aside: true,
  docFooter: { prev: 'Previous page', next: 'Next page' },
  footer: {
    message: 'Internal — do not distribute.',
    copyright: '© Acme Data Platform'
  },
  externalLinkIcon: true
}
```

### Edit link & last updated

```ts
themeConfig: {
  editLink: {
    pattern: 'https://github.com/acme/data-platform-docs/edit/main/docs/:path',
    text: 'Suggest an edit'
  },
  lastUpdated: {
    text: 'Updated',
    formatOptions: { dateStyle: 'medium', timeStyle: 'short' }
  }
}
```

Last-updated reads `git log -1 --pretty="%ai"`, so **shallow clones in CI produce empty dates**. Set `fetch-depth: 0` on `actions/checkout`.

### Search <Badge type="tip" text="differentiator" />

Local, client-side, no third party:

```ts
themeConfig: {
  search: {
    provider: 'local',
    options: {
      miniSearch: {
        searchOptions: { fuzzy: 0.2, prefix: true, boost: { title: 4 } }
      }
    }
  }
}
```

Exclude a page: add `search: false` to its frontmatter.

Algolia (hosted): same shape, swap `provider: 'algolia'` and supply `appId` / `apiKey` / `indexName`.

### Social & misc

```ts
themeConfig: {
  socialLinks: [
    { icon: 'github', link: 'https://github.com/acme/data-platform-docs' },
    { icon: 'slack', link: 'https://acme.slack.com/archives/C123' }
  ]
}
```

## Layouts and slots

Four built-in layouts, chosen via frontmatter `layout:`:

| Layout | Shape |
|---|---|
| `doc` | Sidebar + content + outline. The default. |
| `page` | No styles applied to content. Sidebar still shows. |
| `home` | Hero + features blocks, configured in frontmatter. |
| `false` | No layout at all. You render everything. |

### Layout slots <Badge type="tip" text="differentiator" />

The way to inject content into the default theme **without replacing components**. Four slots are live on this site:

- **`layout-top`**: the "Showcase — examples use fake data" banner at the top of every page.
- **`doc-before`**: a build-time note that appears only on individual table pages (e.g. [fct_orders](./tables/fct_orders)), gated by a `useRoute()` path check inside the custom `Layout.vue`.
- **`home-hero-image`**: the animated pipeline diagram on the homepage, replacing the default hero image.
- **`home-features-after`**: the "This site by the numbers" strip under the feature cards.

The pattern: write a `Layout.vue` that imports `DefaultTheme.Layout` and fills the slots via `<template>`, then point the theme entry at it.

```vue
<!-- .vitepress/theme/Layout.vue -->
<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'
import { computed } from 'vue'
import ShowcaseBanner from './components/ShowcaseBanner.vue'
import PipelineDiagram from './components/PipelineDiagram.vue'

const { Layout } = DefaultTheme
const route = useRoute()
const isTablePage = computed(
  () => route.path.startsWith('/tables/') && !route.path.endsWith('/tables/')
)
</script>

<template>
  <Layout>
    <template #layout-top>
      <ShowcaseBanner />
    </template>
    <template #doc-before>
      <div v-if="isTablePage"><em>Generated at build time.</em></div>
    </template>
    <template #home-hero-image>
      <PipelineDiagram />
    </template>
  </Layout>
</template>
```

```ts
// .vitepress/theme/index.ts
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout
} satisfies Theme
```

Slots you will actually use:

| Slot | When |
|---|---|
| `layout-top` / `layout-bottom` | Global banners (maintenance, "staging" label) |
| `nav-bar-content-after` | Extra nav-bar widgets |
| `doc-before` / `doc-after` | Runbook preamble, "last refreshed" footers |
| `doc-footer-before` | CTA before prev/next |
| `aside-outline-before` / `-after` | Ads/links next to the outline |
| `home-hero-image` | Custom hero visualisation |
| `not-found` | Friendly 404 |

Full slot list is in the VitePress docs — these cover ~90% of needs.

## Home page

The layout that this site's homepage uses. In frontmatter:

```yaml
---
layout: home

hero:
  name: Data Platform
  text: Docs that live next to code
  tagline: Pipelines, warehouses, and runbooks.
  image: { src: /hero.svg, alt: Data platform }
  actions:
    - theme: brand
      text: Get started
      link: /guide/install
    - theme: alt
      text: Source
      link: https://github.com/acme/data-platform-docs

features:
  - icon: 🧪
    title: Reproducible
    details: Every pipeline has a runbook, a test suite, and a backfill recipe.
    link: /guide/reproducibility
    linkText: Read more
  - icon: 🔐
    title: Governed
    details: Access via Unity Catalog; secrets via Vault.
---
```

Customise via CSS variables:

```css
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: linear-gradient(120deg, #0b5fff 30%, #41d1ff);
}
```

## Team page

A `layout: page` with the team components. Useful for a "platform team" / "data stewards" directory. **[See the team demo →](./team)**

```md
---
layout: page
---

<script setup lang="ts">
import {
  VPTeamPage, VPTeamPageTitle, VPTeamPageSection, VPTeamMembers
} from 'vitepress/theme'

const core = [
  {
    avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
    name: 'Priya N.',
    title: 'Platform Lead',
    org: 'Data Platform',
    desc: 'Owns ingestion and orchestration.',
    links: [
      { icon: 'github', link: 'https://github.com/priya' },
      { icon: 'slack', link: 'https://acme.slack.com/team/priya' }
    ]
  }
]

const stewards = [ /* ... */ ]
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>Data Platform Team</template>
    <template #lead>Who to page, and for what.</template>
  </VPTeamPageTitle>

  <VPTeamMembers size="medium" :members="core" />

  <VPTeamPageSection>
    <template #title>Data stewards</template>
    <template #members>
      <VPTeamMembers size="small" :members="stewards" />
    </template>
  </VPTeamPageSection>
</VPTeamPage>
```

## Build-time data loading <Badge type="tip" text="differentiator" />

Load data from anywhere at build time, import it from any `.md` or `.vue`. Lives in `*.data.ts`:

```ts
// docs/models.data.ts
import { defineLoader } from 'vitepress'

export interface ModelDoc {
  name: string
  owner: string
  latencyMs: number
}

declare const data: ModelDoc[]
export { data }

export default defineLoader({
  watch: ['./catalog/models/*.yaml'],
  async load(files) {
    // In real life: parse YAML, or SELECT from a Delta table, or hit MLflow.
    return [
      { name: 'fraud-v3', owner: 'risk', latencyMs: 42 },
      { name: 'reco-v7', owner: 'growth', latencyMs: 18 }
    ]
  }
})
```

Use it in a page:

```md
<script setup lang="ts">
import { data as models } from '../models.data.ts'
</script>

| Model | Owner | p50 latency |
| --- | --- | --- |
<tr v-for="m in models" :key="m.name">
  <td>{{ m.name }}</td>
  <td>{{ m.owner }}</td>
  <td>{{ m.latencyMs }} ms</td>
</tr>
```

### Indexing Markdown with `createContentLoader`

Generate blog-style indices (changelog, incident log, release notes). **[See the changelog demo →](./changelog/)**

```ts
// docs/changelog.data.ts
import { createContentLoader } from 'vitepress'

export default createContentLoader('changelog/*.md', {
  includeSrc: false,
  render: false,
  excerpt: true,
  transform(raw) {
    return raw
      .filter((p) => !p.frontmatter.draft)
      .sort((a, b) => +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date))
      .map((p) => ({
        title: p.frontmatter.title,
        url: p.url,
        date: p.frontmatter.date,
        excerpt: p.excerpt
      }))
  }
})
```

Loaders run in Node, so `fs`, `path`, `@databricks/sql`, or the OpenAI SDK are all fair game. Output is snapshotted into the build — readers get plain HTML.

::: warning Two footguns worth knowing
The glob passed to `createContentLoader` is resolved relative to **`srcDir`**, not to the loader file's directory. If `srcDir` is the project root (the default), point at `docs/changelog/*.md`. If your `srcDir` is already `docs/`, write `changelog/*.md`. Silent empty results almost always mean the glob is aimed at the wrong place.

Dates are the other victim: YAML parses `date: 2026-01-15` as a `Date` object, so render it with `.toISOString().slice(0, 10)` inside `transform()` to keep a clean `YYYY-MM-DD` string.
:::

Another `*.data.ts` pattern — the "This site by the numbers" strip on the homepage is a plain loader (not `createContentLoader`) that walks the repo with `readdirSync(..., { recursive: true })` to count pages, data loaders, and dynamic-route templates. Loaders don't have to read Markdown; they can expose anything the build can discover.

## Styling and extending the theme

CSS variables are the primary knob. Drop overrides in `.vitepress/theme/custom.css`:

```css
:root {
  --vp-c-brand-1: #0b5fff;
  --vp-c-brand-2: #2a73ff;
  --vp-c-brand-3: #4f8dff;

  --vp-font-family-base: 'Inter', system-ui, sans-serif;
  --vp-font-family-mono: 'JetBrains Mono', ui-monospace, monospace;
}

.dark {
  --vp-c-bg: #0a0a0a;
  --vp-c-bg-alt: #111;
}
```

Wire the CSS, slot injections, and global components through a single theme entry:

```ts
// .vitepress/theme/index.ts
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './custom.css'

import Banner from './components/Banner.vue'
import CatalogBadge from './components/CatalogBadge.vue'

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'layout-top': () => h(Banner, { message: 'Staging mirror — writes disabled.' })
    }),
  enhanceApp({ app }) {
    app.component('CatalogBadge', CatalogBadge)
  }
}
```

### Auto-register a folder of components

Handy when every doc page might embed a chart, a SQL result, or a diagram:

```ts
enhanceApp({ app }) {
  const modules = import.meta.glob('./components/*.vue', { eager: true })
  for (const [path, mod] of Object.entries(modules)) {
    const name = path.split('/').pop()!.replace('.vue', '')
    app.component(name, (mod as any).default)
  }
}
```

### Fonts

Drop Inter to self-host something else:

```ts
// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme-without-fonts'  // not '/theme'
import './custom.css'
export default DefaultTheme
```

Preload the replacement via `transformHead` in `config.ts`.

### Escape hatch: replacing internal components

If slots and CSS variables are not enough, alias an internal component:

```ts
// .vitepress/config.ts
export default {
  vite: {
    resolve: {
      alias: [
        {
          find: /^.*\/VPNavBarTitle\.vue$/,
          replacement: fileURLToPath(new URL('./theme/components/MyNavTitle.vue', import.meta.url))
        }
      ]
    }
  }
}
```

Used rarely. Prefer slots.

## Assets

- **Relative**: `![diagram](./diagrams/flow.svg)` — resolved relative to the `.md` file.
- **Absolute**: `![logo](/logo.svg)` — served from `public/`.
- **`public/`** — anything in it is copied verbatim into the build. Don't include the word `public` in the URL.
- **`withBase(path)`** — prepend the configured `base` to a runtime path:

```ts
import { withBase } from 'vitepress'
const href = withBase('/downloads/runbook.pdf')  // '/docs-site/downloads/runbook.pdf'
```

## Runtime API

Import from `vitepress` inside `.md` `<script setup>` blocks or components:

```ts
import { useData, useRoute, useRouter, withBase } from 'vitepress'

const { site, theme, page, frontmatter, params, isDark, lang } = useData()
const route = useRoute()   // { path, data, component }
const router = useRouter() // { go(), route, onBeforeRouteChange, onAfterRouteChange }
```

Template globals available in any `.md`:

- `$frontmatter` — this page's frontmatter
- `$params` — dynamic route params

Built-in components: `<Content />` (inside custom layouts), `<ClientOnly>`.

## Deploy to GitHub Pages

```yaml
# .github/workflows/docs.yml
name: Deploy Docs
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0          # needed for `lastUpdated` git timestamps
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run docs:build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Checklist:

- In the GitHub Pages settings, set **Source: GitHub Actions**.
- If the site is served at `https://org.github.io/repo/`, set `base: '/repo/'` in `config.ts`.
- `fetch-depth: 0` is the classic gotcha — without it, `lastUpdated` is empty because the shallow clone has no history.
- `cleanUrls: true` does **not** work on GitHub Pages (no server rewrites). Link with explicit paths or leave `cleanUrls` off.
- Cache strategy (when you move to a platform with header config later): `Cache-Control: max-age=31536000, immutable` for `/assets/*`, short TTL for `*.html`.

## Sitemap

```ts
// .vitepress/config.ts
export default defineConfig({
  sitemap: {
    hostname: 'https://docs.internal.example.com/',
    lastmodDateOnly: true,
    transformItems(items) {
      return items.filter((i) => !i.url.startsWith('drafts/'))
    }
  }
})
```

Produces `sitemap.xml` at the root of the build. If `base` is set, include it in `hostname`.
