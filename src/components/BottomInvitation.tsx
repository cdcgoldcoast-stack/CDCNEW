import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BottomInvitationProps {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaTo?: string;
  className?: string;
}

const BottomInvitation = ({
  title,
  description,
  ctaLabel = "Get Your Renovation Plan",
  ctaTo = "/get-quote",
  className,
}: BottomInvitationProps) => {
  return (
    <section className={cn("mt-12 md:mt-20 mb-8 md:mb-12", className)}>
      <div className="bg-primary py-10 md:py-24 px-5 md:px-8 text-center">
        <h2 className="font-serif italic text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-primary-foreground mb-4 md:mb-6">
          {title}
        </h2>
        <p className="text-primary-foreground/80 text-sm md:text-lg leading-relaxed mb-6 md:mb-10 max-w-xl mx-auto">
          {description}
        </p>
        <Link
          to={ctaTo}
          className="inline-flex items-center justify-center border border-primary-foreground text-primary-foreground px-6 md:px-8 py-3 md:py-4 text-xs uppercase tracking-[0.15em] font-medium hover:bg-primary-foreground hover:text-primary transition-colors"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
};

export default BottomInvitation;
