import { tables, type TableSpec } from './_catalog'

function buildContent(t: TableSpec): string {
  const rows = t.columns
    .map((c) => `| \`${c.name}\` | \`${c.type}\` | ${c.desc} |`)
    .join('\n')
  return `## Columns

| Name | Type | Description |
| --- | --- | --- |
${rows}

## Sample query

\`\`\`sql
SELECT *
FROM ${t.schema}.${t.name}
LIMIT 10;
\`\`\`
`
}

export default {
  paths() {
    return tables.map((t) => ({
      params: {
        table: t.name,
        schema: t.schema,
        owner: t.owner,
        grain: t.grain,
        refresh: t.refresh,
        description: t.description
      },
      content: buildContent(t)
    }))
  }
}
