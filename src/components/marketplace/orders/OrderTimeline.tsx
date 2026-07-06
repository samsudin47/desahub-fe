import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import type { OrderStatus } from "@/data/marketplace";

const timelineSteps = [
  { key: "ordered", label: "Pesanan Dibuat" },
  { key: "confirmed", label: "Dikonfirmasi" },
  { key: "packed", label: "Dikemas" },
  { key: "shipped", label: "Dikirim" },
  { key: "completed", label: "Selesai" },
] as const;

const statusToStep: Record<OrderStatus, number> = {
  menunggu_pembayaran: 0,
  diproses: 2,
  dikirim: 3,
  selesai: 4,
  dibatalkan: -1,
};

export default function OrderTimeline({ status }: { status: OrderStatus }) {
  const currentStep = statusToStep[status];

  if (status === "dibatalkan") {
    return (
      <p className="text-sm text-error-600">Pesanan ini telah dibatalkan.</p>
    );
  }

  return (
    <div className="flex items-center justify-between">
      {timelineSteps.map((step, i) => (
        <div key={step.key} className="flex flex-1 flex-col items-center">
          <div className="flex w-full items-center">
            {i > 0 && (
              <div
                className={cn(
                  "h-0.5 flex-1",
                  i <= currentStep ? "bg-desahub-500" : "bg-gray-200"
                )}
              />
            )}
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full",
                i <= currentStep
                  ? "bg-desahub-500 text-white"
                  : "bg-gray-100 text-gray-400"
              )}
            >
              {i < currentStep ? (
                <Check className="size-4" />
              ) : (
                <span className="text-xs font-semibold">{i + 1}</span>
              )}
            </span>
            {i < timelineSteps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1",
                  i < currentStep ? "bg-desahub-500" : "bg-gray-200"
                )}
              />
            )}
          </div>
          <span
            className={cn(
              "mt-2 hidden text-center text-xs font-medium sm:block",
              i <= currentStep ? "text-desahub-600" : "text-gray-400"
            )}
          >
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}
