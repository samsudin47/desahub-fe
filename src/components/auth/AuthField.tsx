"use client";

import Label from "@/components/form/Label";
import { cn } from "@/lib/cn";
import { Eye, EyeOff } from "lucide-react";
import { useState, type InputHTMLAttributes } from "react";

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
};

export function AuthField({
  label,
  required,
  hint,
  error,
  id,
  className,
  ...props
}: AuthFieldProps) {
  const fieldId = id ?? props.name;

  return (
    <div>
      <Label htmlFor={fieldId}>
        {label}
        {required && <span className="text-error-500"> *</span>}
      </Label>
      <input
        id={fieldId}
        className={cn(
          "h-11 w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-desahub-500 focus:outline-none focus:ring-2 focus:ring-desahub-100",
          error ? "border-error-500 focus:border-error-500 focus:ring-error-500/10" : "border-gray-200",
          className
        )}
        {...props}
      />
      {(error || hint) && (
        <p className={cn("mt-1.5 text-xs", error ? "text-error-500" : "text-gray-500")}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

type PasswordFieldProps = Omit<AuthFieldProps, "type">;

export function PasswordField({ className, ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const fieldId = props.id ?? props.name;

  return (
    <div>
      <Label htmlFor={fieldId}>
        {props.label}
        {props.required && <span className="text-error-500"> *</span>}
      </Label>
      <div className="relative">
        <input
          id={fieldId}
          className={cn(
            "h-11 w-full rounded-lg border bg-white px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-desahub-500 focus:outline-none focus:ring-2 focus:ring-desahub-100",
            props.error ? "border-error-500 focus:border-error-500 focus:ring-error-500/10" : "border-gray-200",
            className
          )}
          type={visible ? "text" : "password"}
          name={props.name}
          placeholder={props.placeholder}
          autoComplete={props.autoComplete}
          value={props.value}
          onChange={props.onChange}
          disabled={props.disabled}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-600"
          aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {(props.error || props.hint) && (
        <p className={cn("mt-1.5 text-xs", props.error ? "text-error-500" : "text-gray-500")}>
          {props.error ?? props.hint}
        </p>
      )}
    </div>
  );
}

type AuthSelectProps = {
  label: string;
  required?: boolean;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  id?: string;
  name?: string;
};

export function AuthSelect({
  label,
  required,
  error,
  value,
  onChange,
  options,
  placeholder = "Pilih opsi",
  id,
  name,
}: AuthSelectProps) {
  const fieldId = id ?? name;

  return (
    <div>
      <Label htmlFor={fieldId}>
        {label}
        {required && <span className="text-error-500"> *</span>}
      </Label>
      <select
        id={fieldId}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-11 w-full appearance-none rounded-lg border bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:border-desahub-500 focus:outline-none focus:ring-2 focus:ring-desahub-100",
          error ? "border-error-500" : "border-gray-200",
          value ? "text-gray-800" : "text-gray-400"
        )}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-error-500">{error}</p>}
    </div>
  );
}
