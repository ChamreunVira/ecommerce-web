"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { Product } from "@/types/product";
import { User } from "@/types/user";
import { Cart, CartItem } from "@/types/cart";
import { Category } from "@/types/category";

import { authService } from "@/services/auth-service";
import { cartService } from "@/services/cart-service";
import { categoryService } from "@/services/category-service";

async function safe<T>(promise: Promise<T>, errorLabel?: string): Promise<T | null> {
  try {
    return await promise;
  } catch (err) {
    if (errorLabel) console.error(`${errorLabel}:`, err);
    return null;
  }
}

type CartState = { cart: Partial<Cart> | null; cartItems: CartItem[] };
type CartAction = { type: "SET"; payload: Partial<Cart> } | { type: "CLEAR" };

const initialCartState: CartState = { cart: null, cartItems: [] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET":
      return { cart: action.payload, cartItems: action.payload.cartItems ?? [] };
    case "CLEAR":
      return initialCartState;
    default:
      return state;
  }
}

type AppContextType = {
  router: AppRouterInstance;
  user: Partial<User> | null;
  setUser: React.Dispatch<React.SetStateAction<Partial<User> | null>>;
  cart: Partial<Cart> | null;
  cartItems: CartItem[];
  products: Product[];
  categories: Category[];
  isInitializing: boolean;
  sessionReady: boolean;
  getTotalCart: () => number;
  refreshUser: () => Promise<Partial<User> | null>;
  refreshCart: () => Promise<void>;
  logout: () => void;
  handleAddProductToCart: (productId: number, quantity?: number) => Promise<void>;
  handleMinusProductFromCart: (cartId: number, quantity: number) => Promise<void>;
};

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppContextProvider");
  return ctx;
};

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const isMounted = useRef(true);

  const [user, setUser] = useState<Partial<User> | null>(null);
  const [cartState, dispatchCart] = useReducer(cartReducer, initialCartState);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);

  const applyCart = useCallback((data: Partial<Cart>) => {
    dispatchCart({ type: "SET", payload: data });
  }, []);

  const getTotalCart = useCallback(
    () => cartState.cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartState.cartItems],
  );

  const refreshCart = useCallback(async () => {
    const response = await safe(cartService.getAll());
    if (response?.success && response.data) applyCart(response.data);
  }, [applyCart]);

  const refreshUser = useCallback(async () => {
    const loggedIn = await safe(authService.isAuthenticated());
    if (!loggedIn) {
      setUser(null);
      return null;
    }

    const meRes = await safe(authService.me());
    if (meRes?.success && meRes.data) {
      setUser(meRes.data);
      const cartRes = await safe(cartService.getAll());
      if (cartRes?.success && cartRes.data) applyCart(cartRes.data);
      return meRes.data;
    }

    setUser(null);
    return null;
  }, [applyCart]);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    dispatchCart({ type: "CLEAR" });
  }, []);

  const handleAddProductToCart = useCallback(
    async (productId: number, quantity = 1) => {
      const response = await safe(
        cartService.addToCart(productId, quantity),
        "addToCart",
      );
      if (response?.success && response.data) applyCart(response.data);
    },
    [applyCart],
  );

  const handleMinusProductFromCart = useCallback(
    async (cartId: number, quantity: number) => {
      const response = await safe(
        cartService.updateCart(cartId, quantity),
        "updateCart",
      );
      if (response?.success && response.data) applyCart(response.data);
    },
    [applyCart],
  );

  useEffect(() => {
    isMounted.current = true;

    const init = async () => {
      try {
        const loggedIn = await safe(authService.isAuthenticated());

        const [categoryRes, cartRes, meRes] = await Promise.all([
          safe(categoryService.getAll()),
          loggedIn ? safe(cartService.getAll()) : null,
          loggedIn ? safe(authService.me()) : null,
        ]);

        if (!isMounted.current) return;

        if (meRes?.success && meRes.data) setUser(meRes.data);
        if (cartRes?.success && cartRes.data) applyCart(cartRes.data);
        if (categoryRes?.success && categoryRes.data) {
          setCategories(categoryRes.data);
          setProducts(categoryRes.data.flatMap((c: Category) => c.products ?? []));
        }
      } catch (err) {
        console.error("App init failed:", err);
      } finally {
        if (isMounted.current) setIsInitializing(false);
      }
    };

    init();
    return () => {
      isMounted.current = false;
    };
  }, [applyCart]);

  const value = useMemo(
    () => ({
      router,
      user,
      setUser,
      cart: cartState.cart,
      cartItems: cartState.cartItems,
      products,
      categories,
      isInitializing,
      sessionReady: !isInitializing,
      getTotalCart,
      refreshUser,
      refreshCart,
      logout,
      handleAddProductToCart,
      handleMinusProductFromCart,
    }),
    [
      router,
      user,
      cartState,
      products,
      categories,
      isInitializing,
      getTotalCart,
      refreshUser,
      refreshCart,
      logout,
      handleAddProductToCart,
      handleMinusProductFromCart,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;