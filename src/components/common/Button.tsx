import type { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "neutral" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  outline?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  outline = false,
  className = "",
  children,
  ...props
}: Props) {
  const baseVariants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    neutral: "btn-neutral",
    ghost: "btn-ghost",
    danger: "btn-error",
  };

  const outlineVariants = {
    primary: "border-primary text-primary hover:bg-primary hover:text-white",
    secondary: "border-secondary text-secondary hover:bg-secondary hover:text-white",
    neutral: "border-neutral text-neutral hover:bg-neutral hover:text-white",
    ghost: "border-transparent text-gray-600 hover:bg-gray-100",
    danger: "border-red-500 text-red-500 hover:bg-red-50",
  };

  const sizes = { sm: "btn-sm", md: "", lg: "btn-lg" };

  const variantClass = outline
    ? `btn-outline ${outlineVariants[variant]}`
    : baseVariants[variant];

  return (
    <button className={`btn ${variantClass} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
