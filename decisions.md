# DECISIONS

Append-only。重审旧决策时新增条目，旧条目只允许追加"状态"行。
`D` = 决策，`I` = 待验证想法。

---

[2026-04-02-D1] 采用 Astro 替代纯 HTML/CSS/JS
原因：纯 HTML 缺组件复用、RSS、sitemap、分类页自动化；Astro 是 HTML 超集，零 JS 输出，UI 控制力等同。
排除：Next.js（强绑 React + 87KB 基线 JS）、11ty（组件模型不如 Astro 成熟）、回退 Hugo（模板限制 UI 未解决）。

[2026-04-02-D2] 工具链 Google Stitch -> Figma → Claude Code MCP → Astro 
原因：AI 驱动下的前端工作流新范式

[2026-04-02-D3] Figma 集成走 MCP，REST API 作为备选
原因：MCP 输出处理过的代码和截图，REST API 返回原始 JSON 需自行解析。
重审：MCP Starter 计划 6 次/月额度耗尽时切换到 REST API（需 Personal Access Token）。

[2026-04-02-D4] 图片放 public/images/ 不走 src/assets/
原因：总量 33KB，Sharp 图片优化收益为零，反而增加构建依赖。
重审：图片总量 > 500KB 或需要响应式 srcset 时迁回 src/assets/ 启用 <Image />。

[2026-04-02-D5] 单一 global.css 不引入 CSS Modules / Tailwind
原因：266 行内聚设计系统，拆分增加认知负担无收益。
重审：CSS > 500 行 或 组件样式开始相互冲突时引入 scoped styles 或 Tailwind。

[2026-04-02-D6] 字体精简为 Newsreader + Geist Sans + Geist Mono
原因：Geist 同家族 Sans+Mono 天然协调；Newsreader 提供标题衬线层次；Geist 自托管去掉 CDN 依赖。
排除：原方案 4 种 Google Fonts（Playfair Display / Inter / JetBrains Mono / Newsreader）依赖外部 CDN 且层次不清, 不好看。

[2026-04-02-D7] 不引入任何 UI 框架（React/Vue/Svelte）
原因：唯一客户端交互是 20 行打字机；React 最小 40KB+ gzipped 不划算。
重审：需要复杂客户端交互（表单校验/实时搜索/动态筛选）时按 Astro Islands 单组件引入。

[2026-04-02-D8] 打字机脚本使用 <script is:inline>
原因：脚本依赖 DOM 就绪后直接执行；Astro 默认会 bundle + defer 改变执行时机，is:inline 保持原样输出。

[2026-04-02-D9] 博客文章用 Content Collections + Zod schema
原因：提供 typed frontmatter、自动 slug、内置日期排序；RSS / 标签页可直接基于 collection 数据实现。

[2026-04-02-D10] 最小依赖原则
原因：降低供应链风险、缩短 npm install、减少版本冲突。
当前依赖：astro、@fontsource-variable/geist、@fontsource-variable/geist-mono；devDeps：vitest、jsdom。

[2026-04-02-D11] 测试用 vitest + jsdom，纯逻辑提取到 src/utils/
原因：Astro 官方推荐 vitest；jsdom 模拟 localStorage / matchMedia / DOM；测试文件与源文件同目录。
模式：组件 JS 超出简单 DOM 操作时（如主题切换），逻辑提取为 src/utils/ 纯 TS 函数，组件保持薄壳。
重审：需要测试 Astro 组件渲染输出时引入 @astrojs/test-utils 或 Playwright。

---


[2026-04-02-I1] 集成 Giscus 评论系统
价值：博客互动基础设施；基于 GitHub Discussions 无需额外后端。
验证：在 BaseLayout 加一个组件试一篇文章，观察加载性能和 UX。

[2026-04-02-I2] 实现标签分类页 src/pages/tags/[tag].astro
价值：博客基础导航能力，D9 的 Content Collections 已为此铺路。
验证：参考 Astro 官方 blog 模板的 tag 实现，预计 1 小时完成。

[2026-04-02-I3] 验证 RSS 和 SEO, maybe seo  for ai agent