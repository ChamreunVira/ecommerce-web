"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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

type AppContextType = {
  router: AppRouterInstance;
  user: Partial<User> | null;
  cart: Partial<Cart> | null;
  cartItems: CartItem[];
  products: Product[];
  categories: Category[];
  isInitializing: boolean;
  sessionReady: boolean;
  getTotalCart: () => number;
  refreshCart: () => Promise<void>;
  handleAddProductToCart: (
    productId: number,
    quantity?: number,
  ) => Promise<void>;
  handleMinusProductFromCart: (
    cartId: number,
    quantity: number,
  ) => Promise<void>;
};

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx)
    throw new Error("useAppContext must be used within AppContextProvider");
  return ctx;
};

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const isMounted = useRef(true);

  const [user, setUser] = useState<Partial<User> | null>(null);
  const [cart, setCart] = useState<Partial<Cart> | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);

  const applyCart = useCallback((data: Partial<Cart>) => {
    setCart(data);
    setCartItems(data.cartItems ?? []);
  }, []);

  const getTotalCart = useCallback(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const refreshCart = useCallback(async () => {
    const res = await cartService.getAll().catch(() => null);
    if (res?.success && res.data) applyCart(res.data);
  }, [applyCart]);

  const handleAddProductToCart = useCallback(
    async (productId: number, quantity = 1) => {
      const response = await cartService.addToCart(productId, quantity)
        .catch((e) => {
          console.error("addToCart:", e);
          return null;
        });
      if (response?.success && response.data) applyCart(response.data);
    },
    [applyCart],
  );

  const handleMinusProductFromCart = useCallback(
    async (cartId: number, quantity: number) => {
      const response = await cartService
        .updateCart(cartId, quantity)
        .catch((e) => {
          console.error("updateCart:", e);
          return null;
        });
      if (response?.success && response.data) applyCart(response.data);
    },
    [applyCart],
  );

  useEffect(() => {
    isMounted.current = true;

    const init = async () => {
      try {
        const loggedIn = await authService.isAuthenticated().catch(() => false);

        const [categoryRes, cartRes, meRes] = await Promise.all([
          categoryService.getAll().catch(() => null),
          loggedIn ? cartService.getAll().catch(() => null) : null,
          loggedIn ? authService.me().catch(() => null) : null,
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
      cart,
      cartItems,
      products,
      categories,
      isInitializing,
      sessionReady: !isInitializing,
      getTotalCart,
      refreshCart,
      handleAddProductToCart,
      handleMinusProductFromCart,
    }),
    [
      router,
      user,
      cart,
      cartItems,
      products,
      categories,
      isInitializing,
      getTotalCart,
      refreshCart,
      handleAddProductToCart,
      handleMinusProductFromCart,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
