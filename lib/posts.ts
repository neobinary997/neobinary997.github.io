import fs from "node:fs";
import path from "node:path";

import GithubSlugger from "github-slugger";
import matter from "gray-matter";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  description: string;
  status: string;
  source?: string;
  sourceTitle?: string;
}

export interface Post extends PostMeta {
  content: string;
  readingTime: number;
}

export interface TocItem {
  depth: number;
  text: string;
  id: string;
}

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function readPostFile(slug: string) {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { data, content };
}

function normalizeDate(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return String(value ?? "").slice(0, 10);
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file): PostMeta | null => {
      const slug = file.replace(/\.md$/, "");
      const parsed = readPostFile(slug);
      if (!parsed) return null;
      const { data } = parsed;
      return {
        slug,
        title: (data.title as string) || slug,
        date: normalizeDate(data.date),
        category: (data.category as string) || "未分类",
        tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
        description: (data.description as string) || "",
        status: (data.status as string) || "draft",
        ...((data.source as string | undefined)
          ? { source: data.source as string }
          : {}),
        ...((data.sourceTitle as string | undefined)
          ? { sourceTitle: data.sourceTitle as string }
          : {}),
      };
    })
    .filter((post): post is PostMeta => post !== null && post.status === "published" && !!post.date)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | null {
  const parsed = readPostFile(slug);
  if (!parsed) return null;
  const meta = getAllPosts().find((post) => post.slug === slug);
  if (!meta) return null;
  return {
    ...meta,
    content: parsed.content,
    readingTime: estimateReadingTime(parsed.content),
  };
}

export function getToc(content: string): TocItem[] {
  const slugger = new GithubSlugger();
  const tree = unified().use(remarkParse).parse(content);
  const items: TocItem[] = [];

  visit(tree, "heading", (node) => {
    const heading = node as {
      depth: number;
      children?: Array<{ type: string; value?: string }>;
    };
    if (heading.depth < 2 || heading.depth > 3) return;
    const text = (heading.children ?? [])
      .filter((child) => child.type === "text" || child.type === "inlineCode")
      .map((child) => child.value ?? "")
      .join("");
    if (!text.trim()) return;
    items.push({ depth: heading.depth, text, id: slugger.slug(text) });
  });

  return items;
}

function estimateReadingTime(content: string): number {
  const cjkChars = (content.match(/[\u4e00-\u9fff]/g) ?? []).length;
  const latinWords = (content.match(/[A-Za-z0-9]+/g) ?? []).length;
  return Math.max(1, Math.ceil(cjkChars / 350 + latinWords / 200));
}
