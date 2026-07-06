"use client";

import Label from "@/components/form/Label";
import { cn } from "@/lib/cn";
import type { RoleOption } from "@/types/auth";
import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown, Loader2 } from "lucide-react";

type AuthRoleSelectProps = {
  label: string;
  required?: boolean;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  options: RoleOption[];
  placeholder?: string;
  isLoading?: boolean;
  loadError?: string | null;
  id?: string;
  name?: string;
};

export function AuthRoleSelect({
  label,
  required,
  error,
  value,
  onChange,
  options,
  placeholder = "Pilih role Anda",
  isLoading = false,
  loadError,
  id,
  name,
}: AuthRoleSelectProps) {
  const fieldId = id ?? name;
  const hasError = Boolean(error || loadError);
  const isDisabled = isLoading || options.length === 0;

  return (
    <div>
      <Label htmlFor={fieldId}>
        {label}
        {required && <span className="text-error-500"> *</span>}
      </Label>

      <Select.Root
        value={value || undefined}
        onValueChange={onChange}
        disabled={isDisabled}
        name={name}
      >
        <Select.Trigger
          id={fieldId}
          aria-label={label}
          className={cn(
            "group flex h-11 w-full items-center justify-between gap-2 rounded-lg border bg-white px-4 text-sm shadow-theme-xs outline-none transition-colors",
            "focus:border-desahub-500 focus:ring-2 focus:ring-desahub-100",
            "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400",
            "data-placeholder:text-gray-400",
            hasError
              ? "border-error-500 focus:border-error-500 focus:ring-error-500/10"
              : "border-gray-200",
          )}
        >
          <Select.Value
            placeholder={
              isLoading
                ? "Memuat role..."
                : loadError
                  ? "Gagal memuat role"
                  : placeholder
            }
          />
          <Select.Icon asChild>
            {isLoading ? (
              <Loader2 className="size-4 shrink-0 animate-spin text-gray-400" />
            ) : (
              <ChevronDown className="size-4 shrink-0 text-gray-400 transition-transform group-data-[state=open]:rotate-180" />
            )}
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className="z-50 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
            position="popper"
            sideOffset={6}
            align="start"
            style={{ width: "var(--radix-select-trigger-width)" }}
          >
            <Select.Viewport className="p-1">
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className={cn(
                    "relative flex cursor-pointer select-none items-start gap-2 rounded-md px-3 py-2.5 text-sm outline-none",
                    "text-gray-800 data-highlighted:bg-desahub-50 data-highlighted:text-desahub-700",
                    "data-[state=checked]:bg-desahub-50/60",
                  )}
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5 pr-6">
                    <Select.ItemText asChild>
                      <span className="font-medium leading-tight">{option.label}</span>
                    </Select.ItemText>
                    {option.description && (
                      <span className="text-xs leading-snug text-gray-500">
                        {option.description}
                      </span>
                    )}
                  </div>
                  <Select.ItemIndicator className="absolute right-3 top-3">
                    <Check className="size-4 text-desahub-600" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      {error && <p className="mt-1.5 text-xs text-error-500">{error}</p>}
      {!error && loadError && (
        <p className="mt-1.5 text-xs text-error-500">{loadError}</p>
      )}
    </div>
  );
}
