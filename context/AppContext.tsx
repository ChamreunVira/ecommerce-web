"use client";
import { Product } from "@/types/product";
import { useRouter } from "next/navigation"
import { productsDummyData } from "@/assets/assets";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type AppContextType = {
    router: AppRouterInstance,
    products: Product[]
}

export const AppContext = createContext<AppContextType | any>(null);

export const useAppContext = (): AppContextType => {
    return useContext(AppContext);
}

export const AppContextProvider = ({children}: {children: React.ReactNode}) => {
    const router = useRouter();

    const [products , setProducts] = useState<Product[]>([]);

    const handleFetchProduct = () => {
        setProducts(productsDummyData);
    }

    useEffect(() => {
        handleFetchProduct();
    } , []);
    
    const contextValue = {
        router,
        products
    }

  return (
    <AppContext.Provider value={contextValue}>
        {children}
    </AppContext.Provider>
  )
}

export default AppContext