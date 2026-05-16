"use client";
import { productService } from "@/services/product-service";
import { Product } from "@/types/product";
import React, { useEffect, useState } from "react";

const ProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll();
      if (response.success) {
        setProducts(response.data);
        console.log(response);
      }
    } catch (e: any) {
      console.log(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchProduct();
    return () => new AbortController().abort();
  }, []);

  return (
    <div>
      {loading ? "loading fetching product from web server" : "loading"}
      {products.map((product, i) => (
        <div key={i}>
          <p>{product.name}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductTable;
