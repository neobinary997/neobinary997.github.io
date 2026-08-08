import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const SITE_URL = "https://neobinary997.github.io";
const SITE_TITLE = "Neo 的博客";
const SITE_DESCRIPTION = "技术、工程与思考的记录";
const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function normalizeDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return String(value || "").slice(0, 10);
}

const posts = (fs.existsSync(POSTS_DIR) ? fs.readdirSync(POSTS_DIR) : [])
  .filter((file) => file.endsWith(".md"))
  .map((file) => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
    const { data } = matter(raw);
    return {
      slug: file.replace(/\.md$/, ""),
      title: data.title || "",
      date: normalizeDate(data.date),
      description: data.description || "",
      status: data.status || "draft",
    };
  })
  .filter((post) => post.status === "published" && post.date)
  .sort((a, b) => (a.date < b.date ? 1 : -1));

const items = posts
  .map(
    (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/posts/${post.slug}/</link>
      <guid isPermaLink="true">${SITE_URL}/posts/${post.slug}/</guid>
      <pubDate>${new Date(`${post.date}T00:00:00+08:00`).toUTCString()}</pubDate>
      <description>${escapeXml(post.description)}</description>
    </item>`
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>zh-CN</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

fs.mkdirSync(path.join(process.cwd(), "public"), { recursive: true });
fs.writeFileSync(path.join(process.cwd(), "public", "feed.xml"), xml);
console.log(`Generated feed.xml with ${posts.length} posts.`);
