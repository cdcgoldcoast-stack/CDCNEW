"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);

  useEffect(() => {
    // Extract headings for TOC
    const extractedHeadings: { id: string; text: string; level: number }[] = [];
    const lines = content.split('\n');
    
    lines.forEach((line) => {
      const match = line.match(/^(#{2,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        extractedHeadings.push({ id, text, level });
      }
    });
    
    setHeadings(extractedHeadings);
  }, [content]);

  // Simple markdown to HTML conversion
  const renderMarkdown = (text: string) => {
    return text
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="font-serif text-xl text-foreground mt-10 mb-4" id="$1">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="font-serif text-2xl md:text-3xl text-foreground mt-12 mb-6" id="$1">$1</h2>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
      // Italic within bold (handle nested)
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Blockquotes
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-6 py-3 my-8 bg-muted/30 text-foreground/80"><p>$1</p></blockquote>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline underline-offset-4 hover:no-underline">$1</a>')
      // Unordered lists (lines starting with - or *)
      .replace(/^- (.*$)/gim, '<li class="mb-2">$1</li>')
      // Wrap consecutive li elements in ul
      .replace(/(<li.*?>.*?<\/li>\n)+/g, '<ul class="list-disc ml-6 mb-6 text-foreground/70">$&</ul>')
      // Paragraphs (non-empty lines that don't start with special chars)
      .replace(/^(?!<[hlu]|<blockquote|<table)(.+)$/gim, '<p class="mb-6 text-foreground/70 leading-relaxed">$1</p>')
      // Tables - simple handling
      .replace(/\|(.+)\|/g, (match) => {
        const cells = match.split('|').filter(c => c.trim()).map(c => `<td class="px-4 py-3 border-b border-border">${c.trim()}</td>`).join('');
        return `<tr>${cells}</tr>`;
      });
  };

  const htmlContent = renderMarkdown(content);

  // Post-process to fix table structure
  const processedHtml = htmlContent
    .replace(/(<tr>.*?<\/tr>\n?){2,}/g, (match) => `<table class="w-full text-sm my-8 border-collapse">${match}</table>`)
    // Remove empty paragraphs
    .replace(/<p class="mb-6 text-foreground\/70 leading-relaxed"><\/p>/g, '');

  return (
    <div className="relative">
      {/* Table of Contents */}
      {headings.length > 0 && (
        <nav className="hidden lg:block fixed right-8 top-32 w-64 bg-muted/50 p-6 border border-border">
          <p className="text-label text-foreground/50 mb-4">On this page</p>
          <ul className="space-y-2">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a 
                  href={`#${heading.id}`}
                  className={`text-sm hover:text-primary transition-colors ${
                    heading.level === 3 ? 'pl-4 text-foreground/60' : 'text-foreground/80'
                  }`}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
      
      {/* Content */}
      <div 
        className="prose-content max-w-3xl"
        dangerouslySetInnerHTML={{ __html: processedHtml }}
      />
    </div>
  );
}
