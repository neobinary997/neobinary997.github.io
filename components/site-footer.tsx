export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <p>© {new Date().getFullYear()} Neo 的博客 · Next.js + shadcn/ui</p>
        <div className="flex items-center gap-4">
          <a href="/feed.xml" className="transition-colors hover:text-foreground">
            RSS
          </a>
          <a
            href="https://github.com/neobinary997"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
