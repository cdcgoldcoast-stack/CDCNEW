"use client";

import { Mail, ArrowRight, Phone } from "lucide-react";

export default function NewsletterCTA() {
  return (
    <aside className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/95 to-primary/90 p-8 text-primary-foreground shadow-xl shadow-primary/20 md:p-10">
      {/* Decorative Elements */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
      <div className="absolute right-10 top-10 h-20 w-20 rounded-full bg-white/10" />
      <div className="absolute left-10 bottom-10 h-16 w-16 rounded-full bg-white/5" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-primary-foreground/80">Stay Updated</span>
            <h3 className="text-2xl font-bold">Get Renovation Tips & Insights</h3>
          </div>
        </div>
        
        <p className="max-w-xl text-lg text-primary-foreground/90 leading-relaxed">
          Subscribe to receive practical renovation advice, Gold Coast market updates, 
          and exclusive guides delivered to your inbox.
        </p>
        
        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="/book-renovation-consultation"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-base font-bold text-primary shadow-xl shadow-black/10 transition-all hover:bg-white/95 hover:shadow-2xl hover:shadow-black/15 hover:-translate-y-0.5"
          >
            Request Free Consultation
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="tel:0400123456"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-sm border border-white/20 transition-all hover:bg-white/20"
          >
            <Phone className="h-4 w-4" />
            Call Us
          </a>
        </div>
        
        {/* Trust Badges */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-primary-foreground/70">
          <span className="inline-flex items-center gap-1.5">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Free consultation
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            No obligation
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Gold Coast specialists
          </span>
        </div>
      </div>
    </aside>
  );
}
