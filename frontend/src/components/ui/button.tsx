import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:text-gray-400",
  {
    variants: {
      variant: {
        default: "bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:text-gray-500",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:text-gray-500",
        outline:
          "border-2 border-gray-300 bg-white text-gray-900 hover:bg-gray-50 hover:border-gray-400 disabled:border-gray-200 disabled:text-gray-400",
        secondary:
          "bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400",
        ghost: "text-gray-700 hover:bg-gray-100 hover:text-gray-900 disabled:text-gray-400",
        link: "text-primary-600 underline-offset-4 hover:text-primary-700 hover:underline disabled:text-gray-400",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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
