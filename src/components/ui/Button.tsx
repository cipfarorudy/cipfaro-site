import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../../utils/cn"

type ButtonVariant = "default" | "secondary" | "outline" | "ghost" | "destructive"
type ButtonSize = "default" | "sm" | "lg" | "icon"

const buttonVariants = {
  variant: {
    default: "bg-primary-500 text-white hover:bg-primary-600 shadow-md hover:shadow-lg",
    secondary: "bg-secondary-500 text-white hover:bg-secondary-600",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-700 hover:bg-gray-100",
    destructive: "bg-red-500 text-white hover:bg-red-600",
  },
  size: {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-6 text-base",
    icon: "h-10 w-10",
  },
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", loading = false, asChild = false, children, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    const variantClasses = buttonVariants.variant[variant]
    const sizeClasses = buttonVariants.size[size]
    
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(baseClasses, variantClasses, sizeClasses, className)}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button }