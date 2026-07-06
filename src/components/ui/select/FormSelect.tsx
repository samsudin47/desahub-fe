"use client";

import Label from "@/components/form/Label";
import { cn } from "@/lib/cn";
import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

export type FormSelectOption = {
  value: string;
  label: string;
};

type FormSelectProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: FormSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  id?: string;
};

export default function FormSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Pilih opsi",
  disabled = false,
  id,
}: FormSelectProps) {
  const fieldId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div>
      {label && <Label htmlFor={fieldId}>{label}</Label>}

      <Select.Root value={value} onValueChange={onChange} disabled={disabled}>
        <Select.Trigger
          id={fieldId}
          aria-label={label}
          className={cn(
            "group flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm shadow-theme-xs outline-none transition-colors",
            "focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10",
            "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400",
            "data-placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90",
          )}
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon asChild>
            <ChevronDown className="size-4 shrink-0 text-gray-400 transition-transform group-data-[state=open]:rotate-180" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className="z-[100000] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-lg dark:border-gray-700 dark:bg-gray-900"
            position="popper"
            sideOffset={6}
            align="start"
            style={{ width: "var(--radix-select-trigger-width)" }}
          >
            <Select.Viewport className="custom-scrollbar max-h-56 p-1.5">
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-sm outline-none",
                    "text-gray-800 data-highlighted:bg-brand-50 data-highlighted:text-brand-700",
                    "data-[state=checked]:bg-brand-50/70 data-[state=checked]:font-medium",
                    "dark:text-gray-200 dark:data-highlighted:bg-brand-500/10 dark:data-highlighted:text-brand-400",
                  )}
                >
                  <Select.ItemText className="flex-1 pr-6">
                    {option.label}
                  </Select.ItemText>
                  <Select.ItemIndicator className="absolute right-3">
                    <Check className="size-4 text-brand-600 dark:text-brand-400" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
