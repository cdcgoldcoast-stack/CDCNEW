"use client";

import { Award, Shield, MapPin, Star } from "lucide-react";

interface AuthorBioProps {
  author?: string;
  compact?: boolean;
}

export default function AuthorBio({ author = "Concept Design Construct", compact = false }: AuthorBioProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-4 rounded-2xl border border-border/40 bg-card p-4 shadow-sm">
        <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20 flex items-center justify-center">
          <span className="text-sm font-bold text-primary">CDC</span>
        </div>
        <div>
          <p className="font-semibold text-foreground">{author}</p>
          <p className="text-sm text-muted-foreground">Gold Coast Renovation Specialists</p>
        </div>
      </div>
    );
  }

  return (
    <aside className="rounded-3xl border border-border/40 bg-gradient-to-br from-card via-card to-muted/20 p-8 shadow-lg">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        {/* Avatar */}
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-background border-2 border-primary/20 flex items-center justify-center shadow-inner">
          <span className="text-3xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
            CDC
          </span>
        </div>
        
        {/* Content */}
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-foreground">Written by {author}</h3>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Gold Coast renovation builders specializing in kitchens, bathrooms, and whole-home transformations. 
              QBCC licensed with years of experience delivering quality results.
            </p>
          </div>
          
          {/* Badges */}
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 text-sm font-semibold text-primary">
              <Shield className="h-4 w-4" />
              QBCC Licensed
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700">
              <Award className="h-4 w-4" />
              Design-Led Builds
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-4 py-2 text-sm font-semibold text-green-700">
              <MapPin className="h-4 w-4" />
              Gold Coast & Surrounds
            </span>
          </div>

          {/* CTA */}
          <div className="pt-2 border-t border-border/30">
            <p className="text-sm text-muted-foreground">
              Ready to start your renovation?{" "}
              <a 
                href="/book-renovation-consultation" 
                className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
              >
                Book a free consultation
              </a>{" "}
              to discuss your project with our team.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
