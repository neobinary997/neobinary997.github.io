import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";

import { MarkdownContent } from "@/components/markdown-content";
import { Toc } from "@/components/toc";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import { getAllPosts, getPost, getToc } from "@/lib/posts";
import { cn } from "@/lib/utils";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const posts = getAllPosts();
  // 静态导出要求动态路由至少生成一个页面；
  // 没有已发布文章时生成一个占位路由，页面会渲染 404。
  return posts.length > 0
    ? posts.map((post) => ({ slug: post.slug }))
    : [{ slug: "no-posts" }];
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const index = allPosts.findIndex((item) => item.slug === slug);
  const prev = index > 0 ? allPosts[index - 1] : null;
  const next =
    index >= 0 && index < allPosts.length - 1 ? allPosts[index + 1] : null;
  const toc = getToc(post.content);

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_220px]">
      <article className="mx-auto w-full max-w-3xl">
        <Link
          href="/posts/"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2 mb-6")}
        >
          <ArrowLeft data-icon="inline-start" />
          返回文章列表
        </Link>

        <header>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge>{post.category}</Badge>
            <time className="flex items-center gap-1">
              <CalendarDays className="size-4" />
              {formatDate(post.date)}
            </time>
            <span className="flex items-center gap-1">
              <Clock className="size-4" />
              阅读约 {post.readingTime} 分钟
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          {post.description && (
            <p className="mt-4 text-lg text-muted-foreground">
              {post.description}
            </p>
          )}
          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        <div className="mt-8">
          <MarkdownContent content={post.content} />
        </div>

        {(prev || next) && (
          <div className="mt-12 grid gap-4 border-t pt-8 sm:grid-cols-2">
            {prev ? (
              <Link href={`/posts/${prev.slug}/`} className="group">
                <Card className="h-full">
                  <CardHeader>
                    <CardDescription>上一篇</CardDescription>
                    <CardTitle className="leading-snug group-hover:text-primary">
                      {prev.title}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link href={`/posts/${next.slug}/`} className="group text-right">
                <Card className="h-full">
                  <CardHeader>
                    <CardDescription>下一篇</CardDescription>
                    <CardTitle className="leading-snug group-hover:text-primary">
                      {next.title}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ) : (
              <div />
            )}
          </div>
        )}
      </article>

      <aside className="hidden lg:block">
        <Toc items={toc} />
      </aside>
    </div>
  );
}
