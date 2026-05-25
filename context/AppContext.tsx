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
  handleAddProductToCart: (id: string) => void;
  getTotalCart: () => number;
  cartItems: CartItem[];
  accessToken: string | null;
  setAccessToken: (accessToken: string) => void;
  user: Partial<User>;
  cart: Partial<Cart>;
};

export const AppContext = createContext<AppContextType | any>(null);

export const useAppContext = (): AppContextType => {
  return useContext(AppContext);
};

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user , setUser] = useState<Partial<User>>({});
  const [cart , setCart] = useState<Partial<Cart>>({});

  const handleFetchProduct = async () => {
    try {
      const response = await productService.getAll();
      if(response.success) {
        setProducts(response.data);
      }
    }catch (e: any) {
      console.log(e.message);
    }
  };

  const getTotalCart = () => {
    return new Set(cartItems).size;
  };

  const handleAddProductToCart = async (productId: number) => {
    try {
      const response = await cartService.addToCart(productId , 1);
      if(response.success) {
        toast.success("Product added into cart.");
      }
    }catch(e: any) {
      console.log(e.message);
    }
  };

  const handleFetchCart = async () => {
    try {
      const response = await cartService.getAll();
      if(response.success) {
        setCartItems(response.data.cartItems);
      }
    }catch(e: any) {
      console.log(e.message);
    }
  }

  const isAuthenticated = async () => {
    try {
      const response = await authService.isAuthenticated();
      return response;
    }catch(e: any) {
      console.log(e.message);
    }
  }

  const handleCurrentUser = async () => {
    if(await isAuthenticated()) {
      const response = await authService.me();
    if(response.success) {
      console.log(response.data);
      setUser(response.data);
    }
    }
  }

  useEffect(() => {
    handleCurrentUser();
    handleFetchProduct();
    handleFetchCart();
  }, []);

  const contextValue = {
    cart,
    setCart,
    router,
    products,
    handleAddProductToCart,
    getTotalCart,
    cartItems,
    user
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppContext;
