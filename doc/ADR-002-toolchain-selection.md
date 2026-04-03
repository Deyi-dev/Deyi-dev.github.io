# ADR-002: 工具链选型 — Figma → Claude Code MCP → Astro → Cloudflare Pages

- **状态**: Accepted
- **日期**: 2026-04-02
- **决策者**: Deyi

## 背景

确定 Astro 作为框架后（见 ADR-001），需要确定从设计到部署的完整工具链。工作流需要覆盖四个环节：设计、AI 辅助开发、构建框架、部署平台。

## 决策

采用以下工具链：

```
Figma（设计）→ Claude Code + Figma MCP（AI 辅助开发）→ Astro（构建）→ Cloudflare Pages（部署）
```

## 各环节选型理由

### 设计：Figma

已在使用中。博客的所有页面和组件均在 Figma 中完成设计。保持不变。

### AI 辅助开发：Claude Code + Figma MCP / REST API

**方式一：Figma MCP（首选，有额度时使用）**

通过 `claude plugin install figma@claude-plugins-official` 安装 Figma MCP 插件后，Claude Code 可以：

- 从 Figma frame 链接直接读取设计数据
- 将设计转换为 Astro 组件代码
- 默认输出 React + Tailwind，但可通过 prompt 指定输出纯 HTML/CSS 或 Astro 组件

工作方式：复制 Figma 中某个 frame 的链接，粘贴到 Claude Code 的 prompt 中，Claude 通过 MCP 读取设计数据并生成代码。

注意事项：

- Starter 计划每月仅 6 次工具调用（每次 `get_design_context` 只能传 1 个 nodeId），认真开发需要升级 Figma 的 Dev 或 Full seat（Professional 计划可获 200 次/天）
- 建议从单个组件开始，不要一次转整个页面
- 生成的代码是起点，状态管理和事件处理等逻辑需自行补充

**方式二：Figma REST API + Personal Access Token（备选，MCP 额度用完时使用）**

当 MCP 额度耗尽时，可通过 Figma REST API 直接获取设计数据，不受 MCP 额度限制：

1. 在 Figma Settings → Personal access tokens 生成 token
2. 通过 `GET /v1/files/:fileKey/nodes?ids=:nodeId` 获取节点的完整 JSON 数据（包含文本内容、字体、颜色、布局属性）
3. 通过 `GET /v1/images/:fileKey?ids=:nodeId&format=png&scale=2` 获取节点截图
4. 通过 `GET /v1/files/:fileKey/images` 获取文件中所有图片资源的下载 URL

与 MCP 的区别：REST API 返回原始 JSON 节点树，需要自行解析提取文本/样式/图片；MCP 返回经过处理的参考代码和截图。REST API 的速率限制远比 MCP 宽松。

实践验证（2026-04-01）：Projects、About、Article Detail 三个页面均通过 REST API 成功获取设计数据并完成开发，效果与 MCP 方式等同。

### 构建框架：Astro

见 ADR-001 的详细论证。

### 部署平台：Cloudflare Pages

2026 年 1 月 Cloudflare 收购了 Astro 团队。Astro 与 Cloudflare 的集成最为紧密：

- Astro 6 的开发服务器基于 Cloudflare 的 workerd 运行时重建，开发环境与生产环境行为一致
- 一行配置即可部署
- 如未来需要 SSR，Cloudflare Workers 是 Astro 的一等公民适配器

替代方案 Netlify、Vercel 也完全支持 Astro 静态部署，但 Cloudflare 作为 Astro 的母公司，长期集成深度和响应速度会占优。

## 后果

- 设计到代码的路径缩短：Figma → MCP → Astro 组件，减少手动翻译设计稿的工作
- 部署简单：`git push` 触发 Cloudflare Pages 自动构建部署
- 整条链路的核心依赖（Astro + Cloudflare）由同一家公司维护，降低了集成风险

## 相关文档

- ADR-001: 框架选型
- ADR-003: 迁移实现决策
