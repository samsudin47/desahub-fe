import { env } from "@/config/env";
import type { CheckoutPaymentDatas } from "@/types/checkout";

type MidtransSnapResult = Record<string, unknown>;

export type MidtransSnapCallbacks = {
  onSuccess?: (result: MidtransSnapResult) => void;
  onPending?: (result: MidtransSnapResult) => void;
  onError?: (result: MidtransSnapResult) => void;
  onClose?: () => void;
};

type MidtransSnap = {
  init?: (clientKey: string) => void;
  pay: (token: string, callbacks?: MidtransSnapCallbacks) => void;
  embed: (
    token: string,
    options: MidtransSnapCallbacks & { embedId: string },
  ) => void;
  hide?: () => void;
  reset?: () => void;
};

declare global {
  interface Window {
    snap?: MidtransSnap;
  }
}

const SNAP_SCRIPT_ID = "midtrans-snap-script";

export const SNAP_EMBED_CONTAINER_ID = "desahub-snap-container";

let snapInitialized = false;
let snapLoadPromise: Promise<MidtransSnap> | null = null;
let embedQueue: Promise<void> = Promise.resolve();

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForElement(
  elementId: string,
  timeoutMs = 5000,
): Promise<HTMLElement> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const element = document.getElementById(elementId);
    if (element) return element;
    await wait(50);
  }

  throw new Error("Kontainer pembayaran tidak ditemukan");
}

function safeHideSnap(snap?: MidtransSnap) {
  if (!snap?.hide) return;
  try {
    snap.hide();
  } catch {
    // Snap may already be hidden / in a state that rejects hide.
  }
}

function safeInitSnap(snap: MidtransSnap, clientKey: string) {
  if (snapInitialized) return;
  if (typeof snap.init !== "function") {
    // Script baru biasanya sudah auto-init; anggap siap.
    snapInitialized = true;
    return;
  }

  try {
    snap.init(clientKey);
  } catch {
    // Sudah initialized (mis. setelah HMR) — anggap siap.
  }
  snapInitialized = true;
}

export async function loadMidtransSnap(clientKey: string): Promise<MidtransSnap> {
  if (typeof window === "undefined") {
    throw new Error("Midtrans Snap hanya tersedia di browser");
  }

  const snapScriptUrl = env.midtransSnapUrl;
  if (!snapScriptUrl) {
    throw new Error(
      "NEXT_PUBLIC_MIDTRANS_SNAP_URL harus dikonfigurasi di file .env",
    );
  }

  const existing = document.getElementById(
    SNAP_SCRIPT_ID,
  ) as HTMLScriptElement | null;

  if (
    window.snap &&
    existing?.dataset.clientKey === clientKey &&
    existing.src === snapScriptUrl
  ) {
    safeInitSnap(window.snap, clientKey);
    return window.snap;
  }

  if (snapLoadPromise) {
    return snapLoadPromise;
  }

  snapLoadPromise = (async () => {
    if (existing) {
      existing.remove();
      delete window.snap;
      snapInitialized = false;
    }

    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.id = SNAP_SCRIPT_ID;
      script.src = snapScriptUrl;
      script.setAttribute("data-client-key", clientKey);
      script.dataset.clientKey = clientKey;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("Gagal memuat Midtrans Snap. Coba lagi."));
      document.body.appendChild(script);
    });

    if (!window.snap) {
      throw new Error("Midtrans Snap gagal diinisialisasi");
    }

    // Script auto-calls init on load; keep our flag in sync.
    snapInitialized = true;
    return window.snap;
  })();

  try {
    return await snapLoadPromise;
  } finally {
    snapLoadPromise = null;
  }
}

export async function embedMidtransSnap(
  payment: Pick<CheckoutPaymentDatas, "snap_token" | "client_key">,
  embedId: string,
  callbacks: MidtransSnapCallbacks = {},
): Promise<void> {
  const runEmbed = async () => {
    const snap = await loadMidtransSnap(payment.client_key);

    // Embed hanya boleh dari state initialized. Tutup sesi sebelumnya dulu.
    safeHideSnap(snap);
    safeInitSnap(snap, payment.client_key);

    const container = await waitForElement(embedId);
    container.replaceChildren();

    // Tunggu 1 frame agar DOM container siap menerima iframe Snap.
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });

    snap.embed(payment.snap_token, {
      embedId,
      ...callbacks,
    });
  };

  embedQueue = embedQueue
    .catch(() => undefined)
    .then(async () => {
      try {
        await runEmbed();
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const isInvalidState =
          message.includes("uninitialized") ||
          message.includes("Invalid state") ||
          message.includes("not allowed to be called");

        if (!isInvalidState) {
          throw error;
        }

        // Pulihkan state Snap lalu coba sekali lagi.
        destroyMidtransSnap({ hard: true });
        const existing = document.getElementById(SNAP_SCRIPT_ID);
        existing?.remove();
        delete window.snap;
        snapInitialized = false;
        snapLoadPromise = null;

        await runEmbed();
      }
    });

  await embedQueue;
}

/** Soft cleanup: keep Snap initialized so embed can run again safely. */
export function destroyMidtransSnap(options: { hard?: boolean } = {}) {
  if (typeof window === "undefined") return;

  safeHideSnap(window.snap);

  if (options.hard) {
    try {
      window.snap?.reset?.();
    } catch {
      // ignore invalid transition
    }
    snapInitialized = false;
  }
}
