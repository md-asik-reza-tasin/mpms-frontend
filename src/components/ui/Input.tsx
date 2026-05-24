import React, { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", type = "text", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={`w-full px-3 py-2 border rounded-lg text-sm transition-all duration-200 outline-none
            focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
            ${
              error
                ? "border-rose-300 focus:ring-rose-500/20 focus:border-rose-500 text-rose-900 placeholder-rose-300 bg-rose-50/20"
                : "border-slate-300 hover:border-slate-400 text-slate-900 placeholder-slate-400"
            }
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-rose-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
export type { InputProps };
