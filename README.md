# vitepress-showcase

A fake Python project whose documentation is a VitePress showcase. The docs demonstrate the features they describe on the same pages, oriented toward data-platform / Databricks / GenAI contexts.

**Live site**: <https://inigohidalgo.github.io/vitepress-showcase/>

## Layout

```
.
├─ pyproject.toml         # Python project (placeholder)
├─ src/vitepress_showcase/  # package (placeholder)
├─ tests/                 # pytest (placeholder)
└─ docs/                  # VitePress site — this is srcDir
   ├─ .vitepress/
   │  ├─ config.ts
   │  └─ theme/
   ├─ index.md            # home
   ├─ cheatsheet.md
   ├─ tables/             # dynamic-routes demo
   ├─ changelog/          # createContentLoader demo
   ├─ team.md
   ├─ stats.data.ts       # build-time stats loader
   └─ package.json
```

All Node/VitePress state is isolated under `docs/` so Python work isn't affected.

## Local docs workflow

```bash
cd docs
npm ci
npm run dev      # :5173
npm run build    # → docs/.vitepress/dist
npm run preview
```

## Deployment

Pushes to `main` trigger `.github/workflows/docs.yml`, which builds `docs/` and deploys via GitHub Pages. Pages source must be set to **GitHub Actions** in the repo settings (handled by the workflow).
