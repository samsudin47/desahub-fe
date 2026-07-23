"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import CheckoutLeaveModal from "@/components/marketplace/checkout/CheckoutLeaveModal";
import {
  ACTIVE_CHECKOUT_STORAGE_KEY,
  CART_PAGE_PATH,
  isCheckoutFlowPath,
} from "@/lib/checkout-routes";
import { getApiErrorMessage } from "@/lib/api-message";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { cancelCheckout, createCheckout } from "@/services/checkout.service";
import type { CheckoutDatas } from "@/types/checkout";
import { useCart } from "@/context/CartContext";

type ActiveCheckout = {
  uuid: string;
  status: string;
};

type LeavePromptState = {
  isOpen: boolean;
};

interface CheckoutContextValue {
  activeCheckoutUuid: string | null;
  isSubmitting: boolean;
  beginCheckout: (cartItemUuids: string[]) => Promise<CheckoutDatas>;
  setActiveCheckout: (checkout: ActiveCheckout | null) => void;
  clearActiveCheckout: () => void;
  markCheckoutCompleted: () => void;
  requestLeaveCheckout: () => void;
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

const initialLeavePrompt: LeavePromptState = {
  isOpen: false,
};

function readStoredCheckoutUuid(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_CHECKOUT_STORAGE_KEY);
}

function writeStoredCheckoutUuid(uuid: string | null) {
  if (typeof window === "undefined") return;
  if (!uuid) {
    localStorage.removeItem(ACTIVE_CHECKOUT_STORAGE_KEY);
    return;
  }

  localStorage.setItem(ACTIVE_CHECKOUT_STORAGE_KEY, uuid);
}

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { refreshCart } = useCart();
  const [activeCheckout, setActiveCheckoutState] = useState<ActiveCheckout | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leavePrompt, setLeavePrompt] = useState<LeavePromptState>(initialLeavePrompt);
  const [isCancellingLeave, setIsCancellingLeave] = useState(false);
  const isCompletingRef = useRef(false);
  const isCancellingRef = useRef(false);

  useEffect(() => {
    const storedUuid = readStoredCheckoutUuid();
    if (storedUuid) {
      setActiveCheckoutState({ uuid: storedUuid, status: "pending" });
    }
  }, []);

  const clearActiveCheckout = useCallback(() => {
    writeStoredCheckoutUuid(null);
    setActiveCheckoutState(null);
    isCompletingRef.current = false;
  }, []);

  const setActiveCheckout = useCallback((checkout: ActiveCheckout | null) => {
    writeStoredCheckoutUuid(checkout?.uuid ?? null);
    setActiveCheckoutState(checkout);
  }, []);

  const markCheckoutCompleted = useCallback(() => {
    isCompletingRef.current = true;
    clearActiveCheckout();
  }, [clearActiveCheckout]);

  const closeLeavePrompt = useCallback(() => {
    if (isCancellingLeave) return;
    setLeavePrompt(initialLeavePrompt);
  }, [isCancellingLeave]);

  const requestLeaveCheckout = useCallback(() => {
    if (isCompletingRef.current || isCancellingRef.current) {
      router.push(CART_PAGE_PATH);
      return;
    }

    setLeavePrompt({
      isOpen: true,
    });
  }, [router]);

  const beginCheckout = useCallback(async (cartItemUuids: string[]) => {
    setIsSubmitting(true);
    try {
      const result = await createCheckout({ cart_item_uuids: cartItemUuids });
      setActiveCheckout({
        uuid: result.data.uuid,
        status: result.data.status,
      });
      showSuccessToast(result.message);
      return result.data;
    } catch (error) {
      showErrorToast(getApiErrorMessage(error, "Gagal membuat checkout"));
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [setActiveCheckout]);

  const handleConfirmLeave = useCallback(async () => {
    const activeUuid = activeCheckout?.uuid;

    if (!activeUuid) {
      closeLeavePrompt();
      return;
    }

    if (isCompletingRef.current) {
      router.push(CART_PAGE_PATH);
      closeLeavePrompt();
      return;
    }

    isCancellingRef.current = true;
    setIsCancellingLeave(true);

    try {
      const result = await cancelCheckout(activeUuid);
      showSuccessToast(result.message);
      setActiveCheckoutState({
        uuid: result.data.checkout.uuid,
        status: result.data.checkout.status,
      });
      clearActiveCheckout();
      await refreshCart();
      closeLeavePrompt();
      router.push(CART_PAGE_PATH);
    } catch (error) {
      showErrorToast(getApiErrorMessage(error, "Gagal membatalkan checkout"));
    } finally {
      isCancellingRef.current = false;
      setIsCancellingLeave(false);
    }
  }, [
    activeCheckout?.uuid,
    clearActiveCheckout,
    closeLeavePrompt,
    refreshCart,
    router,
  ]);

  useEffect(() => {
    const activeUuid = activeCheckout?.uuid;
    if (!activeUuid || !pathname || !isCheckoutFlowPath(pathname)) return;

    const handleDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (!anchor.href) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      if (isCheckoutFlowPath(url.pathname)) return;
      if (url.pathname === pathname && url.search === window.location.search) return;

      event.preventDefault();
      requestLeaveCheckout();
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isCompletingRef.current || isCancellingRef.current) return;
      event.preventDefault();
      event.returnValue = "";
    };

    document.addEventListener("click", handleDocumentClick, true);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [activeCheckout?.uuid, pathname, requestLeaveCheckout]);

  const value = useMemo(
    () => ({
      activeCheckoutUuid: activeCheckout?.uuid ?? null,
      isSubmitting,
      beginCheckout,
      setActiveCheckout,
      clearActiveCheckout,
      markCheckoutCompleted,
      requestLeaveCheckout,
    }),
    [
      activeCheckout?.uuid,
      isSubmitting,
      beginCheckout,
      setActiveCheckout,
      clearActiveCheckout,
      markCheckoutCompleted,
      requestLeaveCheckout,
    ],
  );

  return (
    <CheckoutContext.Provider value={value}>
      {children}
      <CheckoutLeaveModal
        isOpen={leavePrompt.isOpen}
        isLoading={isCancellingLeave}
        onConfirm={() => void handleConfirmLeave()}
        onCancel={closeLeavePrompt}
      />
    </CheckoutContext.Provider>
  );
}

export function useCheckoutFlow() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckoutFlow must be used within CheckoutProvider");
  }

  return context;
}
