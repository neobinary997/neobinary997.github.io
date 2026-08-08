import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { Mermaid } from "@/components/mermaid";

const components: Components = {
  a({ href, children, node, ...props }) {
    void node;
    const external = href?.startsWith("http") ?? false;
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer noopener" : undefined}
        {...props}
      >
        {children}
      </a>
    );
  },
  code({ className, children, node, ...props }) {
    void node;
    const match = /language-(\w+)/.exec(className ?? "");
    if (match && match[1] === "mermaid") {
      return <Mermaid code={String(children).replace(/\n$/, "")} />;
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="mdx-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeSlug]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
