import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import type { Post, PostMeta } from "@/lib/posts";

export function PostCard({ post }: { post: PostMeta | Post }) {
  return (
    <Link href={`/posts/${post.slug}/`} className="group block h-full">
      <Card className="flex h-full flex-col transition-all hover:border-primary/40 hover:shadow-sm">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary">{post.category}</Badge>
            <time className="flex items-center gap-1">
              <CalendarDays className="size-3.5" />
              {formatDate(post.date)}
            </time>
            {"readingTime" in post && (
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" />
                {post.readingTime} 分钟
              </span>
            )}
          </div>
          <CardTitle className="leading-snug group-hover:text-primary">
            {post.title}
          </CardTitle>
          {post.description && (
            <CardDescription className="line-clamp-2">
              {post.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="mt-auto flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </CardContent>
      </Card>
    </Link>
  );
}
