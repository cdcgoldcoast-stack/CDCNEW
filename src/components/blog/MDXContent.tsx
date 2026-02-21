import Link from "next/link";
import type { AnchorHTMLAttributes, HTMLAttributes } from "react";
import { evaluate } from "@mdx-js/mdx";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import * as runtime from "react/jsx-runtime";
import { 
  CheckCircle, 
  AlertCircle, 
  Lightbulb, 
  Info,
  Clock,
  AlertTriangle,
  CheckSquare
} from "lucide-react";

type MDXContentProps = {
  source: string;
};

const headingTwo = (props: HTMLAttributes<HTMLHeadingElement>) => (
  <h2 
    className="group mt-16 mb-6 text-2xl font-bold text-foreground tracking-tight scroll-mt-28 border-b-2 border-border/60 pb-4 first:mt-0" 
    {...props} 
  />
);

const headingThree = (props: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 
    className="mt-10 mb-4 text-xl font-bold text-foreground/90 scroll-mt-28 flex items-center gap-3" 
    {...props} 
  >
    <span className="h-6 w-1 rounded-full bg-primary/60" />
    <span>{props.children}</span>
  </h3>
);

const paragraph = (props: HTMLAttributes<HTMLParagraphElement>) => (
  <p className="mb-5 text-muted-foreground leading-[1.8] text-base" {...props} />
);

const list = (props: HTMLAttributes<HTMLUListElement>) => (
  <ul className="ml-6 mb-6 space-y-3 text-muted-foreground" {...props} />
);

const orderedList = (props: HTMLAttributes<HTMLOListElement>) => (
  <ol className="ml-6 mb-6 space-y-3 text-muted-foreground" {...props} />
);

const listItem = (props: HTMLAttributes<HTMLLIElement>) => (
  <li className="pl-2 leading-relaxed marker:text-primary marker:font-semibold" {...props} />
);

