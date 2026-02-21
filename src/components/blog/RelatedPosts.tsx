"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

interface BlogPost {
  slug: string;
  url: string;
  title: string;
  description: string;
  image?: string;
}

interface RelatedPostsProps {
  posts: BlogPost[];
  currentSlug: string;
}

export default function RelatedPosts({ posts, currentSlug }: RelatedPostsProps) {
  const relatedPosts = posts
    .filter((post) => post.slug !== currentSlug)
    .slice(0, 3);

  if (relatedPosts.length === 0) return null;

  return (
    <aside className="border-t-2 border-border/60 pt-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <BookOpen className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">Continue Reading</h3>
          <p className="text-sm text-muted-foreground">More articles from our blog</p>
        </div>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post) => (
          <Link
            key={post.slug}
            href={post.url}
            className="group block overflow-hidden rounded-2xl border border-border/40 bg-card transition-all duration-500 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              {post.image ? (
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/5 via-primary/10 to-background">
                  <span className="text-3xl font-bold bg-gradient-to-br from-primary/25 to-primary/5 bg-clip-text text-transparent">
                    CDC
                  </span>
                </div>
              )}
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="p-5">
              <h4 className="font-bold text-foreground transition-colors group-hover:text-primary line-clamp-2 leading-snug">
                {post.title}
              </h4>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {post.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Read article
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
