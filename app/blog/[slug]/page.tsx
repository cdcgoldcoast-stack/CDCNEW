import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import MarkdownContent from "@/components/blog/MarkdownContent";
import { DEFAULT_META, SITE_NAME } from "@/config/seo";
import { getAllBlogSlugs, getPostBySlug, getAllPublishedPosts, formatBlogDate } from "@/lib/blog";
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
    : ["Gold Coast renovation blog", "renovation planning advice"];

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

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  const allPosts = await getAllPublishedPosts();

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
      <div className="min-h-screen bg-background">
        <Header />

        {/* Article Header */}
        <article className="pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="container-wide max-w-4xl">
            <Link 
              href="/blog" 
              className="text-label text-foreground/50 hover:text-primary transition-colors mb-8 block"
            >
              ← Back to Blog
            </Link>

            <p className="text-label text-foreground/50 mb-4">
              {formatBlogDate(post.publishedAt)} · {post.readingTime}
            </p>

            <h1 className="font-serif text-h1-mobile md:text-h1 text-foreground leading-tight mb-6">
              {post.title}
            </h1>

            <p className="text-foreground/70 text-lg md:text-xl leading-relaxed mb-8">
              {post.description}
            </p>

            {post.tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-label text-foreground/50 px-3 py-1 bg-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </article>

        {/* Featured Image */}
        {post.image && (
          <section className="pb-16 md:pb-20">
            <div className="container-wide">
              <div className="aspect-[16/9] md:aspect-[2/1] bg-muted overflow-hidden relative max-w-6xl mx-auto">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1200px) 100vw, 1200px"
                />
              </div>
            </div>
          </section>
        )}

        {/* Article Content */}
        <section className="pb-20 md:pb-28">
          <div className="container-wide">
            <MarkdownContent content={post.body} />

            {/* Author Box */}
            <div className="mt-16 pt-8 border-t border-border max-w-3xl">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-serif text-2xl text-primary">CDC</span>
                </div>
                <div>
                  <p className="text-label text-foreground/50 mb-1">Written by</p>
                  <p className="font-serif text-h4 text-foreground">{post.author || SITE_NAME}</p>
                  <p className="text-foreground/60 text-sm mt-2">
                    Gold Coast renovation specialists. QBCC licensed builders for kitchens, bathrooms, and whole-home transformations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {allPosts.length > 1 && (
          <section className="py-20 md:py-28 bg-muted/30">
            <div className="container-wide">
              <h2 className="font-serif text-h2-mobile md:text-h2 text-foreground mb-12">
                Continue Reading
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                {allPosts
                  .filter((p) => p.slug !== post.slug)
                  .slice(0, 3)
                  .map((relatedPost) => (
                    <article key={relatedPost.slug}>
                      <Link href={relatedPost.url} className="block group">
                        {relatedPost.image && (
                          <div className="aspect-[16/10] bg-muted mb-4 overflow-hidden relative">
                            <Image
                              src={relatedPost.image}
                              alt={relatedPost.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        )}
                        <p className="text-label text-foreground/50 mb-2">
                          {formatBlogDate(relatedPost.publishedAt)}
                        </p>
                        <h3 className="font-serif text-h3 text-foreground group-hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h3>
                      </Link>
                    </article>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-20 md:py-28 bg-foreground">
          <div className="container-wide text-center">
            <h2 className="font-serif text-h2-mobile md:text-h2 text-background leading-tight mb-6">
              Ready To Start Your Project?
            </h2>
            <p className="text-background/70 max-w-xl mx-auto mb-8">
              Get expert advice tailored to your Gold Coast home. Book a free consultation with our team.
            </p>
            <Link
              href="/book-renovation-consultation"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Book Free Consultation
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
