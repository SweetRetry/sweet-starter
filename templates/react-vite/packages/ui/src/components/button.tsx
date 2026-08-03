import { cn } from "@workspace/ui/lib/utils"
import { cva } from "class-variance-authority"
import { motion } from "motion/react"
import type { ComponentProps } from "react"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input hover:bg-accent",
        ghost: "hover:bg-accent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps extends Omit<ComponentProps<typeof motion.button>, "variant"> {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm"
}

export function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
