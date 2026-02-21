type MDXContentProps = {
  source: string;
};

export default function MDXContent({ source }: MDXContentProps) {
  // Simple markdown to HTML conversion
  // Replace headers
  let html = source
    .replace(/^### (.*$)/gim, '<h3 class="font-serif text-h3 text-foreground mt-12 mb-4">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="font-serif text-h2-mobile md:text-h2 text-foreground mt-16 mb-6">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="font-serif text-h1 text-foreground mt-16 mb-6">$1</h1>')
    // Replace bold
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    // Replace italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Replace blockquotes
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-6 py-2 my-8 italic text-foreground/70 bg-muted/30">$1</blockquote>')
    // Replace links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline underline-offset-4 hover:no-underline transition-colors">$1</a>')
    // Replace paragraphs (must be last)
    .replace(/\n\n/g, '</p><p class="text-foreground/70 leading-relaxed mb-6">')
    .replace(/^(?!<[h|b|u|l])(.*$)/gim, '<p class="text-foreground/70 leading-relaxed mb-6">$1</p>');

  // Wrap in container
  return (
    <div 
      className="prose-blog"
      dangerouslySetInnerHTML={{ __html: `<div>${html}</div>` }}
    />
  );
}
