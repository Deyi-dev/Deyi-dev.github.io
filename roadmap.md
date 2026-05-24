# ROADMAP（临时）

> 本文件是一次性调研沉淀，逐条做完后并入 state.md / decisions.md，最终可删。
> 调研对象：Simon Willison（数据优先）、Ben Thompson / Stratechery（订阅优先）。

## 心智模型（贯穿全部）

- **管道 vs 水**：基建（域名/SEO/RSS/邮箱/搜索/统计）只是「管道」；真正产生流量的是「水」= 持续好内容 + 主动分发 + 外链。管道是放大器，没水也不流。
- **SEO 链条**：发布 → 发现 → 抓取 → 渲染 → 索引 → 理解 → 排名 → 展示。
  - 我们的静态架构在「抓取/渲染」天然满分（预渲染 HTML，比动态站还稳）。
  - 基建能补的是「发现/索引/理解/展示」——这只是**入场券**。
  - 「排名」靠内容相关性 + 外链权威性，**配置碰不到**。
- **拥有光谱**：静态站（我，零成本零拥有）→ 动态博客（Simon，拥有数据）→ 订阅业务（Ben Thompson，拥有读者关系）。往右每step用运维换掌控，不可跳级。
- **付费墙是唯一必须动态后端的能力**；收免费邮箱/评论/搜索/统计都能靠第三方在静态站上完成。
- **迁移便宜的前提 = 自有域名**。域名在手，将来换平台 URL/SEO/外链无损平移。

---

## P0 — 持续写 + 主动分发 + 攒外链（水 · 最重要）

- 不是技术任务，是长期习惯，但优先级最高。
- 每篇发布后主动发到 X / Hacker News / Reddit / LinkedIn / 相关社区。
- 早期真实流量来自分发，不来自 Google（Google 是数月后才发酵的慢变量）。
- 我能帮的：发布前检查 meta 是否齐备；不能代替写作与分发。

## P1 — 绑定自有域名 deyi.dev（管道 · 必须最先）

- 已购入 deyi.dev（apex 域名）。
- 仓库侧：
  - `astro.config.mjs` 的 `site` 改为 `https://deyi.dev`。
  - 新增 `public/CNAME`，内容为 `deyi.dev`。
- DNS 侧（用户在注册商操作）：apex 指向 GitHub Pages 的 A 记录（185.199.108–111.153），可选 www CNAME 到 `deyi-dev.github.io`。
- 为何最先：SEO 权重/外链/读者认知都累积到域名上；先定域名再铺 SEO。

## P2 — SEO + RSS + OG 基建（管道）

当前体检（已查仓库）缺失项：
- `/feed.xml` **指向 404**：`Header.astro:21`、`blog/[...slug].astro:57` 有 RSS 图标，但没有 feed 页面、没装 `@astrojs/rss`。🔴
- **无 `<meta name="description">`**（`BaseLayout.astro`、文章页 head 都没有）。🔴
- **无 OG / Twitter Card**：分享到 X/LinkedIn/微信无预览卡片；frontmatter 已有 `thumbnail` 却没当 `og:image`。🔴（服务「被分享」渠道，早期优先级实际高于纯 Google SEO）
- **无 sitemap.xml**（没装 `@astrojs/sitemap`）。🟠
- **无 robots.txt**。🟠
- **无 JSON-LD（Article schema）**：缺富结果 + AI 爬虫结构化理解。🟡
- **无 canonical**。🟡
- 小：`BaseLayout.astro:24` 的 Newsreader 仍走 Google Fonts CDN，与 D6「自托管」决策不符，渲染阻塞影响 LCP。

做法：
- 装 `@astrojs/rss` → 建 `src/pages/feed.xml.ts`，修好那个坏链（RSS 同时是「博客→邮件」的桥）。
- 装 `@astrojs/sitemap`（一行 integration）。
- `BaseLayout` 接收 `description` / `image` props；文章页用 frontmatter 的 `description` + `thumbnail` 填 description + OG + Twitter meta + canonical。
- 加 `public/robots.txt`（指向 sitemap）。
- 文章页加 `Article` JSON-LD。

## P3 — 收集邮箱（管道）

- **邮件列表 = 核心资产**（可主动触达的读者关系）；RSS 只是投递管道之一，不等于名单。
- 静态站收不了邮箱（无后端）→ 必须外挂 ESP，页面嵌订阅表单。
- 工具选型（目标是「博客优先 / POSSE」：deyi.dev 是唯一的家，邮件只是推送副本）：
  - **Buttondown（推荐）**：原生 RSS→邮件自动发，纯管道，不伤域名 SEO，免费起步（~100 订阅）。最契合静态架构。
  - **Substack**：能当 ESP，但无 RSS 自动转邮件（要手动重发）；它的「发现网络」要求内容住它那 → 与「保持现有架构 + 自有域名」冲突（重复内容/canonical 风险）。只在明确想要其网络流量时才考虑（那是 Pattern 2，等于换家）。
  - Substack 免费做免费 newsletter；开始收费才抽 10%。
- 关于 Substack「导出名单」：地址可导出（半拥有），但**付费扣款关系 + 送达率信誉带不走**——锁定点在这，不在邮箱本身。免付费阶段锁定风险≈0。
- 此步独立，不阻塞 P1/P2；工具定了再接。

## P4 — 搜索 + 统计（管道）

- **搜索**：用 **Pagefind**（为 SSG 设计，构建期生成索引、纯前端查询）。不要学 Simon 的 Postgres 全文检索（那是动态站方案）。
- **统计**：Plausible / GA。注意统计是**尺子不是引擎**——只测量流量、指导发力方向，不产生流量。

## P5（可选）— 锦上添花

- **评论**：Giscus（挂 GitHub Discussions，零后端）。对应 decisions.md I1。
- **多内容类型**：学 Simon 的 blogmarks（带评注的链接）/ quotes，Astro 加 content collection 即可，低成本增加发文频率与被搜入口。
- **AI-JSON（Baked Data）**：构建期额外吐 `posts.json`（机器/AI agent 可查），对应 state.md I3。SQLite+Datasette 版对当前体量属过度工程。前瞻项，最后做。

---

## 执行约定

- 逐条做，每条做完同步更新 `state.md`（当前阶段/上次停在哪/下一步）与 `decisions.md`（新增 D/I 条目，append-only）。
- 全部完成后本文件可删除。
