import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground border-border",
        easy: "border-transparent bg-difficulty-easy/20 text-difficulty-easy",
        medium: "border-transparent bg-difficulty-medium/20 text-difficulty-medium",
        hard: "border-transparent bg-difficulty-hard/20 text-difficulty-hard",
        extreme: "border-transparent bg-difficulty-extreme/20 text-difficulty-extreme",
        logic: "border-transparent bg-category-logic/20 text-category-logic",
        math: "border-transparent bg-category-math/20 text-category-math",
        probability: "border-transparent bg-category-probability/20 text-category-probability",
        estimation: "border-transparent bg-category-estimation/20 text-category-estimation",
        strategy: "border-transparent bg-category-strategy/20 text-category-strategy",
        glow: "border-primary/50 bg-primary/10 text-primary shadow-sm shadow-primary/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
