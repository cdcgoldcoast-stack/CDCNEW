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
      "Mark was an amazing project manager always one step ahead of the build, completing my project in 6 weeks. Transformed a tired '70s home into a modern beauty.",
    name: "Susan",
    suburb: "Gold Coast",
    project: "Whole-Home Renovation",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-12 md:py-20 bg-background relative z-10 border-t border-foreground/10">
      <div className="container-wide px-5 md:px-8">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-label text-foreground/80 mb-4 md:mb-6 text-xs md:text-sm">
            What Homeowners Say
          </p>
          <h2 className="text-primary font-serif italic text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight">
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
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <p className="text-body-text font-serif italic text-base md:text-lg leading-relaxed mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <footer className="mt-auto">
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
  );
};

export default TestimonialsSection;
