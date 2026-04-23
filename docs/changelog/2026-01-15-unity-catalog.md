---
title: Unity Catalog migration complete
date: 2026-01-15
author: data-platform
tags: [governance, migration]
---

All `sales.*` and `ml.*` schemas are now managed under Unity Catalog. Legacy Hive metastore entries remain for 30 days then will be dropped. Update any Databricks jobs that reference `hive_metastore.sales.*` to `sales.*`.

**Breaking**: SCIM-managed groups replace the previous email-based ACLs. Access requests now route through the IAM portal.
