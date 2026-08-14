#!/usr/bin/env node
/**
 * 一键发布博客草稿。
 *
 * 用法：
 *   npm run publish -- <slug>
 *
 * 流程：
 *   1. 校验草稿存在且 frontmatter 必填字段完整；
 *   2. 补全 date（为空则填今天）、status 改为 published；
 *   3. 把草稿从 content/drafts/ 移到 content/posts/；
 *   4. 本地跑一次 npm run build 验证构建；
 *   5. 构建通过后 git add + commit + push，触发 CI 自动部署到 GitHub Pages。
 *
 * 任何一步失败都会中止，不会推送。
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const DRAFTS_DIR = path.join(process.cwd(), "content", "drafts");
const POSTS_DIR = path.join(process.cwd(), "content", "posts");

const REQUIRED_FIELDS = ["title", "category", "description"];
const slug = process.argv[2]?.trim();

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

if (!slug) {
  fail('用法: npm run publish -- <slug>（草稿文件名，不含 .md）');
}

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  fail(`无效的 slug: "${slug}"。slug 只能包含小写字母、数字和连字符。`);
}

const draftPath = path.join(DRAFTS_DIR, `${slug}.md`);
if (!fs.existsSync(draftPath)) {
  fail(`草稿不存在: ${draftPath}`);
}

const targetPath = path.join(POSTS_DIR, `${slug}.md`);
if (fs.existsSync(targetPath)) {
  fail(`content/posts/ 下已有同名文章，请换一个 slug 或先处理冲突: ${targetPath}`);
}

const raw = fs.readFileSync(draftPath, "utf-8");
const { data, content } = matter(raw);

for (const field of REQUIRED_FIELDS) {
  if (!String(data[field] ?? "").trim()) {
    fail(`frontmatter 缺少必填字段 "${field}"，请先在草稿中补齐。`);
  }
}

const today = new Date().toISOString().slice(0, 10);
if (!String(data.date ?? "").trim()) {
  data.date = today;
  console.log(`· date 为空，已设为今天: ${today}`);
}
data.status = "published";

const updated = matter.stringify(content, data);
fs.writeFileSync(draftPath, updated);
fs.renameSync(draftPath, targetPath);
console.log(`✓ 已发布: ${targetPath}`);

console.log("· 本地构建验证中…");
try {
  execFileSync("npm", ["run", "build"], { stdio: "inherit", cwd: process.cwd() });
} catch {
  fs.renameSync(targetPath, draftPath);
  fail("构建失败，已把文章移回 content/drafts/，未推送。请修复后重试。");
}

const git = (args) =>
  execFileSync("git", args, { stdio: "inherit", cwd: process.cwd() });

console.log("· 提交并推送…");
git(["add", "content/drafts", "content/posts"]);
git(["commit", "-m", `feat: publish article: ${data.title}`]);
git(["push"]);

console.log(`✓ 发布完成，GitHub Actions 将自动构建部署。
  预览: https://neobinary997.github.io/posts/${slug}/`);
