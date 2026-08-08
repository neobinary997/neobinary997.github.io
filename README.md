# Neo 的博客

基于 Next.js + Tailwind CSS + shadcn/ui 的个人博客，静态导出后部署到 GitHub Pages。

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

构建产物输出到 `out/`，`feed.xml`（RSS）和 `sitemap.xml` 会自动生成。

## 写文章

1. 在 `content/posts/` 新建 `.md` 文件，frontmatter 包含 `title`、`date`、`category`、`tags`、`description`、`status`；
2. `status: published` 的文章会出现在列表和 RSS 中；
3. 未完成的文章放在 `content/drafts/`，或把 `status` 设为 `draft`；
4. 代码块标记为 `mermaid` 会自动渲染成图；
5. 推送 `main` 分支后，GitHub Actions 自动构建并部署。
