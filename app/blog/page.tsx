import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { DEFAULT_META } from "@/config/seo";
import { getAllPublishedPosts, formatBlogDate } from "@/lib/blog";
import { buildMetadata, generateWebPageSchema } from "@/lib/seo";
import { generateBreadcrumbSchema, generateItemListSchema } from "@/lib/structured-data";

const pageTitle = "Gold Coast Renovation Blog";
const pageDescription =
  "Read practical renovation guides, planning tips, and design insights from the Concept Design Construct team on the Gold Coast.";

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
  ],
});

export default async function BlogPage() {
  const posts = await getAllPublishedPosts();

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
      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="container-wide">
            <p className="text-label text-primary mb-4">CDC Journal</p>
            <h1 className="font-serif text-h1-mobile md:text-h1 text-foreground leading-tight max-w-3xl">
              Gold Coast Renovation Blog
            </h1>
            <p className="text-foreground/70 text-lg leading-relaxed mt-6 max-w-2xl">
              Practical renovation guides, planning tips, and design insights from our team.
            </p>
          </div>
        </section>

        {/* SEO-friendly overview copy */}
        <section className="pb-10 md:pb-12">
          <div className="container-wide max-w-3xl text-foreground/70 text-base leading-relaxed space-y-4">
            <p>
              This journal is written for homeowners planning Gold Coast renovations who want calm,
              realistic guidance rather than hype. Articles cover kitchen, bathroom, and whole-home
              projects, with a focus on timelines, budgeting, and the decisions that actually move
              a renovation forward.
            </p>
            <p>
              You can use these guides to understand what happens before demolition starts, how
              approvals and selections fit together, and what trade sequencing looks like on a
              typical project. They are designed to complement a consultation, helping you arrive
              with better questions and a clearer idea of priorities.
            </p>
            <p>
              Topics include renovation timelines, budget breakdowns for different room types, first
              renovation checklists, and how to plan work in stages across life events. New posts
              are added over time as the team sees recurring questions from Gold Coast clients.
            </p>
            <p>
              If you want guidance tied to your own home rather than generic advice, use the blog as
              a starting point and then move into a scoped discussion with the team. That way, the
              ideas you save are connected to practical next steps around budget, staging, and
              builder coordination.
            </p>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="pb-20 md:pb-28">
          <div className="container-wide">
            {posts.length === 0 ? (
              <p className="text-foreground/60">
                No blog posts are published yet. Check back soon for renovation insights.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                {posts.map((post) => (
                  <article key={post.slug}>
                    <Link href={post.url} className="block group">
                      {/* Image */}
                      <div className="aspect-[16/10] bg-muted mb-6 overflow-hidden relative">
                        {post.image ? (
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="font-serif text-4xl text-foreground/20">CDC</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <p className="text-label text-foreground/50 mb-3">
                        {formatBlogDate(post.publishedAt)} · {post.readingTime}
                      </p>
                      <h2 className="font-serif text-h3 text-foreground group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-foreground/60 text-sm leading-relaxed mt-3 line-clamp-2">
                        {post.description}
                      </p>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28 bg-foreground">
          <div className="container-wide text-center">
            <h2 className="font-serif text-h2-mobile md:text-h2 text-background leading-tight mb-6">
              Planning A Renovation?
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
