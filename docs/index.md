---
layout: home

hero:
  name: VitePress Showcase
  text: A cheatsheet that documents itself
  tagline: Patterns for building internal docs sites for data pipelines, Databricks, and GenAI platforms — demonstrated on the page that describes them.
  actions:
    - theme: brand
      text: Open the cheatsheet
      link: /cheatsheet
    - theme: alt
      text: VitePress on GitHub
      link: https://github.com/vuejs/vitepress

features:
  - icon: 📝
    title: Markdown that does more
    details: Custom containers, GitHub-flavored alerts, code groups, diffs, focus, line highlights, file imports, and markdown includes with regions.
    link: /cheatsheet#markdown-extensions
    linkText: See the syntax
  - icon: 🧩
    title: Vue inside Markdown
    details: Drop components, expressions, and reactive state into any doc page. Interactive runbooks stay next to the prose that explains them.
    link: /cheatsheet#vue-in-markdown
    linkText: Try the live widget
  - icon: 🔀
    title: Dynamic routes
    details: One template, many pages. Generate a page per table, model, or notebook from a build-time data source.
    link: /tables/
    linkText: Explore the table catalog
  - icon: 📚
    title: Build-time data fetching
    details: Snapshot a CSV, a SQL query, or a folder of Markdown into typed data. No runtime, no API keys, no stale indexes.
    link: /changelog/
    linkText: See the changelog demo
  - icon: 🎨
    title: Tweakable default theme
    details: CSS variables, layout slots, and global components give personality without writing a theme from scratch.
    link: /cheatsheet#styling-and-extending-the-theme
    linkText: Styling recipes
  - icon: 🔎
    title: Built-in local search
    details: Full-text search with no third party, no index service, no API key. Press Cmd-K anywhere on this site.
    link: /cheatsheet#search
    linkText: Configure it
---

## Why this site exists

A VitePress reference that **uses the features it describes on the same pages it describes them**. The [cheatsheet](/cheatsheet) has the syntax; the surrounding site runs it. Snippets lean toward Python, SQL, and data-platform contexts (pipelines, Databricks, GenAI) rather than the JavaScript-heavy examples in the upstream docs — the goal is a reference someone writing internal data-platform docs can copy from.

### What's demonstrated live

- **Home hero pipeline diagram** — a Vue component rendered into the `home-hero-image` slot, running a `requestAnimationFrame` loop along SVG paths.
- **"This site by the numbers"** strip — a build-time `*.data.ts` that walks the repo with `readdirSync`, injected via the `home-features-after` slot.
- **Showcase banner** (top of every page) — the `layout-top` slot, with a `ResizeObserver` wiring its height to `--vp-layout-top-height` so the rest of the layout stays aligned.
- **Interactive `CostEstimator`** inside the cheatsheet — a globally-registered Vue component dropped straight into Markdown.
- **[Table catalog](/tables/)** — three pages generated from one `[table].paths.ts` loader and one `[table].md` template.
- **[Changelog](/changelog/)** — `createContentLoader` scans dated Markdown, filters drafts, sorts, and renders a grouped index.
- **[Team page](/team)** — default-theme `VPTeam*` components with bot avatars.

### What's in scope

- Default theme, tweaked via CSS variables, layout slots, and a handful of custom components.
- Markdown extensions, Vue-in-Markdown, dynamic routes, build-time data loaders.
- GitHub Pages deploys.
- Python- and SQL-oriented snippets.

### What's out of scope

- Custom theme from scratch.
- i18n, MPA mode, SSR escape hatches, CMS integrations.
- Non-GitHub deploy targets.
