import type { TocItem } from "@/lib/posts";
import { cn } from "@/lib/utils";

export function Toc({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  return (
    <aside className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        目录
      </p>
      <nav className="mt-3 space-y-1 border-l border-border pl-3 text-sm">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={cn(
              "block py-0.5 text-muted-foreground transition-colors hover:text-foreground",
              item.depth === 3 && "pl-3"
            )}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </aside>
  );
}
