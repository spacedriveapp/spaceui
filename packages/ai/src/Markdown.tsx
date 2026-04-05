import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { clsx } from 'clsx';
import { forwardRef } from 'react';

interface MarkdownProps {
  content: string;
  className?: string;
}

const Markdown = forwardRef<HTMLDivElement, MarkdownProps>(
  ({ content, className }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx('markdown text-sm text-ink', className)}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }
);

Markdown.displayName = 'Markdown';

export { Markdown };
