import type { Metadata } from "next";

import { PostCard } from "@/components/post-card";
import { getAllPosts, getPost } from "@/lib/posts";

export const metadata: Metadata = {
  title: "文章",
  description: "Neo 的博客全部文章列表",
};

export default function PostsPage() {
  const posts = getAllPosts()
    .map((post) => getPost(post.slug))
    .filter((post) => post !== null);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">全部文章</h1>
        <p className="mt-2 text-muted-foreground">
          共 {posts.length} 篇，按发布时间排序
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
