"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Product } from "@/data/marketplace";
import { mapCartDatasToItems } from "@/lib/map-marketplace-cart";
import { getAuthToken } from "@/lib/auth-session";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import {
  addCartItem,
  decreaseCartItem,
  fetchCart,
  increaseCartItem,
  removeCartItem,
} from "@/services/cart.service";
import { ApiError } from "@/types/api";
import type { CartDatas } from "@/types/cart";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  total: number;
  isAdding: boolean;
  isLoading: boolean;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  incrementItem: (cartItemId: string) => Promise<void>;
  decrementItem: (cartItemId: string) => Promise<void>;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

function applyCartDatas(
  datas: CartDatas,
  setItems: (items: CartItem[]) => void,
  setTotals: (totals: { itemCount: number; total: number }) => void,
) {
  setItems(mapCartDatasToItems(datas));
  setTotals({
    itemCount: datas.total_item,
    total: datas.total_harga,
  });
}

function getCartErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [itemCount, setItemCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const setTotals = useCallback(
    (totals: { itemCount: number; total: number }) => {
      setItemCount(totals.itemCount);
      setTotal(totals.total);
    },
    [],
  );

  const refreshCart = useCallback(async () => {
    if (!getAuthToken()) {
      setItems([]);
      setItemCount(0);
      setTotal(0);
      return;
    }

    setIsLoading(true);
    try {
      const datas = await fetchCart();
      applyCartDatas(datas, setItems, setTotals);
    } catch {
      // diam di badge; halaman keranjang bisa handle sendiri
    } finally {
      setIsLoading(false);
    }
  }, [setTotals]);

  useEffect(() => {
    void refreshCart();
  }, [refreshCart]);

  const addItem = useCallback(
    async (product: Product, quantity = 1) => {
      setIsAdding(true);
      try {
        const result = await addCartItem({
          uuid_product: product.id,
          quantity,
        });
        applyCartDatas(result.data, setItems, setTotals);
        showSuccessToast(result.message);
      } catch (error) {
        showErrorToast(
          getCartErrorMessage(error, "Gagal menambahkan ke keranjang"),
        );
        throw error;
      } finally {
        setIsAdding(false);
      }
    },
    [setTotals],
  );

  const removeItem = useCallback(
    async (cartItemId: string) => {
      try {
        const result = await removeCartItem(cartItemId);
        applyCartDatas(result.data, setItems, setTotals);
        showSuccessToast(result.message);
      } catch (error) {
        showErrorToast(
          getCartErrorMessage(error, "Gagal menghapus item keranjang"),
        );
        throw error;
      }
    },
    [setTotals],
  );

  const incrementItem = useCallback(
    async (cartItemId: string) => {
      try {
        const result = await increaseCartItem(cartItemId);
        applyCartDatas(result.data, setItems, setTotals);
        showSuccessToast(result.message);
      } catch (error) {
        showErrorToast(
          getCartErrorMessage(error, "Gagal menambah jumlah item"),
        );
        throw error;
      }
    },
    [setTotals],
  );

  const decrementItem = useCallback(
    async (cartItemId: string) => {
      try {
        const result = await decreaseCartItem(cartItemId);
        applyCartDatas(result.data, setItems, setTotals);
        showSuccessToast(result.message);
      } catch (error) {
        showErrorToast(
          getCartErrorMessage(error, "Gagal mengurangi jumlah item"),
        );
        throw error;
      }
    },
    [setTotals],
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setItemCount(0);
    setTotal(0);
  }, []);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      total,
      isAdding,
      isLoading,
      addItem,
      removeItem,
      incrementItem,
      decrementItem,
      clearCart,
      refreshCart,
    }),
    [
      items,
      itemCount,
      total,
      isAdding,
      isLoading,
      addItem,
      removeItem,
      incrementItem,
      decrementItem,
      clearCart,
      refreshCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
