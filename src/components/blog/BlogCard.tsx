"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

interface BlogPost {
  slug: string;
  url: string;
  title: string;
  description: string;
  publishedAt: string;
  image?: string;
  tags: string[];
  readingTime: string;
}

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

function formatBlogDate(value: string): string {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  if (featured) {
    return (
      <article className="group relative overflow-hidden rounded-3xl border border-border/40 bg-card shadow-lg shadow-black/5 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1">
        <Link href={post.url} className="grid gap-0 lg:grid-cols-5">
          {/* Image Section */}
          <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:col-span-2">
            {post.image ? (
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/5 via-primary/10 to-background">
                <div className="text-center">
                  <span className="text-7xl font-bold bg-gradient-to-br from-primary/30 to-primary/10 bg-clip-text text-transparent">CDC</span>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-card/80" />
            
            {/* Featured Badge */}
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Featured
              </span>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="flex flex-col justify-center p-8 lg:p-10 lg:col-span-3">
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary/70" />
                {formatBlogDate(post.publishedAt)}
              </span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary/70" />
                {post.readingTime}
              </span>
            </div>
            
            <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary lg:text-3xl">
              {post.title}
            </h2>
            
            <p className="mt-4 line-clamp-3 text-muted-foreground leading-relaxed">
              {post.description}
            </p>
            
            {post.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary/5 border border-primary/10 px-3 py-1 text-xs font-medium text-primary/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all group-hover:gap-3">
              Read Article
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-card shadow-md shadow-black/5 transition-all duration-500 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/15 hover:-translate-y-1">
      <Link href={post.url} className="relative aspect-[16/10] overflow-hidden">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/5 via-primary/10 to-background">
            <span className="text-5xl font-bold bg-gradient-to-br from-primary/25 to-primary/5 bg-clip-text text-transparent">CDC</span>
          </div>
        )}
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
          <span className="rounded-full bg-white/95 px-5 py-2.5 text-sm font-semibold text-foreground shadow-xl backdrop-blur-sm">
            Read Article
          </span>
        </div>
      </Link>
      
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatBlogDate(post.publishedAt)}
          </span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {post.readingTime}
          </span>
        </div>
        
        <h3 className="mt-3 text-lg font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary line-clamp-2">
          <Link href={post.url}>{post.title}</Link>
        </h3>
        
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground leading-relaxed">
          {post.description}
        </p>
        
        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
