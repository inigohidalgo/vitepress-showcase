// Sibling module for the cheatsheet's mermaid demo. Kept in a separate file so
// the graph source and per-instance styles can be imported by the markdown's
// <script setup> AND inlined into prose via `<<< @/_mermaid_demo.ts#region`.

// #region graph
export const graph = `
flowchart LR
  A[Ingest] --> B(Validate)
  B --> C{Classify}
  C -->|clean| D[Publish]
  C -->|pii| E[PII Scrub]
  E --> D

  classDef highlight stroke-width:2px
  classDef scrub stroke-width:2px,stroke-dasharray:4 2
  class C highlight
  class E scrub
`
// #endregion graph

// #region scrubStyles
// Tier 3 — concatenated onto themeCSS at render time, scoped to this one diagram.
export const scrubStyles = `
  .node.scrub rect {
    fill: var(--vp-c-warning-soft) !important;
    stroke: var(--vp-c-warning-1) !important;
    stroke-dasharray: 4 2 !important;
  }
  .node.scrub .label, .node.scrub .label * {
    color: var(--vp-c-warning-1) !important;
    fill: var(--vp-c-warning-1) !important;
  }
`
// #endregion scrubStyles
