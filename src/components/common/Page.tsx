import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

const maxWidths = {
  sm: "max-w-3xl",
  md: "max-w-4xl",
  lg: "max-w-5xl",
  xl: "max-w-7xl",
};

export default function Page({ children, maxWidth = "lg" }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className={`${maxWidths[maxWidth]} mx-auto px-8 py-8`}>
        {children}
      </main>
    </div>
  );
}
