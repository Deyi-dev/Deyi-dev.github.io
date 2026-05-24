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
[占位 — 这里写你真实的停顿点。示例格式：]
- 文件：`src/pages/tags/[tag].astro`
- 问题：`getStaticPaths()` 如何从 blog collection 聚合 tags
- 思路：参考 Astro 官方 blog 模板的 tag 实现，预计 1 小时

## 下一步
[占位 — 这里写你真实的下一步。示例格式：]
1. 完成 [tag].astro 标签分类页
2. 集成 Giscus 评论
3. 添加 @astrojs/sitemap 和 @astrojs/rss

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