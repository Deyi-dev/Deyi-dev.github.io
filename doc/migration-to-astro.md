# 迁移 Runbook: 纯 HTML/CSS/JS → Astro

- **关联 ADR**: ADR-001, ADR-002, ADR-003
- **目标站点**: deyi-dev.github.io
- **预计耗时**: 2-4 小时

## 前置条件

- Node.js 18+ 已安装
- 现有站点仓库已克隆到本地
- Figma 设计稿已就绪（Projects、About 页面）

## 项目目标结构

```
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── public/images/              ← 从 assets/images/ 移入
├── src/
│   ├── layouts/BaseLayout.astro
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── ArticleCard.astro
│   │   └── Typewriter.astro
│   ├── content/
│   │   ├── config.ts           ← collection schema
│   │   └── blog/*.md           ← 博客文章（Markdown）
│   ├── pages/
│   │   ├── index.astro         ← 博客列表首页
│   │   ├── blog/[...slug].astro ← 文章详情页（动态路由）
│   │   ├── projects.astro      ← 项目页（初始为 stub）
│   │   └── about.astro         ← 关于页（初始为 stub）
│   └── styles/global.css       ← 从 css/style.css 原样复制
└── .github/workflows/deploy.yml ← 更新为 Astro 构建流程
```

## 执行步骤

### 第 1 步：初始化 Astro 项目

创建 `package.json`、`astro.config.mjs`、`tsconfig.json`，运行 `npm install`。

验证点：`npm run dev` 能启动开发服务器。

### 第 2 步：迁移静态资源

将 `assets/images/*` 移至 `public/images/*`。

> 决策依据见 ADR-003 §1：当前图片总计约 33KB，不需要构建时优化。

### 第 3 步：迁移 CSS

将 `css/style.css` 原样复制为 `src/styles/global.css`。

> 决策依据见 ADR-003 §2：266 行内聚设计系统，不拆分。

### 第 4 步：拆分组件

从现有 `index.html` 中提取：

1. `BaseLayout.astro` — 包含 `<html>`、`<head>`、`<body>` 结构，引入 global.css
2. `Header.astro` — 导航栏
3. `Footer.astro` — 页脚
4. `Typewriter.astro` — 打字机效果，使用 `<script is:inline>`
5. `ArticleCard.astro` — 文章卡片，接受 props（标题、日期、摘要、链接）

> 决策依据见 ADR-003 §4：打字机脚本使用 `is:inline` 保持 DOM 行为。

验证点：组装后的页面在浏览器中与原站视觉一致。

### 第 5 步：建立内容集合

1. 创建 `src/content/config.ts`，定义 blog collection 的 Zod schema（title、date、description、tags）
2. 将现有 6 篇硬编码文章转为 `src/content/blog/*.md`，每篇包含 frontmatter

> 决策依据见 ADR-003 §5。

验证点：`astro dev` 启动时无 schema 校验错误。

### 第 6 步：构建页面

1. `index.astro` — 从 blog collection 读取文章列表，按日期倒序排列，渲染 ArticleCard
2. `blog/[...slug].astro` — 动态路由，使用 `getStaticPaths()` + `getCollection('blog')` 生成每篇文章的详情页
3. `projects.astro` — stub 页面（后续从 Figma 设计稿生成）
4. `about.astro` — stub 页面（后续从 Figma 设计稿生成）

验证点：首页能看到文章列表，点击能进入文章详情页，Markdown 正确渲染。

### 第 7 步：清理旧文件

删除：`index.html`、`css/` 目录、`js/` 目录。

### 第 8 步：更新部署配置

重写 `.github/workflows/deploy.yml`：

- 添加 Node.js setup 步骤
- `npm ci`
- `npm run build`
- 上传 `dist/` 目录到 GitHub Pages

### 第 9 步：更新 .gitignore

添加：

```
node_modules/
dist/
.astro/
```

### 第 10 步：测试与发布

1. `npm run dev` — 本地确认博客列表页与原站视觉一致
2. 点击进入一篇博文 — 确认 Markdown 渲染正常
3. `npm run build` — 检查 `dist/` 输出
4. `git push` — 触发 GitHub Actions，验证 https://deyi-dev.github.io 部署成功

## 迁移后待办

- [ ] 从 Figma 设计稿生成 Projects 页面（通过 Claude Code + Figma MCP）
- [ ] 从 Figma 设计稿生成 About 页面
- [ ] 添加 `@astrojs/sitemap` 集成
- [ ] 添加 `@astrojs/rss` 集成
- [ ] 实现标签分类页（`src/pages/tags/[tag].astro`）
- [ ] 集成评论系统（Giscus）
- [ ] 评估是否迁移到 Cloudflare Pages 部署（见 ADR-002）
