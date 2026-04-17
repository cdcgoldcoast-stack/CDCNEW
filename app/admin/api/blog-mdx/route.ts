import { NextResponse } from "next/server";
import { getMdxOnlyBlogPosts } from "@/lib/blog";

// Admin-only listing of the MDX blog posts living in /content/blog. The Admin UI
// shows these alongside DB posts so authors can see the full catalogue. MDX posts
// are read-only from the admin (they're edited via git).
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posts = await getMdxOnlyBlogPosts();
    return NextResponse.json({
      posts: posts.map((p) => ({
        slug: p.slug,
        title: p.title,
        description: p.description,
        publishedAt: p.publishedAt,
        author: p.author,
        tags: p.tags,
        draft: p.draft,
      })),
    });
  } catch (error) {
    console.error("Failed to load MDX posts:", error);
    return NextResponse.json({ posts: [], error: "Failed to load posts" }, { status: 500 });
  }
}
