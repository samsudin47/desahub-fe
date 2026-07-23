import {
  createCheckoutPayment,
  fetchCheckoutPayment,
} from "@/services/checkout.service";
import {
  destroyMidtransSnap,
  embedMidtransSnap,
  SNAP_EMBED_CONTAINER_ID,
  type MidtransSnapCallbacks,
} from "@/lib/midtrans-snap";
import type {
  CheckoutPaymentDatas,
  CheckoutPaymentStatus,
} from "@/types/checkout";

const TERMINAL_STATUSES = new Set<CheckoutPaymentStatus>([
  "paid",
  "failed",
  "expired",
  "cancelled",
]);

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function pollCheckoutPayment(
  checkoutUuid: string,
  options: {
    maxAttempts?: number;
    intervalMs?: number;
    signal?: AbortSignal;
  } = {},
): Promise<CheckoutPaymentDatas> {
  const maxAttempts = options.maxAttempts ?? 8;
  const intervalMs = options.intervalMs ?? 1500;
  let latest = await fetchCheckoutPayment(checkoutUuid);

  for (let attempt = 1; attempt < maxAttempts; attempt += 1) {
    if (TERMINAL_STATUSES.has(latest.status)) {
      return latest;
    }

    if (options.signal?.aborted) {
      return latest;
    }

    await wait(intervalMs);
    latest = await fetchCheckoutPayment(checkoutUuid);
  }

  return latest;
}

export async function prepareCheckoutPayment(
  checkoutUuid: string,
): Promise<CheckoutPaymentDatas> {
  const result = await createCheckoutPayment(checkoutUuid);
  return result.data;
}

export async function embedCheckoutPayment(
  payment: CheckoutPaymentDatas,
  options: {
    embedId?: string;
    onPaymentResolved?: (payment: CheckoutPaymentDatas) => void;
  } = {},
): Promise<void> {
  const checkoutUuid = payment.uuid_checkout;
  const embedId = options.embedId ?? SNAP_EMBED_CONTAINER_ID;

  const resolveFromBackend: MidtransSnapCallbacks = {
    onSuccess: () => {
      void pollCheckoutPayment(checkoutUuid).then((latest) => {
        options.onPaymentResolved?.(latest);
      });
    },
    onPending: () => {
      void pollCheckoutPayment(checkoutUuid).then((latest) => {
        options.onPaymentResolved?.(latest);
      });
    },
    onError: () => {
      void pollCheckoutPayment(checkoutUuid).then((latest) => {
        options.onPaymentResolved?.(latest);
      });
    },
    onClose: () => {
      void pollCheckoutPayment(checkoutUuid, { maxAttempts: 3 }).then(
        (latest) => {
          options.onPaymentResolved?.(latest);
        },
      );
    },
  };

  await embedMidtransSnap(payment, embedId, resolveFromBackend);
}

export function cleanupCheckoutPayment(options: { hard?: boolean } = {}) {
  destroyMidtransSnap(options);
}
