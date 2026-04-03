# ADR-001: 博客框架选型 — 从 Hugo 到纯 HTML 再到 Astro

- **状态**: Accepted
- **日期**: 2026-04-02
- **决策者**: Deyi

## 背景

我们的博客经历了三个技术阶段：

1. **Hugo 阶段**：最初使用 Hugo 构建博客。Hugo 的模板语言（Go templates）对 UI 的精细控制能力不足，无法高保真还原 Figma 设计稿。
2. **纯 HTML/CSS/JS 阶段**：为了获得完全的 UI 控制权，迁移到手写 HTML/CSS/JS。解决了设计还原问题，但引入了新痛点：公共组件（导航、页头、页脚）需要在每个页面手动复制维护，无法自动生成分类页、RSS、sitemap 等博客基础功能。
3. **当前状态**：博客为单个 HTML 页面，文章硬编码在页面中，计划新增 Projects、About 等页面，并需要 Markdown 渲染博客内容。

核心需求：

- 对 UI 的像素级精细控制（Figma 设计稿高保真还原）
- 组件复用，消除重复劳动
- SEO（meta tags、sitemap、结构化数据）
- 响应式图片管理与多设备适配
- RSS feed 自动生成
- 按标签/分类自动生成聚合页
- 评论系统集成
- 与 Figma MCP + Claude Code 工作流兼容

## 决策

采用 **Astro** 作为博客框架，替代当前的纯 HTML/CSS/JS 方案。

## 理由

### Astro 满足所有核心需求

**UI 控制力**：Astro 的 `.astro` 模板语法是 HTML 的超集——任何合法的 HTML 都是合法的 Astro 代码。从 Figma 导出的设计稿可以几乎原样使用，UI 控制力与纯 HTML 方案等同，零损失。

**零 JS 输出**：Astro 默认不向浏览器发送任何 JavaScript。构建产物与手写 HTML 几乎没有区别，不会引入框架带来的性能损耗。

**内容管理**：Content Layer API（Astro 5.0+）支持从本地 Markdown、远程 API、Headless CMS 等任意数据源加载内容，并提供 TypeScript 类型安全和 Zod schema 校验。

**博客功能验证**（2026-04-02 逐项核实）：

| 功能 | 支持方式 | 对比纯 HTML |
|------|---------|------------|
| SEO | 组件化 meta tags + `@astrojs/sitemap` 官方集成 + JSON-LD 结构化数据 | 纯 HTML 需每页手动维护 |
| 响应式图片 | 内置 `<Image />` / `<Picture />` 组件，自动生成 srcset/sizes，支持 WebP/AVIF 转换 | 纯 HTML 需手动写 srcset、手动压缩转格式 |
| RSS | `@astrojs/rss` 官方包，与内容集合直接集成，构建时自动生成 | 纯 HTML 需手动维护 XML 文件 |
| 分类页 | 动态路由 `[tag].astro` + `getStaticPaths()` 自动生成，支持嵌套分页 | 纯 HTML 无法自动化，每个标签需手动建页 |
| 评论 | 通过 Giscus/Waline/Twikoo 等第三方集成，创建一次组件全站复用 | 同为第三方集成，但每页需手动嵌入 |

**长期可持续性**：2026 年 1 月 Cloudflare 收购了 Astro 团队。框架保持 MIT 开源许可，全部员工继续全职开发 Astro。框架废弃风险被消除。

### 考虑过的替代方案

**继续使用纯 HTML/CSS/JS**：UI 控制力满分，但组件复用、内容管理、RSS/sitemap/分类页自动生成全部缺失。随着页面数增长，维护成本线性增加。排除。

**Next.js**：功能强大但过度复杂。强制绑定 React，空白页面也会加载 87KB 压缩后的 JS。为内容驱动的博客引入不必要的开销和学习成本。排除。

**11ty（Eleventy）**：定位与 Astro 最接近的替代方案，灵活可定制。但文档和上手体验不如 Astro 直观，组件系统不如 Astro 成熟。对于 Figma 设计稿 → 高保真代码的工作流，Astro 的组件模型更自然。排除。

**回退到 Hugo**：最初离开的原因（模板语言限制 UI 控制）未解决。排除。

## 后果

**正面**：

- 保留了对 UI 的完全控制权
- 获得了组件复用、内容集合、图片优化、动态路由等能力
- 构建产物仍然是轻量静态 HTML
- 与 Figma MCP + Claude Code 工作流兼容
- 部署到 Cloudflare Pages 可获得最佳集成体验

**负面/权衡**：

- 引入了构建步骤（`npm run build`），不再是零构建
- 团队需要学习 Astro 的组件语法和内容集合 API
- 依赖 Node.js 生态，需要维护 package.json 和 node_modules

## 相关文档

- ADR-002: 工具链选型
- ADR-003: 迁移实现决策
- 迁移 Runbook: `docs/runbook/migration-to-astro.md`
