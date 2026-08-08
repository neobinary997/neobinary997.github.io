---
title: 欢迎来到新博客
date: 2026-08-08
category: 随记
tags:
  - 博客
  - Next.js
  - shadcn/ui
description: 这个博客从 VitePress 迁移到了 Next.js + shadcn/ui，本文介绍新系统的能力与写文章的方式。
status: published
---

# 欢迎来到新博客

这个博客最近做了一次彻底的重建：从 VitePress 迁移到 Next.js + Tailwind CSS + shadcn/ui。旧文章都是测试内容，这次一并清掉，从零开始。

## 新系统有什么

- **shadcn/ui 组件**：按钮、卡片、徽章、下拉菜单、抽屉菜单等组件由 shadcn/ui 提供，视觉风格统一，支持浅色、深色和跟随系统三种主题；
- **Markdown 写作**：文章就是 `content/posts/` 下的 Markdown 文件，用 frontmatter 声明标题、日期、分类、标签和摘要；
- **Mermaid 图表**：代码块标记为 `mermaid` 时自动渲染成图；
- **代码高亮**：代码块基于 highlight.js 高亮；
- **静态部署**：`next build` 输出纯静态文件，继续通过 GitHub Pages 部署。

## 怎么写一篇文章

在 `content/posts/` 下新建一个 `.md` 文件，头部加上 frontmatter：

```md
---
title: 文章标题
date: 2026-08-08
category: 教程
tags:
  - 示例
description: 一句话摘要，会显示在文章卡片上。
status: published
---

正文从这里开始。
```

然后本地预览：

```bash
npm run dev
```

构建并检查输出：

```bash
npm run build
```

## 草稿怎么处理

未完成的文章放在 `content/drafts/`，或者把 frontmatter 里的 `status` 设为 `draft`，都不会出现在文章列表和 RSS 里。

开始写吧。
