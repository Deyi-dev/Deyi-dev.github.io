# ADR-003: 迁移实现决策 — 纯 HTML 到 Astro 的具体技术选择

- **状态**: Accepted
- **日期**: 2026-04-02
- **决策者**: Deyi

## 背景

在将博客从纯 HTML/CSS/JS 迁移到 Astro 的过程中（见 ADR-001），需要对若干实现细节做出决策。这些决策虽然粒度较小，但会影响项目结构、构建效率和长期可维护性。

本 ADR 记录的是"怎么迁移"中的关键技术选择，而非"为什么选 Astro"（见 ADR-001）。

## 决策与理由

### 1. 图片放 `public/images/` 而非 `src/assets/`

**决策**：将现有图片资源移至 `public/images/`，不使用 Astro 的 `src/assets/` 图片优化管线。

**理由**：当前博客的全部图片资源总计约 33KB。对这个体量的资源运行 Sharp 图片优化处理（格式转换、多尺寸生成）带来的收益可忽略不计，反而会增加构建时间和构建依赖。`public/` 目录下的文件直接复制到构建输出，零处理开销。

**何时需要重新审视**：当图片资源总量超过 500KB，或需要为大量图片生成响应式 srcset 时，应迁移到 `src/assets/` 并启用 `<Image />` 组件的自动优化。

### 2. 保持单一 `global.css` 文件 + 页面级 CSS

**决策**：将现有 `css/style.css` 迁移为 `src/styles/global.css`，不引入 CSS Modules 或 Tailwind。文章详情页因使用独立布局（不经过 BaseLayout），新增了 `src/styles/article.css`。

**理由**：全局 CSS 是一个内聚的设计系统，覆盖了全站的排版、颜色、布局。拆分成组件级 CSS 不会带来可维护性提升，反而增加了认知负担。当前阶段不引入 Tailwind 等工具类框架，避免增加构建配置和学习成本。页面级 scoped `<style>` 用于 Projects、About 等页面的特定样式。

**字体选型（2026-04-02 更新）**：

从最初的 4 种 Google Fonts（Playfair Display / Inter / JetBrains Mono / Newsreader）精简为 3 种字体、2 个来源：

| 用途 | 字体 | 来源 |
|------|------|------|
| Logo / 文章标题 | Newsreader（衬线） | Google Fonts |
| 正文 / 导航 / UI | Geist Sans Variable（无衬线） | npm 自托管（`@fontsource-variable/geist`） |
| Typewriter / 代码块 | Geist Mono Variable（等宽） | npm 自托管（`@fontsource-variable/geist-mono`） |

选择理由：Geist 是 Vercel 出品的字体家族，专为屏幕设计，开发者社区广泛采用。Sans + Mono 同家族天然协调。Newsreader 为标题提供衬线的编辑质感，与 Geist 的无衬线形成层次对比。自托管消除了对 Google Fonts CDN 的外部请求依赖（Newsreader 除外）。

**何时需要重新审视**：当 CSS 超过 500 行，或多个组件的样式开始相互冲突时，考虑引入 Astro 的 scoped styles（`<style>` 标签）或 Tailwind。

### 3. 不引入 UI 框架（React/Vue/Svelte）

**决策**：整个项目不引入任何 UI 框架，仅使用 Astro 原生组件和原生 JavaScript。

**理由**：博客唯一的客户端交互是打字机效果（typewriter），用原生 JS 实现，约 20 行代码。为此引入 React（最小 40KB+ gzipped）不合理。Astro 的 `is:inline` 指令可以在组件内嵌入原生 JS 脚本，完美满足需求。

**何时需要重新审视**：当需要复杂的客户端交互（表单验证、实时搜索、动态筛选）时，可以按需为单个组件引入 React/Preact/Svelte（Astro 的 Islands 架构支持按组件级别引入框架）。

### 4. 打字机脚本使用 `is:inline` 指令

**决策**：将 `js/main.js` 中的打字机效果代码移入 `Typewriter.astro` 组件，使用 `<script is:inline>` 标签。

**理由**：打字机脚本依赖 DOM 的 `querySelector` 行为，需要在 DOM 就绪后直接执行。Astro 默认会对 `<script>` 标签进行 bundle 和 defer 处理，可能改变执行时机。`is:inline` 指令告诉 Astro 保持脚本原样输出，不做任何处理，确保 DOM 依赖的行为不被破坏。

### 5. 使用 Content Collections 管理博客文章

**决策**：使用 Astro 的 Content Collections（`src/content/blog/*.md`）管理博客文章，定义 Zod schema 校验 frontmatter。

**理由**：Content Collections 提供了 typed frontmatter（TypeScript 类型安全）、自动 slug 生成、内置日期排序等能力。这使得 RSS feed 生成（`@astrojs/rss`）、标签页动态路由（`[tag].astro`）等功能可以直接基于 collection 数据实现，无需额外的数据处理逻辑。

### 6. 最小依赖原则

**决策**：`package.json` 生产依赖保持最小化。当前依赖为：`astro`、`@fontsource-variable/geist`、`@fontsource-variable/geist-mono`。

**理由**：最小化依赖树降低了供应链攻击风险、减少了 `npm install` 时间、减少了版本冲突可能。fontsource 包的引入是为了自托管 Geist 字体（见 §2 字体选型），消除对外部 CDN 的运行时依赖。当需要具体功能时（如 RSS、sitemap），再按需添加官方集成包（`@astrojs/rss`、`@astrojs/sitemap`）。

## 后果

- 迁移过程最大程度保持了现有代码的原貌（CSS 原样迁移、JS 逻辑原样迁移）
- 构建速度快（无图片处理、无 CSS 预处理、无 JS 框架编译）
- 后续扩展路径清晰：每个决策都注明了重新审视的触发条件

## 相关文档

- ADR-001: 框架选型
- ADR-002: 工具链选型
- 迁移 Runbook: `docs/runbook/migration-to-astro.md`
