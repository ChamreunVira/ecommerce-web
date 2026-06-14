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
import { Category } from "@/types/category";
import { categoryService } from "@/services/category-service";

type AppContextType = {
  router: AppRouterInstance;
  products: Product[];
  categories: Category[];
  handleAddProductToCart: (id: number, quantity?: number) => Promise<void>;
  handleMinusProductFromCart: (id: number , quantity: number) => Promise<void>;
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

type AppContextProviderType = {
  children: React.ReactNode
}

export const AppContextProvider: React.FC<AppContextProviderType> = ({ children }) => {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<Partial<User>>({});
  const [cart, setCart] = useState<Partial<Cart>>({});

  const getTotalCart = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleAddProductToCart = async (productId: number, quantity = 1) => {
    try {
      const response = await cartService.addToCart(productId, quantity);
      if (response.success) {
        setCart(response.data);
        setCartItems(response.data.cartItems);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMinusProductFromCart = async (cartId: number, quantity: number) => {
    try {
      const response = await cartService.updateCart(cartId, quantity);
      if (response.success) {
        setCart(response.data);
        setCartItems(response.data.cartItems);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const refreshCart = async () => {
    try {
      const response = await cartService.getAll();
      if (response.success) {
        setCart(response.data);
        setCartItems(response.data.cartItems);
      }
    } catch (error: any) {
      console.log("Fials to refresh cart: " + error.message);
    }
  };

  useEffect(() => {
    let isCurrent = true;

    const initApp = async () => {
      try {

        const [authResponse, categoryResponse, cartResponse] = await Promise.all([
          authService.isAuthenticated().catch(() => false),
          categoryService.getAll().catch(() => ({ success: false, data: [] })),
          cartService.getAll().catch(() => ({ success: false, data: { cartItems: [] } })),
        ]);

        if (!isCurrent) return;

        if (authResponse) {
          try {
            const currentUserResponse = await authService.me();
            if (currentUserResponse.success && isCurrent) {
              setUser(currentUserResponse.data);
            }
          } catch (err: any) {
            console.log(err.message);
          }
        }

        if (categoryResponse && categoryResponse.success) {
          setCategories(categoryResponse.data);
          setProducts(categoryResponse.data.flatMap((category: Category) => category.products || []));
        }

        if (cartResponse && cartResponse.success) {
          setCart(cartResponse.data);
          setCartItems(cartResponse.data.cartItems || []);
        }

      } catch (error: any) {
        console.log(error.message);
      }
    };

    initApp();

    return () => {
      isCurrent = false;
    };
  }, []);

  const contextValue: AppContextType = {
    cart,
    router,
    products,
    categories,
    handleAddProductToCart,
    handleMinusProductFromCart,
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
