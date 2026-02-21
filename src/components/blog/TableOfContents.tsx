"use client";

import { useState, useEffect } from "react";
import { List, X, ChevronRight } from "lucide-react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/30 transition-all duration-300 hover:scale-110 hover:shadow-primary/40 md:hidden"
        aria-label="Toggle table of contents"
      >
        {isOpen ? <X className="h-6 w-6" /> : <List className="h-6 w-6" />}
      </button>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* TOC Content */}
      <nav
        className={`
          fixed bottom-24 right-6 z-40 w-80 rounded-2xl border border-border/60 bg-card/95 backdrop-blur-xl p-6 shadow-2xl transition-all duration-300 md:static md:bottom-auto md:right-auto md:w-full md:rounded-2xl md:bg-card md:backdrop-blur-none md:shadow-lg
          ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 md:translate-x-0 md:opacity-100"}
        `}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <List className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-foreground">Contents</h4>
            <p className="text-xs text-muted-foreground">{headings.length} sections</p>
          </div>
        </div>
        
        <ul className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin">
          {headings.map((heading, index) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                onClick={() => setIsOpen(false)}
                className={`
                  group flex items-center gap-2 py-2 px-3 rounded-lg text-sm transition-all duration-200
                  ${heading.level === 3 ? "pl-8 text-muted-foreground/80" : "font-medium text-foreground/80"}
                  ${activeId === heading.id 
                    ? "bg-primary/10 text-primary font-semibold" 
                    : "hover:bg-muted hover:text-foreground"
                  }
                `}
              >
                <span className={`
                  flex h-5 w-5 items-center justify-center rounded text-xs flex-shrink-0 transition-colors
                  ${activeId === heading.id 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground group-hover:bg-background"
                  }
                `}>
                  {index + 1}
                </span>
                <span className="line-clamp-2">{heading.text}</span>
                {activeId === heading.id && (
                  <ChevronRight className="h-4 w-4 ml-auto flex-shrink-0" />
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
