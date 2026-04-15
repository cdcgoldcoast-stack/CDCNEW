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
      "Throughout the process they have been professional, communicative and supporting. We couldn't have asked for a better team for our first experience with renovating.",
    name: "Trish",
    suburb: "Gold Coast",
    project: "Home Renovation",
  },
  {
    quote:
      "The finish is absolutely incredible and was finished within the timeframe provided. Mark is extremely detail conscious and this shines through in the trades he uses.",
    name: "Erin & Sam",
    suburb: "Gold Coast",
    project: "Bathroom Renovation",
  },
  {
    quote:
      "Not only were we astonished by the finished product of our Bathroom, Ensuite and Powder room renovations, we were amazed by the workmanship. Every little bit of attention to detail was made.",
    name: "Emmanuel Vella",
    suburb: "Gold Coast",
    project: "Bathroom & Ensuite Renovation",
  },
  {
    quote:
      "Mark was an amazing project manager always one step ahead of the build, completing my project in 6 weeks. Transformed a tired '70s home into a modern beauty.",
    name: "Susan",
    suburb: "Gold Coast",
    project: "Whole Home Renovation",
  },
  {
    quote:
      "They are on time, efficient, well mannered and clean up after themselves. You can't ask for more. I would highly recommend them for any building or renovation.",
    name: "Fran",
    suburb: "Gold Coast",
    project: "Bathroom Renovation",
  },
  {
    quote:
      "We were so impressed by the timeliness, attitude and workmanship that when we needed an insurance repair on our main bathroom, we engaged CDC again. A builder who does what he says he will do.",
    name: "Daryl Weavers",
    suburb: "Gold Coast",
    project: "Ensuite & Laundry Renovation",
  },
  {
    quote:
      "Mark managed to deliver great work within really tight timelines for our bathroom renovation. Really happy with the outcome and the result didn't disappoint our expectations.",
    name: "Jonathan",
    suburb: "Gold Coast",
    project: "Bathroom Renovation",
  },
  {
    quote:
      "In a word, CDC are 'Exceptional'. Their team workmanship, punctual attendance and tidiness exceeded my expectations and building industry standards.",
    name: "Verified Google Review",
    suburb: "Gold Coast",
    project: "Home Renovation",
  },
  {
    quote:
      "Communication was a breeze throughout the project. They kept me in the loop with regular updates and made sure everything was on track with weekly progress updates.",
    name: "Verified Google Review",
    suburb: "Gold Coast",
    project: "Home Renovation",
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
      <main id="main-content">

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-cream relative z-10">
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="text-label text-primary mb-6">Testimonials</p>
            <h1 className="font-serif text-h1-mobile md:text-h1 text-primary leading-tight mb-8">
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
                  <p className="text-primary font-medium text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-primary/60 text-xs uppercase tracking-wider mt-1">
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
            <p className="text-foreground/60 text-sm">
              4.9 stars from 50 reviews on Google
            </p>
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


      </main>
      <Footer />
    </div>
  );
};

export default Testimonials;
