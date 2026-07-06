"use client";

import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/cn";

type ScrollAreaProps = {
  children: React.ReactNode;
  className?: string;
  viewportClassName?: string;
  showHorizontal?: boolean;
};

function ScrollBar({
  orientation = "vertical",
}: {
  orientation?: "vertical" | "horizontal";
}) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      orientation={orientation}
      className={cn(
        "flex touch-none select-none transition-colors",
        orientation === "vertical" &&
          "h-full w-2 border-l border-l-transparent p-px",
        orientation === "horizontal" &&
          "h-2 flex-col border-t border-t-transparent p-px",
      )}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-gray-300/90 hover:bg-brand-400/70 dark:bg-gray-600/90 dark:hover:bg-brand-500/60" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export default function ScrollArea({
  children,
  className,
  viewportClassName,
  showHorizontal = false,
}: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root
      type="auto"
      className={cn("relative overflow-hidden", className)}
    >
      <ScrollAreaPrimitive.Viewport
        className={cn("h-full w-full rounded-[inherit]", viewportClassName)}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar orientation="vertical" />
      {showHorizontal && <ScrollBar orientation="horizontal" />}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}
