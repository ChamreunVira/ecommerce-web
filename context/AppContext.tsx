"use client";
import { Product } from "@/types/product";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { productService } from "@/services/product-service";
import { User } from "@/types/user";
import { authService } from "@/services/auth-service";
import { cartService } from "@/services/cart-service";
import { toast } from "react-toastify";
import { Cart, CartItem } from "@/types/cart";

type AppContextType = {
  router: AppRouterInstance;
  products: Product[];
  handleAddProductToCart: (id: string | number, quantity?: number) => Promise<void>;
  refreshCart: () => Promise<void>;
  getTotalCart: () => number;
  cartItems: CartItem[];
  user: Partial<User>;
  cart: Partial<Cart>;
};

export const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<Partial<User>>({});
  const [cart, setCart] = useState<Partial<Cart>>({});

  const getTotalCart = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleAddProductToCart = async (productId: string | number, quantity = 1) => {
    try {
      const response = await cartService.addToCart(Number(productId), quantity);
      if(response.success) {
        setCart(response.data);
        setCartItems(response.data.cartItems);
        toast.success("Product added into cart.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const refreshCart = async () => {
    try {
      const response = await cartService.getAll();
      if (response.success) {
        setCart(response.data);
        setCartItems(response.data.cartItems);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let isCurrent = true;

    const hydrateApp = async () => {
      try {
        const [authResponse, productResponse, cartResponse] = await Promise.all([
          authService.isAuthenticated(),
          productService.getAll(),
          cartService.getAll(),
        ]);

        if (!isCurrent) return;

        if (authResponse) {
          const currentUserResponse = await authService.me();
          if (currentUserResponse.success && isCurrent) {
            setUser(currentUserResponse.data);
          }
        }

        if (productResponse.success) {
          setProducts(productResponse.data);
        }

        if (cartResponse.success) {
          setCart(cartResponse.data);
          setCartItems(cartResponse.data.cartItems);
        }
      } catch (error) {
        console.log(error);
      }
    };

    hydrateApp();

    return () => {
      isCurrent = false;
    };
  }, []);

  const contextValue: AppContextType = {
    cart,
    router,
    products,
    handleAddProductToCart,
    refreshCart,
    getTotalCart,
    cartItems,
    user
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppContext;
