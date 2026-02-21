import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User, Tag, ChevronRight } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import BlogShell from "@/components/blog/BlogShell";
import MDXContent from "@/components/blog/MDXContent";
import TableOfContents from "@/components/blog/TableOfContents";
import AuthorBio from "@/components/blog/AuthorBio";
import RelatedPosts from "@/components/blog/RelatedPosts";
import NewsletterCTA from "@/components/blog/NewsletterCTA";
import { DEFAULT_META, SITE_NAME } from "@/config/seo";
import { formatBlogDate, getAllBlogSlugs, getPostBySlug, getAllPublishedPosts, BlogPost } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";
import { generateBlogPostingSchema, generateBreadcrumbSchema } from "@/lib/structured-data";

export const dynamic = "force-static";
export const dynamicParams = false;

type PageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return buildMetadata({
      title: "Post Not Found",
      description: "This blog post could not be found.",
      path: "/_not-found",
      noIndex: true,
    });
  }

  const keywords = post.tags?.length
    ? post.tags
    : ["Gold Coast renovation blog", "renovation planning advice", "home renovation tips"];

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: post.url,
    image: post.image || DEFAULT_META.image,
    type: "article",
    keywords,
    author: post.author || SITE_NAME,
    articlePublishedTime: post.publishedAt,
    articleModifiedTime: post.updatedAt || post.publishedAt,
    articleTags: keywords,
  });
}

function extractHeadings(content: string): { id: string; text: string; level: number }[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: { id: string; text: string; level: number }[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    headings.push({ id, text, level });
  }

  return headings;
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  const allPosts = await getAllPublishedPosts();
  const headings = extractHeadings(post.body);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title, url: post.url },
  ]);
  const blogPostingSchema = generateBlogPostingSchema({
    title: post.title,
    description: post.description,
    path: post.url,
    publishedAt: post.publishedAt,
    modifiedAt: post.updatedAt || post.publishedAt,
    authorName: post.author || SITE_NAME,
    image: post.image || DEFAULT_META.image,
    tags: post.tags || [],
  });

  return (
    <>
      <JsonLd data={[breadcrumbSchema, blogPostingSchema]} />
      <BlogShell>
        {/* Hero Section */}
        <section className="relative">
          {/* Background Image */}
          <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden md:h-[55vh] md:min-h-[450px]">
            {post.image ? (
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-primary/10 via-muted to-background">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
              </div>
            )}
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-transparent" />
          </div>

          {/* Content Card */}
          <div className="container-narrow relative -mt-48 md:-mt-56">
            {/* Back Button */}
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 rounded-full bg-background/90 backdrop-blur-md border border-border/40 px-5 py-2.5 text-sm font-medium text-foreground shadow-lg transition-all hover:bg-background hover:shadow-xl hover:border-primary/20"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Back to Blog
            </Link>

            {/* Article Header Card */}
            <article className="mt-6 rounded-3xl border border-border/40 bg-card/95 backdrop-blur-sm p-8 shadow-xl md:p-12">
              {/* Meta Row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-4 w-4 text-primary" />
                  </span>
                  {formatBlogDate(post.publishedAt)}
                </span>
                <span className="hidden h-1 w-1 rounded-full bg-muted-foreground/40 sm:block" />
                <span className="inline-flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-4 w-4 text-primary" />
                  </span>
                  {post.readingTime}
                </span>
                {post.author && (
                  <>
                    <span className="hidden h-1 w-1 rounded-full bg-muted-foreground/40 sm:block" />
                    <span className="inline-flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-4 w-4 text-primary" />
                      </span>
                      {post.author}
                    </span>
                  </>
                )}
              </div>

              {/* Title */}
              <h1 className="mt-8 text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
                {post.title}
              </h1>

              {/* Description */}
              <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
                {post.description}
              </p>

              {/* Tags */}
              {post.tags?.length ? (
                <div className="mt-8 flex flex-wrap items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground/50" />
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted border border-border/40 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/80 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              {/* Updated Date */}
              {post.updatedAt && post.updatedAt !== post.publishedAt && (
                <p className="mt-6 text-sm text-muted-foreground/70 italic border-t border-border/30 pt-4">
                  <span className="font-medium">Updated:</span> {formatBlogDate(post.updatedAt)}
                </p>
              )}
            </article>
          </div>
        </section>

        {/* Main Content */}
        <section className="container-narrow py-16">
          <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
            {/* Article Content */}
            <div className="space-y-12">
              {/* Content Card */}
              <div className="rounded-3xl border border-border/40 bg-card p-8 shadow-lg md:p-12">
                <MDXContent source={post.body} />
              </div>

              {/* Author Bio */}
              <AuthorBio author={post.author} />

              {/* Related Posts */}
              <RelatedPosts posts={allPosts as BlogPost[]} currentSlug={post.slug} />

              {/* Newsletter CTA */}
              <NewsletterCTA />
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                <TableOfContents headings={headings} />
                
                {/* Quick Contact Box */}
                <div className="rounded-2xl border border-border/40 bg-gradient-to-br from-primary/5 via-primary/10 to-background p-6 shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-foreground">Planning a Renovation?</h4>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    Get expert advice tailored to your Gold Coast home. Book a free consultation with our team.
                  </p>
                  <a
                    href="/book-renovation-consultation"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
                  >
                    Book Free Consultation
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* Mobile CTA */}
        <section className="container-narrow pb-20 lg:hidden">
          <div className="rounded-2xl border border-border/40 bg-gradient-to-br from-primary/5 via-primary/10 to-background p-6 shadow-lg">
            <h4 className="text-lg font-bold text-foreground">Planning a Renovation?</h4>
            <p className="mt-2 text-sm text-muted-foreground">
              Get expert advice tailored to your Gold Coast home.
            </p>
            <a
              href="/book-renovation-consultation"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
            >
              Book Free Consultation
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </BlogShell>
    </>
  );
}
