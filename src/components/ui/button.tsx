import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-brand-navy text-white hover:bg-brand-navy-700 shadow-sm",
        primary:
          "bg-brand-navy text-white hover:bg-brand-navy-700 shadow-sm",
        yellow:
          "bg-brand-yellow-400 text-brand-navy-950 hover:bg-brand-yellow-500 shadow-button font-bold",
        secondary:
          "bg-brand-cream-200 text-brand-navy-900 hover:bg-brand-cream-300",
        outline:
          "border-2 border-brand-navy-800/15 bg-transparent text-brand-navy-900 hover:bg-brand-cream-100 hover:border-brand-navy-800/30",
        ghost:
          "text-brand-navy-800 hover:bg-brand-cream-200/60 hover:text-brand-navy-950",
        link:
          "text-brand-navy underline-offset-4 hover:underline p-0 h-auto font-medium",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-sm",
        pastelBlue:
          "bg-brand-pastel-blue text-brand-pastel-blue-text hover:bg-sky-100 font-semibold",
        pastelPink:
          "bg-brand-pastel-pink text-brand-pastel-pink-text hover:bg-pink-100 font-semibold",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-full px-3.5 text-xs",
        lg: "h-12 rounded-full px-8 text-base",
        icon: "h-10 w-10 rounded-full",
        iconSm: "h-8 w-8 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin text-current" />}
        {!isLoading && leftIcon && <span className="mr-2 inline-flex">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2 inline-flex">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
