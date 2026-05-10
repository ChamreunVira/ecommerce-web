"use client";
import { Product } from "@/types/product";
import { useRouter } from "next/navigation"
import { addressDummyData, productsDummyData } from "@/assets/assets";
import React, { createContext, useContext, useEffect, useState } from "react";

export const AppContext = createContext<any>(null);

export const useAppContext = () => {
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
        router, products
    }

  return (
    <AppContext.Provider value={contextValue}>
        {children}
    </AppContext.Provider>
  )
}

export default AppContext