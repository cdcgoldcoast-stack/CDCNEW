import { SITE_NAME } from "@/config/seo";
import { getAllPublishedPosts } from "@/lib/blog";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export async function GET() {
  const posts = await getAllPublishedPosts();
  const blogUrl = absoluteUrl("/blog");

  const items = posts
    .map((post) => {
      const url = absoluteUrl(post.url);
      const publishedAt = new Date(post.publishedAt).toUTCString();

      return [
        "<item>",
        `<title>${escapeXml(post.title)}</title>`,
        `<link>${url}</link>`,
        `<guid>${url}</guid>`,
        `<pubDate>${publishedAt}</pubDate>`,
        `<description>${escapeXml(post.description)}</description>`,
        `<author>${escapeXml(post.author || SITE_NAME)}</author>`,
        "</item>",
      ].join("");
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME} Blog</title>
    <link>${blogUrl}</link>
    <description>Renovation insights, planning guides, and practical advice from ${SITE_NAME}.</description>
    <language>en-au</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${absoluteUrl("/rss.xml")}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=900",
      "X-Robots-Tag": "noindex, follow",
    },
  });
}
