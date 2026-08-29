import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-epfo-indigo/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-700 shadow-sm shadow-primary/15",
        gov: "bg-[#1a237e] text-white hover:bg-epfo-navy shadow-sm shadow-[#1a237e]/20 hover:shadow-md",
        destructive:
          "bg-danger text-danger-foreground hover:bg-danger-600 shadow-sm shadow-danger/15",
        outline:
          "border border-slate-200 bg-white text-slate-700 hover:border-[#1a237e]/35 hover:bg-slate-50 hover:text-[#1a237e] shadow-none",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-600 shadow-sm",
        ghost: "hover:bg-slate-100 text-slate-700 shadow-none",
        link: "text-primary underline-offset-4 hover:underline shadow-none",
      },
      size: {
        default: "h-11 px-5 py-2 min-h-[44px]",
        sm: "h-9 rounded-lg px-3.5 text-xs min-h-[36px]",
        lg: "h-12 rounded-xl px-8 text-base min-h-[48px]",
        icon: "h-11 w-11 min-h-[44px] min-w-[44px] rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
