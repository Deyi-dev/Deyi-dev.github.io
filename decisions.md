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

[2026-05-24-D12] 绑定自有域名 deyi.dev，替代 deyi-dev.github.io
原因：SEO 权重/外链/读者认知累积到自有域名上；将来换平台可无损平移 URL，避免被 github.io 锁定。这是「先静态攒用户、要付费再迁移」整条渐进路线成立的前提。
实现：astro.config.mjs site 改为 https://deyi.dev；新增 public/CNAME=deyi.dev。DNS 侧需在注册商配 apex A 记录指向 GitHub Pages（185.199.108-111.153）。

[2026-05-24-D13] 补齐 SEO + RSS + OG 基建
原因：体检发现可发现性基建几乎全缺——/feed.xml 指向 404、无 description/canonical/OG/sitemap/robots/JSON-LD。这些是「被搜到/被分享」的入场券，且全是构建期产物，契合静态架构与最小依赖原则。
实现：
- @astrojs/rss → src/pages/feed.xml.ts（修好原 RSS 图标的坏链；同时是「博客→邮件」桥）。
- @astrojs/sitemap → 自动生成 sitemap-index.xml；public/robots.txt 指向它。
- BaseLayout + 文章页加 description / canonical / OG / Twitter Card meta，OG 图复用 frontmatter 的 thumbnail（首页缺省用 /images/robot.png）。
- 文章页加 schema.org BlogPosting JSON-LD。
遵循 D11：可测纯逻辑抽到 src/utils/seo.ts、src/utils/feed.ts（absoluteUrl / buildArticleJsonLd / postsToFeedItems），红-绿 TDD，组件/端点保持薄壳。

[2026-05-24-D14] OG 分享卡片与 Google SEO 区别对待
原因：OG/Twitter Card 服务「被分享」渠道（X/LinkedIn/微信预览），早期真实流量主要来自分享而非 Google，故其实际优先级高于纯 Google SEO。技术上与 SEO meta 一起做，但目的不同。

[2026-05-24-D15] SEO/OG/feed「接线」用产物断言测试，不用浏览器
原因：meta/JSON-LD/RSS/sitemap 是静态文本产物，无运行时交互，浏览器点击帮不上忙。在 jsdom 环境用 DOMParser 解析 dist/ 的 <head> 即可断言（tests/seo-output.test.ts，beforeAll 缺 dist 时自构建）。扩展 D11：纯逻辑走 src/utils/ 单测，组件接线走构建产物断言。
范围：真正需要浏览器的是交互件（暗色切换/打字机/copy-link 的点击链路与视觉），留待本地 Playwright 或带浏览器的环境，本云会话无 Chrome MCP。

[2026-05-24-D16] P3 选 Buttondown 作为 ESP（POSSE 管道，不当家）
原因：广撒网评估 5 类共十余款（MailerLite/Buttondown/EmailOctopus/Kit/Sender；Resend/Loops；Listmonk/Keila/Sendy；Substack/Beehiiv/Ghost）后，按「现阶段最看重：极简 / Markdown / 开发者审美」收敛到 Buttondown。
- 契合点：Markdown-first、原生 RSS→邮件（直接喂 P2 的 /feed.xml）、嵌入式表单零后端、导出友好、API 完备。
- 代价：免费仅 ≤100 订阅（接受，触顶再评估）；增长网络弱（用 P0 分发补）。
- 排除：MailerLite/Kit 全能但与「极简/Markdown」气质不符；Substack/Beehiiv 是「平台即家」与 deyi.dev SEO 策略冲突；Listmonk/Ghost 自托管违背零运维静态站初衷；Resend 需 serverless 端点收表单，破坏纯静态。
- 关键洞见（来自本轮调研）：名单可导出 ≠ 拥有受众；真正不可携带的是「增长机制」。Buttondown 几乎无平台增长引擎依赖，这反而让「迁出零代价」成立。

[2026-06-05-D17] 导航暂时收敛为 Blog + Doodle，隐藏 Projects/About
原因：Projects/About 当前内容仍是占位/样例（projects.astro 三条假项目），过早曝光不如先藏起来；等真有内容再放出。Doodle 作为新入口占位（页面留空），先把位置占住、形成习惯。
实现：Header.astro 用 {/* */} 注释掉 Projects/About 两个 <a>，仅从导航移除——页面文件（projects.astro/about.astro）保留，/projects、/about 直链仍可访问、仍照常构建（build.test.ts 不动）。恢复时删掉注释标记即可。新增 src/pages/doodle.astro（空 main）。
同时去掉 Header 的 "engineer, painter, snowboarder" 副标题。

[2026-06-05-D18] 打字机 "in AI" 取中段年份色，绑定变量而非硬编码
原因：首页打字机后缀 "in AI" 原为正文色，缺层次；取博客标题三色梯度（2026/2025/2024）的中间色作呼应。
实现：Typewriter.astro 渲染时把 plain 后缀包进 <span class="suffix">；global.css 加 .typewriter .suffix { color: var(--color-year-2025) }——绑变量，将来调色自动同步，明暗两套主题各自取值。

---


[2026-04-02-I3] 验证 RSS 和 SEO, maybe seo  for ai agent


