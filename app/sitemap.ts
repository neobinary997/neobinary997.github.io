import type { MetadataRoute } from "next";

import { getAllPosts } from "@/lib/posts";

const SITE_URL = "https://neobinary997.github.io";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  return [
    { url: SITE_URL, lastModified: new Date() },
    { url: `${SITE_URL}/posts/`, lastModified: new Date() },
    { url: `${SITE_URL}/about/`, lastModified: new Date() },
    ...posts.map((post) => ({
      url: `${SITE_URL}/posts/${post.slug}/`,
      lastModified: new Date(`${post.date}T00:00:00+08:00`),
    })),
  ];
}
