import { cn } from "@/lib/cn";

const steps = [
  { label: "Checkout", step: 1 },
  { label: "Pembayaran", step: 2 },
  { label: "Selesai", step: 3 },
];

export default function CheckoutSteps({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {steps.map((s, i) => (
        <div key={s.step} className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-sm font-semibold",
                current >= s.step
                  ? "bg-desahub-500 text-white"
                  : "bg-gray-100 text-gray-400"
              )}
            >
              {s.step}
            </span>
            <span
              className={cn(
                "hidden text-sm font-medium sm:inline",
                current >= s.step ? "text-desahub-600" : "text-gray-400"
              )}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "h-px w-8 sm:w-16",
                current > s.step ? "bg-desahub-500" : "bg-gray-200"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
