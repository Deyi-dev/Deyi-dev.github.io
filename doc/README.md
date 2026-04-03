# 架构决策记录（ADR）索引

本目录记录了博客项目 deyi-dev.github.io 的所有架构决策。

## ADR 列表

| 编号 | 标题 | 状态 | 日期 |
|------|------|------|------|
| [ADR-001](ADR-001-framework-selection-astro.md) | 博客框架选型 — 从 Hugo 到纯 HTML 再到 Astro | Accepted | 2026-04-02 |
| [ADR-002](ADR-002-toolchain-selection.md) | 工具链选型 — Figma → Claude Code MCP → Astro → Cloudflare Pages | Accepted | 2026-04-02 |
| [ADR-003](ADR-003-migration-implementation-decisions.md) | 迁移实现决策 — 具体技术选择 | Accepted | 2026-04-02 |

## 相关文档

- [迁移 Runbook](../runbook/migration-to-astro.md) — 执行步骤与验证清单

## ADR 格式说明

每条 ADR 包含：

- **状态**：Proposed → Accepted → Deprecated → Superseded
- **背景**：为什么需要做这个决策
- **决策**：我们选了什么
- **理由**：为什么选它，考虑过哪些替代方案
- **后果**：正面影响和需要接受的权衡
- **重新审视条件**（如适用）：什么情况下应该回来重新评估这个决策
