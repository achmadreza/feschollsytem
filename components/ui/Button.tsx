import React, { ReactNode, ButtonHTMLAttributes, CSSProperties } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "text-white border-0",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        danger: "text-danger bg-transparent border-0",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline p-0 border-0 bg-transparent",
        orange: "btn-orange text-nowrap",
      },
      size: {
        default: "h-9 px-4 py-1.5 text-sm gap-2 rounded-md",
        sm: "h-7 px-2.5 py-1 text-xs gap-1.5 rounded",
        xs: "h-6 px-2 py-0.5 text-[11px] gap-1 rounded-[3px]",
        lg: "h-10 px-5 py-2 text-sm gap-2 rounded",
        icon: "h-7 w-7 text-xs rounded p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const variantInlineStyles: Partial<Record<string, CSSProperties>> = {
  default: {
    backgroundColor: "#032B88",
    color: "#ffffff",
    border: "none",
  },
  danger: {
    border: "none",
    backgroundColor: "transparent",
  },
};

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: ButtonVariantProps["variant"];
  size?: ButtonVariantProps["size"];
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = "default",
  size,
  fullWidth,
  className,
  style,
  type = "button",
  ...props
}: ButtonProps) {
  const defaultStyle = variantInlineStyles[variant || "default"] || {};

  return (
    <button
      type={type}
      className={cn(
        buttonVariants({ variant, size }),
        fullWidth && "w-100",
        className
      )}
      style={{
        ...defaultStyle,
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}