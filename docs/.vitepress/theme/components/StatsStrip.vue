<script setup lang="ts">
import { data as stats } from '../../../stats.data.ts'
</script>

<template>
  <section class="ss">
    <div class="ss-inner">
      <h2 class="ss-heading">This site, by the numbers</h2>
      <p class="ss-sub">
        Computed at build time by <code>stats.data.ts</code> — every figure below is glob-counted from the repo.
      </p>
      <div class="ss-grid">
        <div v-for="s in stats" :key="s.label" class="ss-cell">
          <div class="ss-value">{{ s.value }}</div>
          <div class="ss-label">{{ s.label }}</div>
          <div class="ss-hint">{{ s.hint }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ss {
  margin-top: 4rem;
  padding: 4rem 1.5rem 5rem;
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-divider);
}

@media (min-width: 960px) {
  .ss {
    margin-top: 6rem;
    padding: 5rem 1.5rem 6rem;
  }
}
.ss-inner {
  max-width: 1152px;
  margin: 0 auto;
}
.ss-heading {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.35rem;
  color: var(--vp-c-text-1);
}
.ss-sub {
  color: var(--vp-c-text-2);
  margin: 0 0 1.75rem;
  font-size: 0.95rem;
}
.ss-sub code {
  font-size: 0.85rem;
  background: var(--vp-c-default-soft);
  padding: 0.05rem 0.4rem;
  border-radius: 4px;
}

.ss-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.ss-cell {
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  border-radius: 10px;
  padding: 1rem 1.1rem;
}
.ss-value {
  font-size: 2.2rem;
  font-weight: 700;
  line-height: 1;
  color: var(--vp-c-brand-1);
  font-variant-numeric: tabular-nums;
}
.ss-label {
  margin-top: 0.35rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.ss-hint {
  margin-top: 0.2rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  line-height: 1.4;
}
</style>
