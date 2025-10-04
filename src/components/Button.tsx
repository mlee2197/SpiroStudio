import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const baseStyles =
  "inline-flex items-center justify-center rounded font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const variantStyles: Record<string, string> = {
  default: "border border-primary text-primary bg-transparent hover:bg-gray-200",
  outline: "border border-primary text-primary bg-transparent hover:bg-gray-200",
  ghost: "bg-transparent text-primary hover:bg-gray-100",
};

const sizeStyles: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "default",
      size = "md",
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={[
          baseStyles,
          variantStyles[variant] || variantStyles.default,
          sizeStyles[size] || sizeStyles.md,
          className,
        ].join(" ")}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
