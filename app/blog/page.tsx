import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import BlogShell from "@/components/blog/BlogShell";
import { DEFAULT_META } from "@/config/seo";
import { formatBlogDate, getAllPublishedPosts } from "@/lib/blog";
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
      <BlogShell>
        <section className="container-narrow space-y-12">
          <header className="space-y-4">
            <p className="text-label text-primary">CDC Journal</p>
            <h1>{pageTitle}</h1>
            <p className="text-foreground/70">{pageDescription}</p>
          </header>

          {posts.length === 0 ? (
            <p className="rounded border border-border/60 bg-card p-6 text-foreground/70">
              No blog posts are published yet.
            </p>
          ) : (
            <ul className="space-y-8">
              {posts.map((post) => (
                <li key={post.slug} className="rounded border border-border/60 bg-card p-6 shadow-soft">
                  <p className="text-label text-foreground/50">
                    {formatBlogDate(post.publishedAt)} • {post.readingTime}
                  </p>
                  <h2 className="mt-3 text-2xl">
                    <Link href={post.url} className="hover:text-primary">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-3 text-foreground/75">{post.description}</p>
                  <Link href={post.url} className="mt-4 inline-block text-label text-primary">
                    Read Article
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </BlogShell>
    </>
  );
}
