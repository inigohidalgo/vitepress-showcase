<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'
import { computed } from 'vue'
import ShowcaseBanner from './components/ShowcaseBanner.vue'
import PipelineDiagram from './components/PipelineDiagram.vue'
import StatsStrip from './components/StatsStrip.vue'

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
      <div v-if="isTablePage" class="table-note">
        <em>This page was generated at build time from <code>docs/tables/_catalog.ts</code>.</em>
      </div>
    </template>

    <template #home-hero-image>
      <PipelineDiagram />
    </template>

    <template #home-features-after>
      <StatsStrip />
    </template>
  </Layout>
</template>

<style scoped>
.table-note {
  background: var(--vp-c-tip-soft);
  border-left: 3px solid var(--vp-c-tip-1);
  padding: 0.4rem 0.8rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  border-radius: 0 4px 4px 0;
}
</style>
