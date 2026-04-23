---
layout: page
title: Data Platform Team
---

<script setup lang="ts">
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamPageSection,
  VPTeamMembers
} from 'vitepress/theme'

const bot = (seed: string) =>
  `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,ffd5dc,ffdfbf`

const core = [
  {
    avatar: bot('B0B-3000'),
    name: 'B0B-3000',
    title: 'Platform Lead',
    org: 'Data Platform',
    desc: 'Owns ingestion, orchestration, and the Unity Catalog rollout.',
    links: [
      { icon: 'github', link: 'https://github.com/' },
      { icon: 'slack', link: 'https://slack.com/' }
    ]
  },
  {
    avatar: bot('Unit-Pi'),
    name: 'Unit-π',
    title: 'Senior Engineer',
    org: 'Data Platform',
    desc: 'Feature store, streaming backbone, incident commander rotation.',
    links: [
      { icon: 'github', link: 'https://github.com/' }
    ]
  },
  {
    avatar: bot('Qbert-9'),
    name: 'Qbert-9',
    title: 'Staff Engineer',
    org: 'ML Platform',
    desc: 'Model serving, evaluation, GenAI guardrails.',
    links: [
      { icon: 'github', link: 'https://github.com/' }
    ]
  }
]

const stewards = [
  {
    avatar: bot('Nibbles'),
    name: 'Nibbles',
    title: 'Sales Data Steward',
    desc: 'Schema-level approvals for `sales.*`.'
  },
  {
    avatar: bot('Byte-O'),
    name: 'Byte-O',
    title: 'ML Data Steward',
    desc: 'Schema-level approvals for `ml.*`.'
  }
]
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>Data Platform Team</template>
    <template #lead>
      Who to page, and for what. Rotations are published in the incident
      runbook; escalations go via <code>#data-platform-oncall</code>.
    </template>
  </VPTeamPageTitle>

  <VPTeamMembers size="medium" :members="core" />

  <VPTeamPageSection>
    <template #title>Data stewards</template>
    <template #lead>
      Approve schema changes and access requests for their domain. File
      requests via the self-service portal; the steward is auto-assigned.
    </template>
    <template #members>
      <VPTeamMembers size="small" :members="stewards" />
    </template>
  </VPTeamPageSection>
</VPTeamPage>
