export interface TableSpec {
  name: string
  schema: string
  owner: string
  grain: string
  refresh: string
  description: string
  columns: Array<{ name: string; type: string; desc: string }>
}

export const tables: TableSpec[] = [
  {
    name: 'fct_orders',
    schema: 'sales',
    owner: 'data-platform',
    grain: 'one row per order',
    refresh: 'daily @ 06:00 UTC',
    description: 'Canonical order fact. Source of truth for revenue reporting.',
    columns: [
      { name: 'order_id', type: 'STRING', desc: 'Primary key, UUID v7.' },
      { name: 'customer_id', type: 'STRING', desc: 'FK to dim_customers.' },
      { name: 'amount_usd', type: 'DECIMAL(18,2)', desc: 'Gross order amount in USD.' },
      { name: 'placed_at', type: 'TIMESTAMP', desc: 'Order submission time (UTC).' }
    ]
  },
  {
    name: 'dim_customers',
    schema: 'sales',
    owner: 'data-platform',
    grain: 'one row per customer (SCD-2)',
    refresh: 'daily @ 05:30 UTC',
    description: 'Customer dimension with slowly-changing attributes tracked over time.',
    columns: [
      { name: 'customer_id', type: 'STRING', desc: 'Natural key.' },
      { name: 'valid_from', type: 'TIMESTAMP', desc: 'Inclusive lower bound.' },
      { name: 'valid_to', type: 'TIMESTAMP', desc: 'Exclusive upper bound; NULL for current row.' },
      { name: 'tier', type: 'STRING', desc: 'One of free, pro, enterprise.' }
    ]
  },
  {
    name: 'ml_feature_store',
    schema: 'ml',
    owner: 'ml-platform',
    grain: 'one row per (entity_id, feature_ts)',
    refresh: 'hourly',
    description: 'Online/offline feature store backing the fraud and reco models.',
    columns: [
      { name: 'entity_id', type: 'STRING', desc: 'Customer or session identifier.' },
      { name: 'feature_ts', type: 'TIMESTAMP', desc: 'Point-in-time the features are valid for.' },
      { name: 'features', type: 'MAP<STRING, DOUBLE>', desc: 'Feature name → value.' }
    ]
  }
]
