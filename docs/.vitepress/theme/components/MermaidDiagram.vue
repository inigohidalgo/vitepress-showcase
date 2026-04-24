<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{
  source: string
  styles?: string
}>()

const container = ref<HTMLDivElement | null>(null)
let counter = 0

// #region themeCSS
const themeCSS = `
  .node rect, .node circle, .node ellipse, .node polygon, .node path {
    fill: var(--vp-mermaid-node-bg);
    stroke: var(--vp-mermaid-node-border);
  }
  .node .label, .node .label *, .node .nodeLabel, .node .nodeLabel *,
  .node foreignObject div, .node text, .node tspan {
    color: var(--vp-mermaid-node-text) !important;
    fill: var(--vp-mermaid-node-text) !important;
  }

  .cluster rect, .cluster polygon {
    fill: var(--vp-mermaid-cluster-bg);
    stroke: var(--vp-mermaid-cluster-border);
  }
  .cluster .cluster-label, .cluster .cluster-label *,
  .cluster text, .cluster tspan {
    color: var(--vp-mermaid-cluster-text) !important;
    fill: var(--vp-mermaid-cluster-text) !important;
  }

  .edgePath .path, .flowchart-link {
    stroke: var(--vp-mermaid-edge);
  }
  .arrowheadPath, marker path {
    fill: var(--vp-mermaid-edge);
    stroke: var(--vp-mermaid-edge);
  }

  .edgeLabel, .edgeLabel *, .edgeLabel foreignObject div,
  .edgeLabel text, .edgeLabel tspan {
    color: var(--vp-mermaid-edge-text) !important;
    fill: var(--vp-mermaid-edge-text) !important;
    background-color: var(--vp-mermaid-edge-label-bg) !important;
  }
`
// #endregion themeCSS

async function render() {
  if (!container.value) return
  const { default: mermaid } = await import('mermaid')
  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    securityLevel: 'loose',
    themeCSS: themeCSS + (props.styles ?? ''),
    themeVariables: {
      fontFamily: 'var(--vp-font-family-base)'
    },
    flowchart: { htmlLabels: true }
  })
  const id = `vp-mermaid-${++counter}`
  const { svg } = await mermaid.render(id, props.source)
  if (container.value) container.value.innerHTML = svg
}

onMounted(render)
watch(() => [props.source, props.styles], render)
</script>

<template>
  <div ref="container" class="vp-mermaid-diagram" />
</template>

<style scoped>
.vp-mermaid-diagram {
  display: flex;
  justify-content: center;
  margin: 16px 0;
}
.vp-mermaid-diagram :deep(svg) {
  max-width: 100%;
  height: auto;
}
</style>
