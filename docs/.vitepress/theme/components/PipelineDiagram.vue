<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

interface Node {
  id: string
  label: string
  x: number
  y: number
}

const nodes: Node[] = [
  { id: 'kafka',     label: 'Kafka',     x: 70,  y: 120 },
  { id: 'spark',     label: 'Spark',     x: 220, y: 60  },
  { id: 'features',  label: 'Features',  x: 220, y: 180 },
  { id: 'delta',     label: 'Delta',     x: 370, y: 120 },
  { id: 'model',     label: 'Model',     x: 500, y: 60  },
  { id: 'dash',      label: 'Dashboard', x: 500, y: 180 }
]

interface Edge { from: string; to: string }

const edges: Edge[] = [
  { from: 'kafka',    to: 'spark' },
  { from: 'kafka',    to: 'features' },
  { from: 'spark',    to: 'delta' },
  { from: 'features', to: 'delta' },
  { from: 'delta',    to: 'model' },
  { from: 'delta',    to: 'dash' }
]

function nodeById(id: string) {
  return nodes.find((n) => n.id === id)!
}

const edgePaths = computed(() =>
  edges.map((e) => {
    const a = nodeById(e.from)
    const b = nodeById(e.to)
    const mx = (a.x + b.x) / 2
    return `M ${a.x + 32} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x - 32} ${b.y}`
  })
)

const pathRefs = ref<(SVGPathElement | null)[]>([])
const activeEdge = ref(0)
const dotX = ref<number | null>(null)
const dotY = ref<number | null>(null)

const DURATION_MS = 1200
let raf = 0
let segmentStart = 0

function step(ts: number) {
  if (!segmentStart) segmentStart = ts

  const path = pathRefs.value[activeEdge.value]
  if (path) {
    const t = Math.min(1, (ts - segmentStart) / DURATION_MS)
    const len = path.getTotalLength()
    const pt = path.getPointAtLength(len * t)
    dotX.value = pt.x
    dotY.value = pt.y

    if (t >= 1) {
      segmentStart = ts
      activeEdge.value = (activeEdge.value + 1) % edges.length
    }
  }

  raf = requestAnimationFrame(step)
}

onMounted(() => {
  raf = requestAnimationFrame(step)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
})
</script>

<template>
  <div class="pd-wrap">
    <svg viewBox="0 0 580 240" class="pd" role="img" aria-label="A data pipeline diagram with animated flow">
      <g class="pd-edges">
        <path
          v-for="(d, i) in edgePaths"
          :key="i"
          :ref="(el) => (pathRefs[i] = el as SVGPathElement | null)"
          :d="d"
          class="pd-edge"
          :class="{ 'pd-edge-active': i === activeEdge }"
          fill="none"
        />
      </g>

      <circle
        v-if="dotX !== null && dotY !== null"
        class="pd-dot"
        :cx="dotX"
        :cy="dotY"
        r="4"
      />

      <g class="pd-nodes">
        <g v-for="n in nodes" :key="n.id" :transform="`translate(${n.x}, ${n.y})`">
          <rect x="-34" y="-18" width="68" height="36" rx="8" class="pd-node-bg" />
          <text text-anchor="middle" dominant-baseline="middle" class="pd-node-text">{{ n.label }}</text>
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.pd-wrap {
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* On narrow screens VPHero's .image-container is a fixed 320/392px square
   with the blurred gradient centered inside. Mirror the default image's
   absolute-centered placement so the diagram lines up with the halo. */
@media (max-width: 959px) {
  .pd-wrap {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 360px;
  }
}
.pd {
  width: 100%;
  height: auto;
}

.pd-edge {
  stroke: var(--vp-c-divider);
  stroke-width: 1.5;
  transition: stroke 0.4s;
}
.pd-edge-active {
  stroke: var(--vp-c-brand-1);
  stroke-width: 2;
}

.pd-dot {
  fill: var(--vp-c-brand-1);
  filter: drop-shadow(0 0 6px var(--vp-c-brand-1));
}

.pd-node-bg {
  fill: var(--vp-c-bg-soft);
  stroke: var(--vp-c-divider);
  stroke-width: 1;
}
.pd-node-text {
  fill: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  font-weight: 600;
}
</style>
