# STATE

## 是什么
个人博客基建 
用github.io host 
hugo -> HTML/CSS/JS -> Astro
为了拿回组件复用/SEO/RSS/sitemap/标签页/评论系统等博客基建，同时保持像素级 UI 控制

## 当前阶段
迁移主体已完成。Projects、About、Article Detail 三个页面已通过
Figma REST API 路径开发完成（MCP 额度耗尽后的备选方案，效果差点，但能接受）

## 上次停在哪
执行 roadmap.md 的增长基建路线（调研 Simon Willison / Stratechery 后沉淀）。
- 已完成 P1：绑定 deyi.dev（astro.config site + public/CNAME）。待用户在注册商配 DNS：apex A 记录 → 185.199.108-111.153。
- 已完成 P2：SEO + RSS + OG。新增 feed.xml.ts、sitemap 集成、robots.txt；BaseLayout + 文章页加 description/canonical/OG/Twitter/JSON-LD；纯逻辑在 src/utils/{seo,feed}.ts（红-绿 TDD）。
- 已补 P2 产物断言测试：tests/seo-output.test.ts（DOMParser 解析 dist/ 的 head，断言 meta/JSON-LD/feed/sitemap/robots/CNAME；beforeAll 缺 dist 时自构建）。全套 92 tests pass。

## 下一步（按 roadmap.md）
1. P3：收集邮箱（Buttondown 起步，POSSE 模式）
2. P4：搜索（Pagefind）+ 统计（Plausible）
3. P5（可选）：评论 / 多内容类型 / AI-JSON

## 关键路径（新增）
- SEO/Feed 纯逻辑：`src/utils/seo.ts`、`src/utils/feed.ts`（+ 同名 .test.ts）
- RSS 端点：`src/pages/feed.xml.ts`；robots：`public/robots.txt`

## 启动
```
npm run dev      # 本地开发服务器
npm run build    # 构建到 dist/
npm test         # vitest 单元测试
```

## 关键路径
- 内容：`src/content/blog/*.md`
- 全局样式：`src/styles/global.css`
- 布局：`src/layouts/BaseLayout.astro`
- 部署配置：`.github/workflows/deploy.yml`