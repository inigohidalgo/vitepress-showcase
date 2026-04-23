---
title: Feature store hourly refresh
date: 2026-03-20
author: ml-platform
tags: [feature-store, infra]
---

`ml.ml_feature_store` now refreshes hourly instead of daily. Feature freshness SLO tightened from 24h to 2h; alerts fire into `#ml-platform-oncall` via PagerDuty integration.

Cost impact: +$180/mo compute. Offset by decommissioning the legacy batch job that previously ran every 3 hours.
