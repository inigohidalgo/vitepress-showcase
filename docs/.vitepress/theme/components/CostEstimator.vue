<script setup lang="ts">
import { computed, ref } from 'vue'

interface Model {
  id: string
  label: string
  inUsdPerMTok: number
  outUsdPerMTok: number
  p50Ms: number
}

const MODELS: Model[] = [
  { id: 'haiku',  label: 'Haiku 4.5',  inUsdPerMTok: 1.0,  outUsdPerMTok: 5.0,  p50Ms: 220 },
  { id: 'sonnet', label: 'Sonnet 4.6', inUsdPerMTok: 3.0,  outUsdPerMTok: 15.0, p50Ms: 480 },
  { id: 'opus',   label: 'Opus 4.7',   inUsdPerMTok: 15.0, outUsdPerMTok: 75.0, p50Ms: 780 }
]

const model = ref<Model>(MODELS[1])
const rows = ref(50_000)
const inputTokensPerRow = ref(800)
const outputTokensPerRow = ref(200)
const concurrency = ref(10)

const usd = computed(() => {
  const inCost  = (rows.value * inputTokensPerRow.value  / 1_000_000) * model.value.inUsdPerMTok
  const outCost = (rows.value * outputTokensPerRow.value / 1_000_000) * model.value.outUsdPerMTok
  return inCost + outCost
})

const wallClockMin = computed(() => {
  const totalMs = (rows.value / concurrency.value) * model.value.p50Ms
  return totalMs / 1000 / 60
})

const fmtUsd = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n)
</script>

<template>
  <div class="ce">
    <div class="ce-row">
      <label>Model</label>
      <select v-model="model">
        <option v-for="m in MODELS" :key="m.id" :value="m">{{ m.label }}</option>
      </select>
    </div>

    <div class="ce-row">
      <label>Rows to process</label>
      <input type="number" v-model.number="rows" min="1" step="1000" />
    </div>

    <div class="ce-row">
      <label>Input tokens / row</label>
      <input type="number" v-model.number="inputTokensPerRow" min="1" />
    </div>

    <div class="ce-row">
      <label>Output tokens / row</label>
      <input type="number" v-model.number="outputTokensPerRow" min="1" />
    </div>

    <div class="ce-row">
      <label>Concurrency</label>
      <input type="number" v-model.number="concurrency" min="1" max="500" />
    </div>

    <div class="ce-out">
      <div>
        <span class="ce-label">Cost</span>
        <span class="ce-value">{{ fmtUsd(usd) }}</span>
      </div>
      <div>
        <span class="ce-label">Wall-clock (p50)</span>
        <span class="ce-value">{{ wallClockMin.toFixed(1) }} min</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ce {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1rem 1.2rem;
  background: var(--vp-c-bg-soft);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem 1.2rem;
  margin: 1rem 0;
}
.ce-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.ce-row label {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}
.ce-row select,
.ce-row input {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  padding: 0.3rem 0.5rem;
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
}
.ce-out {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-around;
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 0.8rem;
  margin-top: 0.3rem;
}
.ce-out > div {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.ce-label { font-size: 0.75rem; color: var(--vp-c-text-2); }
.ce-value { font-size: 1.4rem; font-weight: 600; color: var(--vp-c-brand-1); }
</style>
