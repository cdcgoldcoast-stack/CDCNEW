import Link from "next/link";
import type { AnchorHTMLAttributes, HTMLAttributes } from "react";
import { evaluate } from "@mdx-js/mdx";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import * as runtime from "react/jsx-runtime";

type MDXContentProps = {
  source: string;
};

const headingTwo = (props: HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className="mt-12 text-3xl text-primary" {...props} />
);

const headingThree = (props: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className="mt-8 text-2xl text-primary" {...props} />
);

const paragraph = (props: HTMLAttributes<HTMLParagraphElement>) => (
  <p className="text-foreground/80" {...props} />
);

const list = (props: HTMLAttributes<HTMLUListElement>) => (
  <ul className="ml-6 list-disc space-y-2 text-foreground/80" {...props} />
);

const orderedList = (props: HTMLAttributes<HTMLOListElement>) => (
  <ol className="ml-6 list-decimal space-y-2 text-foreground/80" {...props} />
);

const link = ({ href = "", ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
  if (href.startsWith("/")) {
    return <Link href={href} className="text-primary underline underline-offset-2" {...props} />;
  }

  return (
    <a
      href={href}
      className="text-primary underline underline-offset-2"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  );
};

const inlineCode = (props: HTMLAttributes<HTMLElement>) => (
  <code className="rounded bg-foreground/10 px-1.5 py-0.5 text-sm" {...props} />
);

const preformatted = (props: HTMLAttributes<HTMLPreElement>) => (
  <pre className="overflow-x-auto rounded bg-foreground/95 p-4 text-sm text-background" {...props} />
);

export default async function MDXContent({ source }: MDXContentProps) {
  const evaluated = await evaluate(source, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { properties: { className: ["blog-heading-anchor"] } }],
    ],
  });
  const Component = evaluated.default;

  return (
    <div className="space-y-6 leading-relaxed">
      <Component
        components={{
          h2: headingTwo,
          h3: headingThree,
          p: paragraph,
          ul: list,
          ol: orderedList,
          a: link,
          code: inlineCode,
          pre: preformatted,
        }}
      />
    </div>
  );
}
