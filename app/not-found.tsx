import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-28 text-center">
      <p className="text-6xl font-bold tracking-tight">404</p>
      <h1 className="text-2xl font-semibold">页面不存在</h1>
      <p className="text-muted-foreground">
        你访问的页面可能已被移动或删除，回到首页继续浏览吧。
      </p>
      <Link href="/" className={buttonVariants()}>
        返回首页
      </Link>
    </div>
  );
}
