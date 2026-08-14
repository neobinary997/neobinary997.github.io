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

1. 新建草稿（自动生成 frontmatter 模板）：

   ```bash
   npm run new -- "文章标题" [slug]
   ```

   中文标题需要显式传英文 slug，例如 `npm run new -- "我的文章" my-article`。
2. 在 `content/drafts/<slug>.md` 里写作，代码块标记为 `mermaid` 会自动渲染成图；
3. 本地预览：`npm run dev`（实时）或 `npm run build && npm run preview`（看静态产物）；
4. 一键发布：校验 frontmatter → 自动补 `date`、`status: published` → 移到 `content/posts/` → 本地构建验证 → 提交并推送：

   ```bash
   npm run publish -- <slug>
   ```

   构建失败会自动把文章移回 `content/drafts/`，不会推送。

## 发布流程

推送 `main` 分支后，GitHub Actions 自动构建并部署到 GitHub Pages，约 1 分钟生效。

## 写作约定

- frontmatter 必填：`title`、`category`、`description`；`date` 留空即可，发布时自动填当天；
- `status: published` 的文章才会出现在列表和 RSS 中；
- 未完成的文章放在 `content/drafts/`，或把 `status` 设为 `draft`。