const link = ({ href = "", ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
  if (href.startsWith("/")) {
    return (
      <Link 
        href={href} 
        className="font-semibold text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all" 
        {...props} 
      />
    );
  }

  return (
    <a
      href={href}
      className="font-semibold text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  );
};

const inlineCode = (props: HTMLAttributes<HTMLElement>) => (
  <code className="rounded-md bg-muted px-2 py-1 text-sm font-mono text-foreground border border-border/60" {...props} />
);

const preformatted = (props: HTMLAttributes<HTMLPreElement>) => (
  <pre className="overflow-x-auto rounded-xl bg-slate-950 p-6 text-sm text-slate-50 mb-6 shadow-xl" {...props} />
);

const blockquote = (props: HTMLAttributes<HTMLQuoteElement>) => (
  <blockquote 
    className="mb-6 border-l-4 border-primary pl-6 py-2 italic text-muted-foreground bg-muted/30 pr-4 rounded-r-lg" 
    {...props} 
  />
);

const strong = (props: HTMLAttributes<HTMLElement>) => (
  <strong className="font-bold text-foreground" {...props} />
);

const horizontalRule = () => (
  <hr className="my-12 border-border/60" />
);

// Custom Table Styling
const table = (props: HTMLAttributes<HTMLTableElement>) => (
  <div className="overflow-x-auto mb-6 rounded-xl border border-border/60">
    <table className="w-full text-sm" {...props} />
  </div>
);

const tableHead = (props: HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className="bg-muted/70" {...props} />
);

const tableRow = (props: HTMLAttributes<HTMLTableRowElement>) => (
  <tr className="border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors" {...props} />
);

const tableHeader = (props: HTMLAttributes<HTMLTableCellElement>) => (
  <th className="px-4 py-3 text-left font-bold text-foreground" {...props} />
);

const tableCell = (props: HTMLAttributes<HTMLTableCellElement>) => (
  <td className="px-4 py-3 text-muted-foreground" {...props} />
);

// Custom Callout Component
const Callout = ({ 
  type = "info", 
  title, 
  children 
}: { 
  type?: "info" | "tip" | "warning" | "success"; 
  title?: string; 
  children: React.ReactNode;
}) => {
  const styles = {
    info: {
      wrapper: "bg-blue-50/70 border-blue-200/60",
      iconBg: "bg-blue-100",
      icon: "text-blue-600",
      title: "text-blue-800",
    },
    tip: {
      wrapper: "bg-amber-50/70 border-amber-200/60",
      iconBg: "bg-amber-100",
      icon: "text-amber-600",
      title: "text-amber-800",
    },
    warning: {
      wrapper: "bg-red-50/70 border-red-200/60",
      iconBg: "bg-red-100",
      icon: "text-red-600",
      title: "text-red-800",
    },
    success: {
      wrapper: "bg-green-50/70 border-green-200/60",
      iconBg: "bg-green-100",
      icon: "text-green-600",
      title: "text-green-800",
    },
  };

  const icons = {
    info: Info,
    tip: Lightbulb,
    warning: AlertTriangle,
    success: CheckCircle,
  };

  const Icon = icons[type];
  const style = styles[type];

  return (
    <div className={`my-8 rounded-2xl border p-6 ${style.wrapper}`}>
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl ${style.iconBg}`}>
          <Icon className={`h-5 w-5 ${style.icon}`} />
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <p className={`font-bold text-base mb-2 ${style.title}`}>{title}</p>
          )}
          <div className="text-muted-foreground leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
};

// Quick Tip Box
const QuickTip = ({ children }: { children: React.ReactNode }) => (
  <div className="my-8 rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-2 border-primary/20 p-6 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
    <div className="relative">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Lightbulb className="h-5 w-5 text-primary" />
        </div>
        <span className="font-bold text-foreground">Quick Tip</span>
      </div>
      <div className="text-muted-foreground leading-relaxed pl-13">{children}</div>
    </div>
  </div>
);

// Timeline Component
const Timeline = ({ items }: { items: { phase: string; title: string; duration?: string; content: React.ReactNode }[] }) => (
  <div className="my-10 space-y-0">
    {items.map((item, index) => (
      <div key={index} className="relative pl-10 pb-10 last:pb-0">
        {/* Timeline line */}
        {index < items.length - 1 && (
          <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gradient-to-b from-primary/40 to-border" />
        )}
        {/* Timeline dot */}
        <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex items-center justify-center shadow-sm">
          <span className="text-sm font-bold text-primary">{index + 1}</span>
        </div>
        <div className="space-y-2 bg-card/50 rounded-xl p-4 border border-border/30">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary/80 bg-primary/10 px-2 py-1 rounded">{item.phase}</span>
            {item.duration && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                <Clock className="h-3 w-3" />
                {item.duration}
              </span>
            )}
          </div>
          <h4 className="font-bold text-foreground text-lg">{item.title}</h4>
          <div className="text-muted-foreground text-sm leading-relaxed">{item.content}</div>
        </div>
      </div>
    ))}
  </div>
);

// Checklist Component
const Checklist = ({ items }: { items: { title: string; description?: string; priority?: "high" | "medium" | "low" }[] }) => (
  <div className="my-8 space-y-3">
    {items.map((item, index) => {
      const priorityColors = {
        high: "bg-red-50 text-red-700 border-red-200",
        medium: "bg-amber-50 text-amber-700 border-amber-200",
        low: "bg-green-50 text-green-700 border-green-200",
      };
      const priorityLabels = {
        high: "High",
        medium: "Medium", 
        low: "Low",
      };
      return (
        <div key={index} className="flex items-start gap-4 p-5 rounded-xl border border-border/40 bg-card/50 hover:bg-card hover:border-primary/20 hover:shadow-md transition-all duration-300">
          <div className="flex-shrink-0 mt-0.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10">
              <CheckSquare className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-semibold text-foreground">{item.title}</span>
              {item.priority && (
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${priorityColors[item.priority]}`}>
                  {priorityLabels[item.priority]} priority
                </span>
              )}
            </div>
            {item.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            )}
          </div>
        </div>
      );
    })}
  </div>
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
    <div className="prose-blog max-w-none">
      <Component
        components={{
          h2: headingTwo,
          h3: headingThree,
          p: paragraph,
          ul: list,
          ol: orderedList,
          li: listItem,
          a: link,
          code: inlineCode,
          pre: preformatted,
          blockquote: blockquote,
          strong: strong,
          hr: horizontalRule,
          table: table,
          thead: tableHead,
          tr: tableRow,
          th: tableHeader,
          td: tableCell,
          Callout,
          QuickTip,
          Timeline,
          Checklist,
        }}
      />
    </div>
  );
}

export { Callout, QuickTip, Timeline, Checklist };
