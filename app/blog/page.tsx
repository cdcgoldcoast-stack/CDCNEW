import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import BlogShell from "@/components/blog/BlogShell";
import BlogCard from "@/components/blog/BlogCard";
import NewsletterCTA from "@/components/blog/NewsletterCTA";
import { DEFAULT_META } from "@/config/seo";
import { getAllPublishedPosts } from "@/lib/blog";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { generateBreadcrumbSchema, generateItemListSchema } from "@/lib/structured-data";

const pageTitle = "Gold Coast Renovation Blog";
const pageDescription =
  "Read practical renovation guides, planning tips, and design insights from the Concept Design Construct team on the Gold Coast. Expert advice for kitchens, bathrooms, and whole-home renovations.";

export const dynamic = "force-static";

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/blog",
  keywords: [
    "Gold Coast renovation blog",
    "renovation planning guides",
    "kitchen renovation tips Gold Coast",
    "bathroom renovation advice Gold Coast",
    "home renovation checklist",
    "renovation budget planning",
  ],
});

export default async function BlogPage() {
  const posts = await getAllPublishedPosts();
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  const webPageSchema = generateWebPageSchema({
    path: "/blog",
    name: pageTitle,
    description: pageDescription,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
  ]);
  const itemListSchema = generateItemListSchema(
    posts.map((post, index) => ({
      name: post.title,
      url: post.url,
      image: post.image || DEFAULT_META.image,
      position: index + 1,
    })),
  );

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, itemListSchema]} />
      <BlogShell>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-muted/80 via-muted/40 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
          
          <div className="container-narrow relative pt-24 pb-16 md:pt-32 md:pb-20">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ArrowRight className="h-4 w-4" />
              <span className="text-foreground font-medium">Blog</span>
            </nav>
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 text-primary mb-6">
              <BookOpen className="h-4 w-4" />
              <span className="text-sm font-semibold uppercase tracking-wider">CDC Journal</span>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
              {pageTitle}
            </h1>
            
            <p className="mt-6 max-w-2xl text-xl text-muted-foreground leading-relaxed">
              {pageDescription}
            </p>
            
            {/* Stats */}
            <div className="mt-10 flex flex-wrap gap-6">
              <div className="flex items-center gap-3 rounded-2xl bg-card/50 border border-border/40 px-5 py-3 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{posts.length}</p>
                  <p className="text-sm text-muted-foreground">Article{posts.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 rounded-2xl bg-card/50 border border-border/40 px-5 py-3 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Gold Coast</p>
                  <p className="text-sm text-muted-foreground">Focused</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 rounded-2xl bg-card/50 border border-border/40 px-5 py-3 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                  <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Expert</p>
                  <p className="text-sm text-muted-foreground">Advice</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container-narrow pb-20">
          {posts.length === 0 ? (
            <div className="rounded-3xl border border-border/40 bg-card p-16 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <BookOpen className="h-10 w-10 text-muted-foreground/50" />
              </div>
              <p className="mt-6 text-lg text-muted-foreground">
                No blog posts are published yet. Check back soon for renovation insights.
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Featured Post */}
              {featuredPost && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-1 rounded-full bg-primary" />
                    <h2 className="text-lg font-bold uppercase tracking-wider text-muted-foreground">Featured Article</h2>
                  </div>
                  <BlogCard post={featuredPost} featured />
                </div>
              )}

              {/* Post Grid */}
              {remainingPosts.length > 0 && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-1 rounded-full bg-primary/50" />
                      <h2 className="text-lg font-bold uppercase tracking-wider text-muted-foreground">Latest Articles</h2>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {remainingPosts.length} article{remainingPosts.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    {remainingPosts.map((post) => (
                      <BlogCard key={post.slug} post={post} />
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter CTA */}
              <div className="pt-4">
                <NewsletterCTA />
              </div>
            </div>
          )}
        </section>
      </BlogShell>
    </>
  );
}
