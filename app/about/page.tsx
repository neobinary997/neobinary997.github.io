import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "关于",
  description: "关于 Neo 与这个博客",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">关于 Neo</h1>
      <p className="mt-4 text-lg leading-8 text-muted-foreground">
        我是 Neo，一名关注端到端交付的工程师。比起「代码怎么写」，我更在意如何把一个业务目标变成可维护、可验证、能上线并持续运营的系统。
      </p>
      <div className="mt-8 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>写什么</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
              <li>工程实践：把一次踩坑、一个方案、一次重构讲清楚</li>
              <li>架构取舍：说明为什么这样设计，以及它的边界</li>
              <li>产品与技术：记录从需求到上线的完整链路</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>找到我</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Link
                href="https://github.com/neobinary997"
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({ variant: "outline" })}
              >
                GitHub
              </Link>
              <a href="/feed.xml" className={buttonVariants({ variant: "ghost" })}>
                RSS 订阅
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
