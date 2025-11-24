import { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "neutral" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: Props) {
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    neutral: "btn-neutral",
    ghost: "btn-ghost",
  };

  const sizes = { sm: "btn-sm", md: "", lg: "btn-lg" };

  return (
    <button className={`btn ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
