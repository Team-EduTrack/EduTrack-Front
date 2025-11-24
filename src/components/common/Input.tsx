import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function FormInput({ label, error, className = "", ...props }: Props) {
  const errorClass = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
    : "focus:border-primary focus:ring-primary";

  return (
    <div className="form-control">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        className={`input input-bordered w-full bg-white transition-all ${errorClass} ${className}`}
        {...props}
      />
      {error && <p className="text-red-600 text-sm mt-1.5 font-medium">{error}</p>}
    </div>
  );
}
