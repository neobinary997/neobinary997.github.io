#!/usr/bin/env node
/**
 * 新建博客草稿脚手架。
 *
 * 用法：
 *   npm run new -- "文章标题" [slug]
 *
 * slug 可选：标题为英文时自动生成；中文标题建议显式传英文 slug，
 * 否则会提示你补充。草稿写入 content/drafts/，status 为 draft。
 */
import fs from "node:fs";
import path from "node:path";

const DRAFTS_DIR = path.join(process.cwd(), "content", "drafts");

const [, , titleArg, slugArg] = process.argv;

if (!titleArg) {
  console.error("用法: npm run new -- \"文章标题\" [slug]");
  process.exit(1);
}

const title = titleArg.trim();

function slugify(input) {
  const slug = input
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug;
}

function isValidSlug(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

let slug = slugArg?.trim() ?? slugify(title);

if (!isValidSlug(slug)) {
  console.error(`无效的 slug: "${slug}"`);
  console.error("slug 只能包含小写字母、数字和连字符，且不能以连字符开头/结尾。");
  console.error("中文标题无法自动转 slug，请显式传入英文 slug，例如：");
  console.error("  npm run new -- \"我的文章\" my-article");
  process.exit(1);
}

fs.mkdirSync(DRAFTS_DIR, { recursive: true });

const filePath = path.join(DRAFTS_DIR, `${slug}.md`);
if (fs.existsSync(filePath)) {
  console.error(`草稿已存在: ${filePath}`);
  process.exit(1);
}

const template = `---
title: "${title.replaceAll('"', '\\"')}"
date: ""
category: "未分类"
tags: []
description: ""
status: "draft"
---

# ${title}

在这里开始写作。支持 Markdown，代码块标记为 \`mermaid\` 会自动渲染成图。

写完后用 \`npm run publish -- ${slug}\` 发布。
`;

fs.writeFileSync(filePath, template);
console.log(`已创建草稿: ${filePath}`);
