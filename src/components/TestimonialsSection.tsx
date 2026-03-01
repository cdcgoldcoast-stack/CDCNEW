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
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 md:py-28 bg-background relative z-10 border-t border-foreground/10">
      <div className="container-wide px-5 md:px-8">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-label text-foreground/70 mb-4 md:mb-6 text-xs md:text-sm">
            What Homeowners Say
          </p>
          <h2 className="text-foreground font-serif italic text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight">
            Real Experiences, Real Results
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.blockquote
              key={index}
              className="text-center flex flex-col items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <p className="text-body-text font-serif italic text-base md:text-lg leading-relaxed mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <footer className="mt-auto">
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
  );
};

export default TestimonialsSection;
