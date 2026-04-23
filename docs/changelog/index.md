---
title: Changelog
---

<script setup lang="ts">
import { computed } from 'vue'
import { data as entries } from './entries.data.ts'

const grouped = computed(() => {
  const byYear = new Map<string, typeof entries>()
  for (const e of entries) {
    const year = e.date.slice(0, 4)
    if (!byYear.has(year)) byYear.set(year, [])
    byYear.get(year)!.push(e)
  }
  return Array.from(byYear.entries())
})
</script>

# Changelog

A single `createContentLoader` scans `docs/changelog/2*-*.md`, drops anything marked `draft: true`, sorts by date, and hands the result to this page. Adding a new dated `.md` under `docs/changelog/` will make it appear here automatically.

<div v-for="[year, items] in grouped" :key="year" class="cl-year">
  <h2 class="cl-year-title">{{ year }}</h2>

  <article v-for="e in items" :key="e.url" class="cl-entry">
    <header class="cl-head">
      <h3 class="cl-title">
        <a :href="e.url">{{ e.title }}</a>
      </h3>
      <div class="cl-meta">
        <time>{{ e.date }}</time>
        <span class="cl-sep">·</span>
        <span class="cl-author">{{ e.author }}</span>
        <span v-for="t in e.tags" :key="t" class="cl-tag">{{ t }}</span>
      </div>
    </header>
    <div class="cl-excerpt" v-html="e.excerpt" />
  </article>
</div>

<style scoped>
.cl-year { margin-top: 2.5rem; }
.cl-year-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid var(--vp-c-divider);
  margin: 0 0 1rem;
}

.cl-entry {
  padding: 1.2rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
}
.cl-entry:last-child { border-bottom: 0; }

.cl-head { margin-bottom: 0.4rem; }

.cl-title {
  margin: 0 0 0.3rem;
  font-size: 1.15rem;
  font-weight: 600;
  line-height: 1.35;
}
.cl-title a {
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.15s;
}
.cl-title a:hover { color: var(--vp-c-brand-1); }

.cl-meta {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}
.cl-meta time {
  font-family: var(--vp-font-family-mono);
  font-variant-numeric: tabular-nums;
}
.cl-sep { opacity: 0.5; }
.cl-author { color: var(--vp-c-text-2); }
.cl-tag {
  font-size: 0.7rem;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  line-height: 1.4;
}

.cl-excerpt {
  color: var(--vp-c-text-2);
  font-size: 0.92rem;
  line-height: 1.55;
}
.cl-excerpt :deep(p) { margin: 0; }
</style>
