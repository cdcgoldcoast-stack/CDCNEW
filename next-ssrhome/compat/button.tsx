import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"
  | "hero"
  | "heroOutline"
  | "accent"
  | "subtle";

type ButtonSize = "default" | "sm" | "lg" | "xl" | "icon";

const baseClasses =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-xs uppercase tracking-[0.15em] font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.03] active:scale-[0.98]";

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-primary text-primary-foreground hover:opacity-80",
  destructive: "bg-destructive text-destructive-foreground hover:opacity-80",
  outline: "border border-foreground bg-transparent hover:bg-foreground hover:text-background",
  secondary: "bg-secondary text-secondary-foreground hover:opacity-80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-foreground underline-offset-4 hover:underline",
  hero: "bg-primary text-primary-foreground hover:opacity-90 font-medium",
  heroOutline:
    "border border-foreground text-foreground bg-transparent hover:bg-foreground hover:text-background font-medium",
  accent: "bg-accent text-accent-foreground hover:opacity-90",
  subtle: "text-foreground hover:opacity-60 underline underline-offset-4",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-11 px-6 py-3",
  sm: "h-9 px-4",
  lg: "h-12 px-8",
  xl: "h-14 px-10",
  icon: "h-10 w-10",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    if (asChild) {
      return <button className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)} ref={ref} {...props} />;
    }

    return <button className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export const buttonVariants = ({ variant = "default", size = "default", className }: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) =>
  cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

export { Button };
