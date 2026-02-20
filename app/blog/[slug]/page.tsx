import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import BlogShell from "@/components/blog/BlogShell";
import MDXContent from "@/components/blog/MDXContent";
import { DEFAULT_META, SITE_NAME } from "@/config/seo";
import { formatBlogDate, getAllBlogSlugs, getPostBySlug } from "@/lib/blog";
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
        <article className="container-narrow space-y-10">
          <Link href="/blog" className="text-label text-primary">
            Back To Blog
          </Link>

          <header className="space-y-4">
            <p className="text-label text-foreground/50">
              {formatBlogDate(post.publishedAt)} • {post.readingTime}
            </p>
            <h1>{post.title}</h1>
            <p className="text-foreground/70">{post.description}</p>
            {post.tags?.length ? (
              <ul className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li key={tag} className="rounded-full border border-border/60 px-3 py-1 text-xs uppercase tracking-wider">
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}
          </header>

          <MDXContent source={post.body} />
        </article>
      </BlogShell>
    </>
  );
}
