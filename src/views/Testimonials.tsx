"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import BottomInvitation from "@/components/BottomInvitation";
import GoogleReviewBadge from "@/components/GoogleReviewBadge";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "They kept us informed at every stage — no surprises, no hidden costs. The whole process felt straightforward from start to finish.",
    name: "Sarah M.",
    suburb: "Broadbeach",
    project: "Kitchen & Bathroom Renovation",
  },
  {
    quote:
      "We were nervous about the disruption, but the team had a clear plan and stuck to it. Our home feels completely different now — in the best way.",
    name: "James & Lisa T.",
    suburb: "Robina",
    project: "Whole Home Renovation",
  },
  {
    quote:
      "From the first consultation to handover, communication was excellent. They genuinely cared about getting it right for our family.",
    name: "Mark D.",
    suburb: "Helensvale",
    project: "Home Extension",
  },
  {
    quote:
      "The design process was fantastic. They helped us see what our kitchen could look like before any work started. The finished result exceeded our expectations.",
    name: "Rachel & Tom K.",
    suburb: "Mermaid Beach",
    project: "Kitchen Renovation",
  },
  {
    quote:
      "After getting three quotes, CDC stood out for their transparency and attention to detail. The fixed-price contract gave us peace of mind throughout.",
    name: "Andrew P.",
    suburb: "Palm Beach",
    project: "Bathroom & Laundry Renovation",
  },
  {
    quote:
      "Our 1990s home needed a complete refresh. The team transformed it into a modern, open-plan space while keeping the character we loved. Couldn't be happier.",
    name: "Helen & Steve R.",
    suburb: "Southport",
    project: "Whole Home Renovation",
  },
  {
    quote:
      "What impressed us most was the single point of contact. One person managed everything, so we never felt lost or passed around. Highly recommend.",
    name: "David L.",
    suburb: "Burleigh Heads",
    project: "Kitchen & Living Area Renovation",
  },
  {
    quote:
      "They delivered on time and on budget. In the renovation world, that says everything. We have already recommended them to two neighbours.",
    name: "Karen W.",
    suburb: "Broadbeach Waters",
    project: "Bathroom Renovation",
  },
];

const Testimonials = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Client Testimonials | Gold Coast Renovations"
        description="Read real testimonials from Gold Coast homeowners who have renovated with Concept Design Construct."
        url="/testimonials"
      />
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-cream relative z-10">
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="text-label text-primary mb-6">Testimonials</p>
            <h1 className="font-serif text-h1-mobile md:text-h1 text-foreground leading-tight mb-8">
              What Our Clients Say
            </h1>
            <p className="text-foreground/80 text-lg leading-relaxed">
              Real experiences from Gold Coast homeowners who trusted us with
              their renovation projects. Every review reflects our commitment to
              clear communication, quality workmanship, and a smooth process.
            </p>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-16 md:py-24 bg-background relative z-10">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {testimonials.map((testimonial, index) => (
              <motion.blockquote
                key={index}
                className="bg-cream/50 p-6 md:p-8 flex flex-col"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
              >
                <p className="text-body-text font-serif italic text-base leading-relaxed mb-6 flex-grow">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <footer>
                  <p className="text-foreground font-medium text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-foreground/60 text-xs uppercase tracking-wider mt-1">
                    {testimonial.suburb} &middot; {testimonial.project}
                  </p>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Google Review Badge */}
      <section className="py-12 md:py-16 bg-cream relative z-10 border-t border-foreground/10">
        <div className="container-wide">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-6">
              <GoogleReviewBadge
                iconSize="w-10 h-10"
                starSize="w-5 h-5"
                labelSize="text-base"
                starGap="gap-1.5"
              />
            </div>
            <p className="text-foreground/60 text-sm mb-6">
              4.9 stars from 47 reviews on Google
            </p>
            <a
              href="https://g.page/r/CQ_review_placeholder"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-foreground/20 text-foreground px-6 py-3 text-xs uppercase tracking-[0.15em] font-medium hover:bg-foreground hover:text-background transition-colors"
            >
              Leave a Review
            </a>
          </motion.div>
        </div>
      </section>

      <div className="relative z-10">
        <BottomInvitation
          title="Ready to Start Your Own Story?"
          description="Join dozens of happy Gold Coast homeowners. Book a free consultation and start your renovation journey."
          ctaLabel="Book a Consultation"
          ctaTo="/book-renovation-consultation"
          className="mt-0 mb-0"
        />
      </div>

      <Footer />
    </div>
  );
};

export default Testimonials;
