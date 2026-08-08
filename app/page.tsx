import Link from "next/link";
import { ArrowRight, BookOpen, FolderOpen, Tags } from "lucide-react";

import { PostCard } from "@/components/post-card";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllPosts, getPost } from "@/lib/posts";

export default function HomePage() {
  const allPosts = getAllPosts();
  const latest = allPosts
    .slice(0, 3)
    .map((post) => getPost(post.slug))
    .filter((post) => post !== null);
  const categories = new Set(allPosts.map((post) => post.category)).size;
  const tags = new Set(allPosts.flatMap((post) => post.tags)).size;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <section className="flex flex-col items-start gap-6 py-16 sm:py-24">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            记录技术、工程与思考
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            这是 Neo 的个人博客，用来沉淀工程实践、踩坑记录与产品思考。文章不多，但每一篇都认真写。
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/posts/" className={buttonVariants({ size: "lg" })}>
            阅读文章
            <ArrowRight data-icon="inline-end" />
          </Link>
          <Link
            href="/about/"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            关于我
          </Link>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <BookOpen className="size-4" />
            {allPosts.length} 篇文章
          </span>
          <span className="flex items-center gap-2">
            <FolderOpen className="size-4" />
            {categories} 个分类
          </span>
          <span className="flex items-center gap-2">
            <Tags className="size-4" />
            {tags} 个标签
          </span>
        </div>
      </section>

      <section className="pb-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight">最新文章</h2>
          <Link
            href="/posts/"
            className="text-sm font-medium text-primary hover:underline"
          >
            查看全部
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="pb-20">
        <Card>
          <CardHeader>
            <CardTitle>关于 Neo</CardTitle>
            <CardDescription>
              一名关注端到端交付的工程师，从需求到上线全程负责，最近在探索 AI
              Agent 的工程化实践。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/about/" className={buttonVariants({ variant: "ghost" })}>
              了解更多
              <ArrowRight data-icon="inline-end" />
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
