import type { ButtonHTMLAttributes } from "react";
import { cn } from "../utils/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-accent-500/25 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-slate-900 text-white shadow-card hover:bg-slate-800",
        variant === "secondary" &&
          "border border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50",
        variant === "ghost" && "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        variant === "danger" &&
          "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
        className,
      )}
      {...props}
    />
  );
}

export default Button;
