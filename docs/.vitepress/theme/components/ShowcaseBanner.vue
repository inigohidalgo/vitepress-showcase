<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const el = ref<HTMLElement | null>(null)
let observer: ResizeObserver | null = null

function sync() {
  if (!el.value) return
  const h = el.value.getBoundingClientRect().height
  document.documentElement.style.setProperty('--vp-layout-top-height', `${h}px`)
}

onMounted(() => {
  sync()
  if (el.value && 'ResizeObserver' in window) {
    observer = new ResizeObserver(sync)
    observer.observe(el.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  document.documentElement.style.removeProperty('--vp-layout-top-height')
})
</script>

<template>
  <div ref="el" class="sb">
    <strong>Showcase</strong>
    <span>— examples use fake data. Injected via the <code>layout-top</code> slot.</span>
  </div>
</template>

<style scoped>
.sb {
  background: linear-gradient(90deg, var(--vp-c-brand-soft), transparent), var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 0.35rem 1rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  min-height: 32px;
  box-sizing: border-box;
  z-index: var(--vp-z-index-layout-top);
}
.sb strong { color: var(--vp-c-brand-1); margin-right: 0.25rem; }
.sb code {
  font-size: 0.75rem;
  background: var(--vp-c-default-soft);
  padding: 0 0.3rem;
  border-radius: 3px;
}
</style>
