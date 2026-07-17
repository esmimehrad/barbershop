import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "destructive";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-[var(--bds-gold-deep)]",
  secondary: "border border-border bg-card text-foreground hover:border-primary hover:bg-primary/15",
  ghost: "text-foreground hover:bg-primary/15 hover:text-primary",
  destructive: "bg-destructive text-white hover:brightness-90",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

/** Low-fi button. ≥44px tall for touch. Styled via semantic tokens only. */
export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius)] px-4 text-sm font-medium",
        "transition-[background-color,border-color,color,filter,transform] duration-fast ease-bds",
        "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]",
        "disabled:pointer-events-none disabled:opacity-50 disabled:hover:translate-y-0 [touch-action:manipulation]",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
