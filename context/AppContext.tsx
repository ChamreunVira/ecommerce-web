"use client";
import { Product } from "@/types/product";
import { useRouter } from "next/navigation";
import { productsDummyData } from "@/assets/assets";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type AppContextType = {
  router: AppRouterInstance;
  products: Product[];
  handleAddProductToCart: (id: string) => void;
  getTotalCart: () => number;
  cartItems: string[];
  accessToken: string | null;
  setAccessToken: (accessToken: string) => void;
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
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [accessToken , setAccessToken] = useState<string | null>(null);

  const handleFetchProduct = () => {
    setProducts(productsDummyData);
  };

  const getTotalCart = () => {
    return new Set(cartItems).size;
  };

  const handleAddProductToCart = (productId: string) => {
    setCartItems([...cartItems, productId]);
    console.log(cartItems);
  };

  useEffect(() => {
    handleFetchProduct();
  }, []);

  const contextValue = {
    router,
    products,
    handleAddProductToCart,
    getTotalCart,
    cartItems,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppContext;
